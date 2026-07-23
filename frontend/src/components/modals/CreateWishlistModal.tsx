import React, { useState, useEffect, type FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@store';
import { createWishlist, fetchFeed } from '@slices/wishlistSlice';

interface Props {
	onClose: () => void;
}

export const CreateWishlistModal: React.FC<Props> = ({ onClose }) => {
	const [title, setTitle] = useState('');
	const [coverImage, setCoverImage] = useState('');
	const [isPublic] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		setIsCreating(true);
		try {
			const newWishlist = await dispatch(
				createWishlist({ title, coverImage, isPublic })
			).unwrap();
			await dispatch(fetchFeed({}));
			onClose();
			navigate(`/wishlist/${newWishlist._id}`);
		} catch (err: unknown) {
			const message =
				err instanceof AxiosError ? err.response?.data?.message : undefined;
			setError(message || 'Ошибка создания');
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div
			className='modal-overlay'
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className='modal'>
				<div className='modal-header'>
					<h2 className='modal-title'>Новый вишлист</h2>
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
						<label className='form-label' htmlFor='wishlist-title'>
							Название
						</label>
						<input
							id='wishlist-title'
							className='form-input'
							type='text'
							placeholder='Например: День рождения 2026'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							autoFocus
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='wishlist-cover'>
							URL обложки
						</label>
						<input
							id='wishlist-cover'
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
							disabled={isCreating}
							style={{ width: '100%' }}>
							{isCreating ? 'Создание...' : 'Создать'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
