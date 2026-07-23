import React, { useState, useEffect, type FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import type { TItemPriority, TWishlistItem } from '@types';
import { PRIORITY_WEIGHT } from '@types';

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

	const priorityWeight = PRIORITY_WEIGHT[priority];
	const priorityList: TItemPriority[] = [
		'fun',
		'low',
		'medium',
		'high',
		'essential',
	];

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
					<h2 className='modal-title'>Редактировать вещь</h2>
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
						<label className='form-label' htmlFor='item-title'>
							Название
						</label>
						<input
							id='item-title'
							className='form-input'
							type='text'
							placeholder='Название вещи'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							autoFocus
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='item-image'>
							Фотография (URL)
						</label>
						<input
							id='item-image'
							className='form-input'
							type='url'
							placeholder='Ссылка на URL-картинки'
							value={image}
							onChange={(e) => setImage(e.target.value)}
							required
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='item-shop'>
							Ссылка на магазин
						</label>
						<input
							id='item-shop'
							className='form-input'
							type='url'
							placeholder='Ссылка на магазин'
							value={shopUrl}
							onChange={(e) => setShopUrl(e.target.value)}
							required
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='item-price'>
							Стоимость, ₽
						</label>
						<input
							id='item-price'
							className='form-input'
							type='number'
							placeholder='Укажите стоимость в рублях'
							min='0'
							step='1'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							required
						/>
					</div>

					<div className='form-group'>
						<label className='form-label'>Важность</label>
						<div className='priority-selector'>
							<div className='priority-stars-preview'>
								{[1, 2, 3, 4, 5].map((star) => (
									<span
										key={star}
										className={`star ${star <= priorityWeight ? 'filled' : 'empty'}`}>
										★
									</span>
								))}
							</div>
							<input
								type='range'
								min='1'
								max='5'
								step='1'
								value={priorityWeight}
								className='priority-slider'
								onChange={(e) => {
									const val = parseInt(e.target.value);
									setPriority(priorityList[val - 1]);
								}}
							/>
						</div>
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
