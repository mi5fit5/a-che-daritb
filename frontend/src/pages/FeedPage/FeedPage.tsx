import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from '@store';
import { fetchFeed } from '@slices/wishlistSlice';
import { useDebounce } from '@hooks/useDebounce';

import { WishlistCard } from '@items';
import { Loader, Button, FormInput } from '@ui';

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

	useEffect(() => {
		dispatch(fetchFeed({ search: debouncedSearch }));
	}, [debouncedSearch, dispatch]);

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
					<FormInput
						type='text'
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
					<Button
						variant='secondary'
						onClick={loadMore}
						disabled={isFetchingMore}>
						{isFetchingMore ? 'Загрузка...' : 'Загрузить еще'}
					</Button>
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
