import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { fetchWishlistById, deleteWishlist } from '@slices/wishlistSlice';
import { ItemCard } from '@components/ItemCard';
import { AddItemModal } from '@components/modals/AddItemModal';
import { Loader } from '@components/ui/Loader';
import type { TWishlistItem } from '@types';
import { PRIORITY_WEIGHT } from '@types';

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
	const [sortMode, setSortMode] = useState<SortMode>('default');

	useEffect(() => {
		if (id) {
			dispatch(fetchWishlistById(id));
		}
	}, [id, dispatch]);

	const handleDelete = async () => {
		if (!confirm('Удалить этот вишлист и все его вещи?')) return;
		setIsDeleting(true);
		try {
			await dispatch(deleteWishlist(id!)).unwrap();
			navigate('/my');
		} catch {
			setIsDeleting(false);
		}
	};

	const sortedItems = useMemo(() => {
		if (!wishlist) return [];
		return sortItems(wishlist.items, sortMode);
	}, [wishlist, sortMode]);

	// Показываем лоадер только при первоначальной загрузке (нет данных)
	if (isLoading && !wishlist) return <Loader />;

	if (error || !wishlist) {
		return (
			<div className='empty-state'>
				<h2 className='empty-state-title'>Вишлист не найден</h2>
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
		<div className='wishlist-detail'>
			<Link to='/' className='back-link'>
				← Назад к ленте
			</Link>

			<div className='wishlist-hero'>
				<img
					className='wishlist-hero-image'
					src={wishlist.coverImage}
					alt={wishlist.title}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80';
					}}
				/>
				<div className='wishlist-hero-overlay'>
					<h1 className='wishlist-hero-title'>{wishlist.title}</h1>
					<div className='wishlist-hero-author'>
						<div className='wishlist-hero-author-avatar'>{initial}</div>
						<span>@{authorName}</span>
					</div>
				</div>
			</div>

			{wishlist.isOwner && (
				<div className='wishlist-actions'>
					<button
						className='btn btn-primary'
						onClick={() => setShowAddItem(true)}
						id='add-item-btn'>
						Добавить вещь
					</button>
					<button
						className='btn btn-danger'
						onClick={handleDelete}
						disabled={isDeleting}>
						{isDeleting ? 'Удаление...' : 'Удалить вишлист'}
					</button>
				</div>
			)}

			<div className='wishlist-items-header'>
				<h2 className='wishlist-items-title'>Список желаний</h2>
				<span className='wishlist-items-count'>
					{wishlist.items.length} вещей
				</span>
			</div>

			{wishlist.items.length > 0 && (
				<div
					className='sort-controls'
					style={{ marginBottom: 'var(--space-lg)' }}>
					{SORT_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							className={`sort-btn ${sortMode === opt.value ? 'active' : ''}`}
							onClick={() => setSortMode(opt.value)}>
							{opt.label}
						</button>
					))}
				</div>
			)}

			{wishlist.items.length === 0 ? (
				<div className='empty-state'>
					<h2 className='empty-state-title'>Список пуст</h2>
					<p className='empty-state-text'>
						{wishlist.isOwner
							? 'Добавьте свою первую желаемую вещь!'
							: 'Автор ещё не добавил вещей'}
					</p>
				</div>
			) : (
				<div className='wishlist-items-list'>
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
		</div>
	);
};
