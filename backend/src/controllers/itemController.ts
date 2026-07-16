import { Request, Response } from 'express';
import Item from '../models/Item';
import Wishlist from '../models/Wishlist';
import Booking from '../models/Booking';

// Добавить вещь
export const addItem = async (req: Request, res: Response): Promise<void> => {
	try {
		const wishlist = await Wishlist.findById(req.params.wishlistId);
		if (!wishlist) {
			res.status(404).json({ message: 'Вишлист не найден' });
			return;
		}
		if (wishlist.author.toString() !== req.user!.userId) {
			res.status(403).json({ message: 'Только автор может добавлять вещи' });
			return;
		}

		const { title, image, shopUrl, price, priority } = req.body;
		const item = await Item.create({
			wishlist: wishlist._id,
			title,
			image,
			shopUrl,
			...(price !== undefined && { price }),
			...(priority !== undefined && { priority }),
		});

		res.status(201).json(item);
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка добавления вещи' });
	}
};

// Обновить вещь
export const updateItem = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const item = await Item.findById(req.params.id);
		if (!item) {
			res.status(404).json({ message: 'Вещь не найдена' });
			return;
		}

		const wishlist = await Wishlist.findById(item.wishlist);
		if (!wishlist || wishlist.author.toString() !== req.user!.userId) {
			res.status(403).json({ message: 'Нет доступа' });
			return;
		}

		const { title, image, shopUrl, price, priority } = req.body;
		if (title !== undefined) item.title = title;
		if (image !== undefined) item.image = image;
		if (shopUrl !== undefined) item.shopUrl = shopUrl;
		if (price !== undefined) item.price = price;
		if (priority !== undefined) item.priority = priority;

		await item.save();
		res.json(item);
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка обновления вещи' });
	}
};

// Удалить вещь
export const deleteItem = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const item = await Item.findById(req.params.id);
		if (!item) {
			res.status(404).json({ message: 'Вещь не найдена' });
			return;
		}

		const wishlist = await Wishlist.findById(item.wishlist);
		if (!wishlist || wishlist.author.toString() !== req.user!.userId) {
			res.status(403).json({ message: 'Нет доступа' });
			return;
		}

		await Booking.deleteMany({ item: item._id });
		await Item.findByIdAndDelete(req.params.id);

		res.json({ message: 'Вещь удалена' });
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка удаления вещи' });
	}
};
