import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Item from '../models/Item';
import Wishlist from '../models/Wishlist';

// Забронировать вещь
export const bookItem = async (req: Request, res: Response): Promise<void> => {
	try {
		const item = await Item.findById(req.params.itemId);
		if (!item) {
			res.status(404).json({ message: 'Вещь не найдена' });
			return;
		}

		const wishlist = await Wishlist.findById(item.wishlist);
		if (!wishlist) {
			res.status(404).json({ message: 'Вишлист не найден' });
			return;
		}

		// Автор вишлиста не может бронировать свои вещи
		if (wishlist.author.toString() === req.user!.userId) {
			res.status(403).json({ message: 'Автор не может бронировать свои вещи' });
			return;
		}

		// Проверяем, не забронирована ли уже
		const existing = await Booking.findOne({ item: item._id });
		if (existing) {
			res.status(409).json({ message: 'Вещь уже забронирована' });
			return;
		}

		const booking = await Booking.create({
			item: item._id,
			bookedBy: req.user!.userId,
		});

		res.status(201).json({
			message: 'Вещь забронирована',
			booking: {
				_id: booking._id,
				item: booking.item,
				createdAt: booking.createdAt,
			},
		});
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка бронирования' });
	}
};

// Снять бронь
export const unbookItem = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const booking = await Booking.findOne({ item: req.params.itemId });
		if (!booking) {
			res.status(404).json({ message: 'Бронь не найдена' });
			return;
		}

		if (booking.bookedBy.toString() !== req.user!.userId) {
			res
				.status(403)
				.json({ message: 'Снять бронь может только тот, кто её поставил' });
			return;
		}

		await Booking.findByIdAndDelete(booking._id);
		res.json({ message: 'Бронь снята' });
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка снятия брони' });
	}
};
