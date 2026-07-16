import { useNavigate } from 'react-router-dom';

import type { TWishlistCard, TWishlistDetail } from '@types';

import styles from './WishlistCard.module.scss';

interface WishlistCardProps {
	wishlist: TWishlistCard | TWishlistDetail;
}

// Карточка вишлиста для ленты и списка
export const WishlistCard = ({ wishlist }: WishlistCardProps) => {
	const navigate = useNavigate();

	const authorName =
		typeof wishlist.author === 'object' ? wishlist.author.username : 'Unknown';
	const initial = authorName.charAt(0).toUpperCase();

	// Подсчет количества элементов вишлиста
	const itemCount =
		'itemCount' in wishlist
			? wishlist.itemCount
			: 'items' in wishlist && Array.isArray(wishlist.items)
				? wishlist.items.length
				: 0;

	const handleClick = () => {
		navigate(`/wishlist/${wishlist._id}`);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			handleClick();
		}
	};

	return (
		<div
			className={styles.card}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role='button'
			tabIndex={0}>
			<div className={styles.cover}>
				<img
					src={wishlist.coverImage}
					alt={wishlist.title}
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80';
					}}
				/>
				<div className={styles.coverOverlay} />
			</div>

			<div className={styles.body}>
				<h3 className={styles.title}>{wishlist.title}</h3>
				<div className={styles.meta}>
					<div className={styles.author}>
						<div className={styles.avatar}>{initial}</div>
						<span>@{authorName}</span>
					</div>
					<div className={styles.itemsCount}>{itemCount} вещей</div>
				</div>
			</div>
		</div>
	);
};
