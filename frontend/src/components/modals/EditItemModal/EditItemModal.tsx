import React, { useState, type FormEvent } from 'react';
import { AxiosError } from 'axios';

import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TItemPriority, TWishlistItem } from '@types';

import {
	Modal,
	modalStyles,
	PrioritySelector,
	FormGroup,
	FormLabel,
	FormInput,
	Button,
} from '@ui';

interface Props {
	item: TWishlistItem;
	onClose: () => void;
}

export const EditItemModal: React.FC<Props> = ({ item, onClose }) => {
	const [title, setTitle] = useState(item.title);
	const [image, setImage] = useState(item.image);
	const [shopUrl, setShopUrl] = useState(item.shopUrl);
	const [price, setPrice] = useState(item.price ? item.price.toString() : '');
	const [priority, setPriority] = useState<TItemPriority>(
		item.priority || 'fun'
	);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSaving(true);
		try {
			await wishlistRequests.editItem(item.wishlist, item._id, {
				title,
				image,
				shopUrl,
				price: parseFloat(price),
				priority,
			});
			dispatch(fetchWishlistById(item.wishlist));
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
		<Modal title='Редактировать вещь' onClose={onClose}>
			{error && <div className={modalStyles.error}>{error}</div>}

			<form className={modalStyles.form} onSubmit={handleSubmit}>
				<FormGroup>
					<FormLabel htmlFor='item-title'>Название</FormLabel>
					<FormInput
						id='item-title'
						type='text'
						placeholder='Название вещи'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						autoFocus
					/>
				</FormGroup>

				<FormGroup>
					<FormLabel htmlFor='item-image'>Фотография (URL)</FormLabel>
					<FormInput
						id='item-image'
						type='url'
						placeholder='Ссылка на URL-картинки'
						value={image}
						onChange={(e) => setImage(e.target.value)}
						required
					/>
				</FormGroup>

				<FormGroup>
					<FormLabel htmlFor='item-shop'>Ссылка на магазин</FormLabel>
					<FormInput
						id='item-shop'
						type='url'
						placeholder='Ссылка на магазин'
						value={shopUrl}
						onChange={(e) => setShopUrl(e.target.value)}
						required
					/>
				</FormGroup>

				<FormGroup>
					<FormLabel htmlFor='item-price'>Стоимость, ₽</FormLabel>
					<FormInput
						id='item-price'
						type='number'
						placeholder='Укажите стоимость в рублях'
						min='0'
						step='1'
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
				</FormGroup>

				<FormGroup>
					<FormLabel>Важность</FormLabel>
					<PrioritySelector priority={priority} onChange={setPriority} />
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
