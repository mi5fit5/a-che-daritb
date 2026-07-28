import { useEffect } from 'react';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { connectSocket } from '@utils/socket';

export const useWishlistSocket = (wishlistId: string | undefined): void => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (!wishlistId) return;

		const socket = connectSocket();

		socket.emit('join-wishlist', wishlistId);

		const handleUpdate = () => {
			dispatch(fetchWishlistById(wishlistId));
		};

		socket.on('wishlist:updated', handleUpdate);

		return () => {
			socket.off('wishlist:updated', handleUpdate);
			socket.emit('leave-wishlist', wishlistId);
		};
	}, [wishlistId, dispatch]);
};
