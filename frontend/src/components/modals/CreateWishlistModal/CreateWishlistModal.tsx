import React, { useState, type FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '@store';
import { createWishlist, fetchFeed } from '@slices/wishlistSlice';

import {
	Modal,
	modalStyles,
	FormGroup,
	FormLabel,
	FormInput,
	Button,
} from '@ui';

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
		<Modal title='Новый вишлист' onClose={onClose}>
			{error && <div className={modalStyles.error}>{error}</div>}

			<form className={modalStyles.form} onSubmit={handleSubmit}>
				<FormGroup>
					<FormLabel htmlFor='wishlist-title'>Название</FormLabel>
					<FormInput
						id='wishlist-title'
						type='text'
						placeholder='Например: День рождения 2026'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						autoFocus
					/>
				</FormGroup>

				<FormGroup>
					<FormLabel htmlFor='wishlist-cover'>URL обложки</FormLabel>
					<FormInput
						id='wishlist-cover'
						type='url'
						placeholder='https://example.com/image.jpg'
						value={coverImage}
						onChange={(e) => setCoverImage(e.target.value)}
						required
					/>
				</FormGroup>

				<Button
					type='submit'
					variant='primary'
					disabled={isCreating}
					className={modalStyles.submitBtn}>
					{isCreating ? 'Создание...' : 'Создать'}
				</Button>
			</form>
		</Modal>
	);
};
