import React, { useState } from 'react';
import { clsx } from 'clsx';

import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TWishlistItem, TItemPriority } from '@types';
import { PRIORITY_WEIGHT } from '@types';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';

import { Button } from '@ui';
import { EditItemModal, ConfirmModal } from '@modals';

import styles from './ItemCard.module.scss';

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
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
		setIsDeleting(true);
		try {
			await wishlistRequests.deleteItem(wishlistId, item._id);
			dispatch(fetchWishlistById(wishlistId));
		} catch (error) {
			console.error(error);
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
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
			<div className={styles.stars}>
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={star <= weight ? styles.starFilled : styles.starEmpty}>
						★
					</span>
				))}
			</div>
		);
	};

	return (
		<>
			<div className={clsx(styles.card, item.isBooked && styles.isBooked)}>
				<div className={styles.topBar}>
					{renderStars(item.priority)}
					{isOwner && !item.isBooked && (
						<button
							className={styles.editBtn}
							onClick={() => setIsEditing(true)}
							title='Редактировать'>
							✎
						</button>
					)}
				</div>

				<img
					className={styles.image}
					src={item.image}
					alt={item.title}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
					}}
				/>

				<div className={styles.body}>
					{item.price != null && item.price > 0 && (
						<span className={styles.price}>{formatPrice(item.price)}</span>
					)}

					<h4 className={styles.title}>{item.title}</h4>

					<a
						className={styles.link}
						href={item.shopUrl}
						target='_blank'
						rel='noopener noreferrer'>
						🔗 {shopDomain}
					</a>

					<div className={styles.actions}>
						{isOwner ? (
							<>
								{item.isBooked ? (
									<span className={styles.ownerBooked}>Забронировано</span>
								) : (
									<Button
										variant='danger'
										size='sm'
										onClick={() => setShowDeleteConfirm(true)}
										disabled={isDeleting}>
										{isDeleting ? '...' : 'Удалить'}
									</Button>
								)}
							</>
						) : (
							<>
								{item.isBookedByMe ? (
									<Button
										variant='outlineWarning'
										size='sm'
										onClick={handleUnbook}
										disabled={isUnbooking}
										style={{ width: '100%' }}>
										{isUnbooking ? '...' : 'Снять бронь'}
									</Button>
								) : item.isBooked ? (
									<span
										className={clsx(styles.status, styles.statusBooked)}
										style={{ width: '100%', justifyContent: 'center' }}>
										Забронировано
									</span>
								) : (
									<Button
										variant='outlinePrimary'
										size='sm'
										className={styles.bookBtn}
										onClick={handleBook}
										disabled={isBooking}>
										{isBooking ? '...' : 'Забронировать'}
									</Button>
								)}
							</>
						)}
					</div>
				</div>
			</div>

			{isEditing && (
				<EditItemModal item={item} onClose={() => setIsEditing(false)} />
			)}

			{showDeleteConfirm && (
				<ConfirmModal
					title='Удалить вещь'
					message={`Удалить «${item.title}»?`}
					confirmText='Удалить'
					variant='danger'
					onConfirm={handleDelete}
					onCancel={() => setShowDeleteConfirm(false)}
				/>
			)}
		</>
	);
};
