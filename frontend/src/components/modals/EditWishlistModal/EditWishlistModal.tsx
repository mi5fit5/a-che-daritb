import React, { useState, type FormEvent } from 'react';
import { AxiosError } from 'axios';

import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TWishlistDetail } from '@types';

import {
	Modal,
	modalStyles,
	FormGroup,
	FormLabel,
	FormInput,
	Button,
} from '@ui';

interface Props {
	wishlist: TWishlistDetail;
	onClose: () => void;
}

export const EditWishlistModal: React.FC<Props> = ({ wishlist, onClose }) => {
	const [title, setTitle] = useState(wishlist.title);
	const [coverImage, setCoverImage] = useState(wishlist.coverImage);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const dispatch = useDispatch();

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
		<Modal title='Редактировать вишлист' onClose={onClose}>
			{error && <div className={modalStyles.error}>{error}</div>}

			<form className={modalStyles.form} onSubmit={handleSubmit}>
				<FormGroup>
					<FormLabel htmlFor='edit-wishlist-title'>Название</FormLabel>
					<FormInput
						id='edit-wishlist-title'
						type='text'
						placeholder='Название вишлиста'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						autoFocus
					/>
				</FormGroup>

				<FormGroup>
					<FormLabel htmlFor='edit-wishlist-cover'>URL обложки</FormLabel>
					<FormInput
						id='edit-wishlist-cover'
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
					disabled={isSaving}
					className={modalStyles.submitBtn}>
					{isSaving ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</form>
		</Modal>
	);
};
