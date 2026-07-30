import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@store';
import { fetchMyWishlists } from '@slices/wishlistSlice';

import { WishlistCard } from '@items';
import { Loader, Button } from '@ui';
import { CreateWishlistModal } from '@modals';

import styles from './MyWishlistsPage.module.scss';

export const MyWishlistsPage: React.FC = () => {
	const dispatch = useDispatch();
	const { myWishlists, isLoading } = useSelector((state) => state.wishlist);
	const [showCreateModal, setShowCreateModal] = useState(false);

	useEffect(() => {
		dispatch(fetchMyWishlists());
	}, [dispatch]);

	return (
		<>
			<div className={styles.header}>
				<h1 className={styles.title}>Мои вишлисты</h1>
				<Button variant='primary' onClick={() => setShowCreateModal(true)}>
					Создать вишлист
				</Button>
			</div>

			{isLoading ? (
				<Loader />
			) : myWishlists.length === 0 ? (
				<div className={styles.emptyState}>
					<h2 className={styles.emptyStateTitle}>У вас пока нет вишлистов</h2>
					<p className={styles.emptyStateText}>
						Создайте свой первый список желаний!
					</p>
					<Button
						variant='primary'
						style={{ marginTop: '1rem' }}
						onClick={() => setShowCreateModal(true)}>
						Создать
					</Button>
				</div>
			) : (
				<div className={styles.grid}>
					{myWishlists.map((wishlist) => (
						<WishlistCard key={wishlist._id} wishlist={wishlist} />
					))}
				</div>
			)}

			{showCreateModal && (
				<CreateWishlistModal onClose={() => setShowCreateModal(false)} />
			)}
		</>
	);
};
