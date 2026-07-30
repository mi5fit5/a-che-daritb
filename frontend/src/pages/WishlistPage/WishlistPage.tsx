import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

import { useDispatch, useSelector } from '@store';
import { fetchWishlistById, deleteWishlist } from '@slices/wishlistSlice';
import { useWishlistSocket } from '@hooks/useWishlistSocket';
import type { TWishlistItem } from '@types';
import { PRIORITY_WEIGHT } from '@types';

import { ItemCard } from '@items';
import { AddItemModal, EditWishlistModal, ConfirmModal } from '@modals';
import { Loader, Button } from '@ui';

import styles from './WishlistPage.module.scss';

type SortMode = 'default' | 'price-asc' | 'price-desc' | 'priority';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
	{ value: 'default', label: 'По умолчанию' },
	{ value: 'price-desc', label: 'Цена ↓' },
	{ value: 'price-asc', label: 'Цена ↑' },
	{ value: 'priority', label: 'По важности' },
];

function sortItems(items: TWishlistItem[], mode: SortMode): TWishlistItem[] {
	if (mode === 'default') return items;

	return [...items].sort((a, b) => {
		if (mode === 'price-desc') {
			return (b.price ?? 0) - (a.price ?? 0);
		}
		if (mode === 'price-asc') {
			return (a.price ?? 0) - (b.price ?? 0);
		}
		if (mode === 'priority') {
			const wa = a.priority ? PRIORITY_WEIGHT[a.priority] : 0;
			const wb = b.priority ? PRIORITY_WEIGHT[b.priority] : 0;
			return wb - wa;
		}
		return 0;
	});
}

export const WishlistPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		currentWishlist: wishlist,
		isLoading,
		error,
	} = useSelector((state) => state.wishlist);

	const [isDeleting, setIsDeleting] = useState(false);
	const [showAddItem, setShowAddItem] = useState(false);
	const [showEditWishlist, setShowEditWishlist] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showCopied, setShowCopied] = useState(false);
	const [sortMode, setSortMode] = useState<SortMode>('default');

	useEffect(() => {
		if (id) {
			dispatch(fetchWishlistById(id));
		}
	}, [id, dispatch]);

	useWishlistSocket(id);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await dispatch(deleteWishlist(id!)).unwrap();
			navigate('/my');
		} catch {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleShare = useCallback(() => {
		const url = `${window.location.origin}/wishlist/${id}`;
		navigator.clipboard.writeText(url).then(() => {
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		});
	}, [id]);

	const sortedItems = useMemo(() => {
		if (!wishlist) return [];
		return sortItems(wishlist.items, sortMode);
	}, [wishlist, sortMode]);

	if (isLoading && !wishlist) return <Loader />;

	if (error || !wishlist) {
		return (
			<div className={styles.emptyState}>
				<h2 className={styles.emptyStateTitle}>Вишлист не найден</h2>
				<Link
					to='/'
					className='btn btn-secondary'
					style={{ marginTop: '1rem' }}>
					Вернуться на главную
				</Link>
			</div>
		);
	}

	const authorName =
		typeof wishlist.author === 'object' ? wishlist.author.username : 'Unknown';
	const initial = authorName.charAt(0).toUpperCase();

	return (
		<div className={styles.detail}>
			<Link to='/' className={styles.backLink}>
				← Назад к ленте
			</Link>

			<div className={styles.hero}>
				<img
					className={styles.heroImage}
					src={wishlist.coverImage}
					alt={wishlist.title}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80';
					}}
				/>
				<div className={styles.heroOverlay}>
					<div className={styles.heroActions}>
						{wishlist.isOwner && (
							<button
								className={styles.heroBtn}
								onClick={() => setShowEditWishlist(true)}
								title='Редактировать вишлист'>
								✎
							</button>
						)}
						<div className={styles.heroShareWrapper}>
							<button
								className={styles.heroBtn}
								onClick={handleShare}
								title='Поделиться'>
								🔗
							</button>
							{showCopied && (
								<span className={styles.heroTooltip}>Скопировано!</span>
							)}
						</div>
					</div>
					<h1 className={styles.heroTitle}>{wishlist.title}</h1>
					<div className={styles.heroAuthor}>
						<div className={styles.heroAuthorAvatar}>{initial}</div>
						<span>@{authorName}</span>
					</div>
				</div>
			</div>

			{wishlist.isOwner && (
				<div className={styles.actions}>
					<Button
						variant='primary'
						onClick={() => setShowAddItem(true)}
						id='add-item-btn'>
						Добавить вещь
					</Button>
					<Button
						variant='danger'
						onClick={() => setShowDeleteConfirm(true)}
						disabled={isDeleting}>
						{isDeleting ? 'Удаление...' : 'Удалить вишлист'}
					</Button>
				</div>
			)}

			<div className={styles.itemsHeader}>
				<h2 className={styles.itemsTitle}>Список желаний</h2>
				<span className={styles.itemsCount}>{wishlist.items.length} вещей</span>
			</div>

			{wishlist.items.length > 0 && (
				<div
					className={styles.sortControls}
					style={{ marginBottom: 'var(--space-lg)' }}>
					{SORT_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							className={clsx(
								styles.sortBtn,
								sortMode === opt.value && styles.sortBtnActive
							)}
							onClick={() => setSortMode(opt.value)}>
							{opt.label}
						</button>
					))}
				</div>
			)}

			{wishlist.items.length === 0 ? (
				<div className={styles.emptyState}>
					<h2 className={styles.emptyStateTitle}>Список пуст</h2>
					<p className={styles.emptyStateText}>
						{wishlist.isOwner
							? 'Добавьте свою первую желаемую вещь!'
							: 'Автор ещё не добавил вещей'}
					</p>
				</div>
			) : (
				<div className={styles.itemsList}>
					{sortedItems.map((item: TWishlistItem) => (
						<ItemCard
							key={item._id}
							item={item}
							wishlistId={wishlist._id}
							isOwner={wishlist.isOwner}
						/>
					))}
				</div>
			)}

			{showAddItem && (
				<AddItemModal
					wishlistId={wishlist._id}
					onClose={() => setShowAddItem(false)}
				/>
			)}

			{showEditWishlist && (
				<EditWishlistModal
					wishlist={wishlist}
					onClose={() => setShowEditWishlist(false)}
				/>
			)}

			{showDeleteConfirm && (
				<ConfirmModal
					title='Удалить вишлист'
					message='Удалить этот вишлист и все его вещи? Это действие необратимо.'
					confirmText='Удалить'
					variant='danger'
					onConfirm={handleDelete}
					onCancel={() => setShowDeleteConfirm(false)}
				/>
			)}
		</div>
	);
};
