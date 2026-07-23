import React, { useState, useEffect, type FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TWishlistDetail } from '@types';

interface Props {
	wishlist: TWishlistDetail;
	onClose: () => void;
}

export const EditWishlistModal: React.FC<Props> = ({ wishlist, onClose }) => {
	const [title, setTitle] = useState(wishlist.title);
	const [coverImage, setCoverImage] = useState(wishlist.coverImage);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [isMouseDownOnOverlay, setIsMouseDownOnOverlay] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSaving(true);
		try {
			await wishlistRequests.updateWishlist(wishlist._id, {
				title,
				coverImage,
			});
			dispatch(fetchWishlistById(wishlist._id));
			onClose();
		} catch (err: unknown) {
			const message =
				err instanceof AxiosError ? err.response?.data?.message : undefined;
			setError(message || 'Ошибка сохранения');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div
			className='modal-overlay'
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) setIsMouseDownOnOverlay(true);
			}}
			onMouseUp={(e) => {
				if (isMouseDownOnOverlay && e.target === e.currentTarget) {
					onClose();
				}
				setIsMouseDownOnOverlay(false);
			}}>
			<div className='modal'>
				<div className='modal-header'>
					<h2 className='modal-title'>Редактировать вишлист</h2>
					<button
						className='modal-close'
						onClick={onClose}
						aria-label='Закрыть'>
						✕
					</button>
				</div>

				{error && (
					<div className='auth-error' style={{ marginBottom: '1rem' }}>
						{error}
					</div>
				)}

				<form className='modal-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label className='form-label' htmlFor='edit-wishlist-title'>
							Название
						</label>
						<input
							id='edit-wishlist-title'
							className='form-input'
							type='text'
							placeholder='Название вишлиста'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							autoFocus
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='edit-wishlist-cover'>
							URL обложки
						</label>
						<input
							id='edit-wishlist-cover'
							className='form-input'
							type='url'
							placeholder='https://example.com/image.jpg'
							value={coverImage}
							onChange={(e) => setCoverImage(e.target.value)}
							required
						/>
					</div>

					<div className='modal-actions'>
						<button
							type='submit'
							className='btn btn-primary'
							disabled={isSaving}
							style={{ width: '100%' }}>
							{isSaving ? 'Сохранение...' : 'Сохранить'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
