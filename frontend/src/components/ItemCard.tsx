import React, { useState } from 'react';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TWishlistItem, TItemPriority } from '@types';
import { PRIORITY_WEIGHT } from '@types';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';

interface Props {
	item: TWishlistItem;
	wishlistId: string;
	isOwner: boolean;
}

const formatPrice = (price: number): string => {
	return price.toLocaleString('ru-RU') + ' ₽';
};

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

	let shopDomain = '';
	try {
		shopDomain = new URL(item.shopUrl).hostname.replace('www.', '');
	} catch {
		shopDomain = item.shopUrl;
	}

	const renderStars = (priority?: TItemPriority) => {
		const weight = priority ? PRIORITY_WEIGHT[priority] : 1;
		return (
			<div className='item-card-stars'>
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={`star ${star <= weight ? 'filled' : 'empty'}`}>
						★
					</span>
				))}
			</div>
		);
	};

	return (
		<div className={`item-card ${item.isBooked ? 'is-booked' : ''}`}>
			{renderStars(item.priority)}

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
				{item.price != null && item.price > 0 && (
					<span className='item-card-price'>{formatPrice(item.price)}</span>
				)}

				<h4 className='item-card-title'>{item.title}</h4>

				<a
					className='item-card-link'
					href={item.shopUrl}
					target='_blank'
					rel='noopener noreferrer'>
					🔗 {shopDomain}
				</a>

				<div className='item-card-actions'>
					{isOwner ? (
						<>
							{item.isBooked ? (
								<span className='item-card-owner-booked'>Забронировано</span>
							) : (
								<button
									className='btn btn-danger btn-sm'
									onClick={handleDelete}
									disabled={isDeleting}>
									{isDeleting ? '...' : 'Удалить'}
								</button>
							)}
						</>
					) : (
						<>
							{item.isBookedByMe ? (
								<button
									className='btn btn-outline-warning btn-sm'
									onClick={handleUnbook}
									disabled={isUnbooking}
									style={{ width: '100%' }}>
									{isUnbooking ? '...' : 'Снять бронь'}
								</button>
							) : item.isBooked ? (
								<span
									className='item-card-status booked'
									style={{ width: '100%', justifyContent: 'center' }}>
									Забронировано
								</span>
							) : (
								<button
									className='btn btn-outline-primary btn-sm'
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
