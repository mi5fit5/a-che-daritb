import React, { useState, type FormEvent } from 'react';
import { AxiosError } from 'axios';

import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TItemPriority } from '@types';

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
	wishlistId: string;
	onClose: () => void;
}

export const AddItemModal: React.FC<Props> = ({ wishlistId, onClose }) => {
	const [title, setTitle] = useState('');
	const [image, setImage] = useState('');
	const [shopUrl, setShopUrl] = useState('');
	const [price, setPrice] = useState('');
	const [priority, setPriority] = useState<TItemPriority>('fun');
	const [isAdding, setIsAdding] = useState(false);
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');
		setIsAdding(true);
		try {
			await wishlistRequests.addItem(wishlistId, {
				title,
				image,
				shopUrl,
				price: parseFloat(price),
				priority,
			});
			dispatch(fetchWishlistById(wishlistId));
			onClose();
		} catch (err: unknown) {
			const message =
				err instanceof AxiosError ? err.response?.data?.message : undefined;
			setError(message || 'Ошибка добавления');
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<Modal title='Добавить вещь' onClose={onClose}>
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
					disabled={isAdding}
					className={modalStyles.submitBtn}>
					{isAdding ? 'Добавление...' : 'Добавить'}
				</Button>
			</form>
		</Modal>
	);
};
