import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '@store';
import { fetchFeed } from '@slices/wishlistSlice';
import { useDebounce } from '@hooks/useDebounce';

import { WishlistCard } from '@components/items/WishlistCard';
import { Loader } from '@components/ui/Loader';

import styles from './FeedPage.module.scss';

// Страница глобальной ленты вишлистов
export const FeedPage = () => {
	const dispatch = useDispatch();
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);

	const { feed, isLoading, hasNextPage, nextCursor } = useSelector(
		(state) => state.wishlist
	);

	const [isFetchingMore, setIsFetchingMore] = useState(false);

	// Загрузка ленты при изменении поискового запроса
	useEffect(() => {
		dispatch(fetchFeed({ search: debouncedSearch }));
	}, [debouncedSearch, dispatch]);

	// Подгрузка следующей страницы
	const loadMore = async () => {
		if (hasNextPage && nextCursor && !isFetchingMore) {
			setIsFetchingMore(true);
			await dispatch(
				fetchFeed({ cursor: nextCursor, search: debouncedSearch })
			);
			setIsFetchingMore(false);
		}
	};

	return (
		<>
			<div className={styles.header}>
				<h1 className={styles.title}>Глобальная лента</h1>
				<div className={styles.search}>
					<input
						type='text'
						className='form-input'
						placeholder='Поиск по названию...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			<div className={styles.grid}>
				{feed.map((wishlist) => (
					<WishlistCard key={wishlist._id} wishlist={wishlist} />
				))}
			</div>

			{isLoading && !isFetchingMore && <Loader />}

			{hasNextPage && !isLoading && (
				<div className={styles.loadMoreWrapper}>
					<button
						className='btn btn-secondary'
						onClick={loadMore}
						disabled={isFetchingMore}>
						{isFetchingMore ? 'Загрузка...' : 'Загрузить еще'}
					</button>
				</div>
			)}

			{!isLoading && feed.length === 0 && (
				<div className={styles.emptyState}>
					<h2 className={styles.emptyStateTitle}>Ничего не найдено</h2>
					<p className={styles.emptyStateText}>Попробуйте изменить запрос</p>
				</div>
			)}
		</>
	);
};
