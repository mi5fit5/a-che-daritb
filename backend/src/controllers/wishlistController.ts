import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import Item from '../models/Item';
import Booking from '../models/Booking';
import mongoose from 'mongoose';

// Публичная лента
export const getFeed = async (req: Request, res: Response): Promise<void> => {
	try {
		const limit = Math.min(parseInt(req.query.limit as string) || 12, 50);
		const cursor = req.query.cursor as string | undefined;
		const search = req.query.search as string | undefined;

		const filter: Record<string, unknown> = { isPublic: true };

		if (cursor) {
			filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
		}
		if (search) {
			filter.title = { $regex: search, $options: 'i' };
		}

		const wishlists = await Wishlist.aggregate([
			{ $match: filter },
			{
				$lookup: {
					from: 'items',
					localField: '_id',
					foreignField: 'wishlist',
					as: 'itemsList',
				},
			},
			{ $match: { 'itemsList.0': { $exists: true } } },
			{ $sort: { _id: -1 } },
			{ $limit: limit + 1 },
			{
				$lookup: {
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'authorData',
				},
			},
			{ $unwind: '$authorData' },
			{
				$project: {
					_id: 1,
					title: 1,
					coverImage: 1,
					createdAt: 1,
					author: {
						_id: '$authorData._id',
						username: '$authorData.username',
					},
					itemCount: { $size: '$itemsList' },
				},
			},
		]);

		const hasMore = wishlists.length > limit;
		const results = hasMore ? wishlists.slice(0, limit) : wishlists;

		const data = results.map((w) => ({
			_id: w._id,
			title: w.title,
			coverImage: w.coverImage,
			author: w.author,
			itemCount: w.itemCount,
			createdAt: w.createdAt,
		}));

		res.json({
			wishlists: data,
			nextCursor: hasMore ? results[results.length - 1]._id : null,
		});
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка получения ленты' });
	}
};

// Мои вишлисты
export const getMyWishlists = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const wishlists = await Wishlist.find({ author: req.user!.userId })
			.sort({ _id: -1 })
			.populate('author', 'username')
			.lean();

		const wishlistIds = wishlists.map((w) => w._id);
		const itemCounts = await Item.aggregate([
			{ $match: { wishlist: { $in: wishlistIds } } },
			{ $group: { _id: '$wishlist', count: { $sum: 1 } } },
		]);
		const countMap = new Map(
			itemCounts.map((ic) => [ic._id.toString(), ic.count])
		);

		const data = wishlists.map((w) => ({
			_id: w._id,
			title: w.title,
			coverImage: w.coverImage,
			author: w.author,
			itemCount: countMap.get(w._id.toString()) || 0,
			createdAt: w.createdAt,
		}));

		res.json({ wishlists: data });
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка получения вишлистов' });
	}
};

// Вишлист
export const getWishlistById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const wishlist = await Wishlist.findById(req.params.id)
			.populate('author', 'username')
			.lean();

		if (!wishlist) {
			res.status(404).json({ message: 'Вишлист не найден' });
			return;
		}

		const items = await Item.find({ wishlist: wishlist._id })
			.sort({ _id: -1 })
			.lean();
		const isOwner = req.user!.userId === wishlist.author._id.toString();

		let itemsWithBooking;
		if (isOwner) {
			itemsWithBooking = items.map((item) => ({
				...item,
				isBooked: false,
				isBookedByMe: false,
			}));
		} else {
			const itemIds = items.map((i) => i._id);
			const bookings = await Booking.find({ item: { $in: itemIds } }).lean();
			const bookingMap = new Map(bookings.map((b) => [b.item.toString(), b]));

			itemsWithBooking = items.map((item) => {
				const booking = bookingMap.get(item._id.toString());
				return {
					...item,
					isBooked: !!booking,
					isBookedByMe: booking
						? booking.bookedBy.toString() === req.user!.userId
						: false,
				};
			});
		}

		res.json({
			...wishlist,
			items: itemsWithBooking,
			isOwner,
		});
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка получения вишлиста' });
	}
};

// Создать вишлист
export const createWishlist = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { title, coverImage } = req.body;
		const wishlist = await Wishlist.create({
			title,
			coverImage,
			author: req.user!.userId,
		});

		const populated = await wishlist.populate('author', 'username');
		res.status(201).json(populated);
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка создания вишлиста' });
	}
};

// Обновить вишлист
export const updateWishlist = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const wishlist = await Wishlist.findById(req.params.id);
		if (!wishlist) {
			res.status(404).json({ message: 'Вишлист не найден' });
			return;
		}
		if (wishlist.author.toString() !== req.user!.userId) {
			res.status(403).json({ message: 'Нет доступа' });
			return;
		}

		const { title, coverImage, isPublic } = req.body;
		if (title !== undefined) wishlist.title = title;
		if (coverImage !== undefined) wishlist.coverImage = coverImage;
		if (isPublic !== undefined) wishlist.isPublic = isPublic;

		await wishlist.save();
		const populated = await wishlist.populate('author', 'username');
		res.json(populated);
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка обновления вишлиста' });
	}
};

// Удалить вишлист
export const deleteWishlist = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const wishlist = await Wishlist.findById(req.params.id);
		if (!wishlist) {
			res.status(404).json({ message: 'Вишлист не найден' });
			return;
		}
		if (wishlist.author.toString() !== req.user!.userId) {
			res.status(403).json({ message: 'Нет доступа' });
			return;
		}

		const items = await Item.find({ wishlist: wishlist._id });
		const itemIds = items.map((i) => i._id);
		await Booking.deleteMany({ item: { $in: itemIds } });
		await Item.deleteMany({ wishlist: wishlist._id });
		await Wishlist.findByIdAndDelete(req.params.id);

		res.json({ message: 'Вишлист удалён' });
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка удаления вишлиста' });
	}
};
