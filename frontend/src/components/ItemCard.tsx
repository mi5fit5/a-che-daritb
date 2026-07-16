import React, { useState } from 'react';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TWishlistItem } from '@types';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';

interface Props {
	item: TWishlistItem;
	wishlistId: string;
	isOwner: boolean;
}

export const ItemCard: React.FC<Props> = ({ item, wishlistId, isOwner }) => {
	const dispatch = useDispatch();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isBooking, setIsBooking] = useState(false);
	const [isUnbooking, setIsUnbooking] = useState(false);

	const handleBook = async () => {
		setIsBooking(true);
		try {
			await wishlistRequests.bookItem(wishlistId, item._id);
			dispatch(fetchWishlistById(wishlistId));
		} catch (error) {
			console.error(error);
		} finally {
			setIsBooking(false);
		}
	};

	const handleUnbook = async () => {
		setIsUnbooking(true);
		try {
			await wishlistRequests.unbookItem(wishlistId, item._id);
			dispatch(fetchWishlistById(wishlistId));
		} catch (error) {
			console.error(error);
		} finally {
			setIsUnbooking(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm('Удалить эту вещь?')) return;
		setIsDeleting(true);
		try {
			await wishlistRequests.deleteItem(wishlistId, item._id);
			dispatch(fetchWishlistById(wishlistId));
		} catch (error) {
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	// Определяем hostname из ссылки для удобного отображения
	let shopDomain = '';
	try {
		shopDomain = new URL(item.shopUrl).hostname.replace('www.', '');
	} catch {
		shopDomain = item.shopUrl;
	}

	return (
		<div
			className={`item-card ${item.isBooked && !isOwner ? 'is-booked' : ''}`}>
			<img
				className='item-card-image'
				src={item.image}
				alt={item.title}
				onError={(e) => {
					(e.target as HTMLImageElement).src =
						'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
				}}
			/>

			<div className='item-card-body'>
				<div>
					<h4 className='item-card-title'>{item.title}</h4>
					<a
						className='item-card-link'
						href={item.shopUrl}
						target='_blank'
						rel='noopener noreferrer'>
						🔗 {shopDomain}
					</a>
				</div>

				<div className='item-card-actions'>
					{isOwner ? (
						/* Автор видит только кнопку удаления, никаких бронирований */
						<button
							className='btn btn-danger btn-sm'
							onClick={handleDelete}
							disabled={isDeleting}>
							{isDeleting ? '...' : 'Удалить'}
						</button>
					) : (
						<>
							{item.isBookedByMe ? (
								<>
									<span className='item-card-status booked'>
										Вы забронировали
									</span>
									<button
										className='btn btn-secondary btn-sm'
										onClick={handleUnbook}
										disabled={isUnbooking}>
										{isUnbooking ? '...' : 'Снять бронь'}
									</button>
								</>
							) : item.isBooked ? (
								<span className='item-card-status booked'>Забронировано</span>
							) : (
								<button
									className='btn btn-primary btn-sm'
									onClick={handleBook}
									disabled={isBooking}>
									{isBooking ? '...' : 'Забронировать'}
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};
