import React, { useState, useEffect, type FormEvent } from 'react';
import { AxiosError } from 'axios';
import { useDispatch } from '@store';
import { fetchWishlistById } from '@slices/wishlistSlice';
import { wishlistRequests } from '@utils-api/wishlistRequests';
import { ITEM_PRIORITIES, PRIORITY_LABELS } from '@types';
import type { TItemPriority } from '@types';

interface Props {
	wishlistId: string;
	onClose: () => void;
}

export const AddItemModal: React.FC<Props> = ({ wishlistId, onClose }) => {
	const [title, setTitle] = useState('');
	const [image, setImage] = useState('');
	const [shopUrl, setShopUrl] = useState('');
	const [price, setPrice] = useState('');
	const [priority, setPriority] = useState<TItemPriority | ''>('');
	const [isAdding, setIsAdding] = useState(false);
	const [error, setError] = useState('');
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
		setIsAdding(true);
		try {
			await wishlistRequests.addItem(wishlistId, {
				title,
				image,
				shopUrl,
				price: parseFloat(price),
				...(priority && { priority }),
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
		<div
			className='modal-overlay'
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className='modal'>
				<div className='modal-header'>
					<h2 className='modal-title'>Добавить вещь</h2>
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

					{image && (
						<div
							style={{
								borderRadius: 'var(--radius-sm)',
								overflow: 'hidden',
								maxHeight: 120,
							}}>
							<img
								src={image}
								alt='Preview'
								style={{ width: '100%', height: 120, objectFit: 'cover' }}
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = 'none';
								}}
							/>
						</div>
					)}

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
							{ITEM_PRIORITIES.map((p) => (
								<button
									key={p}
									type='button'
									className={`priority-option priority-${p} ${priority === p ? 'selected' : ''}`}
									onClick={() => setPriority(priority === p ? '' : p)}>
									{PRIORITY_LABELS[p]}
								</button>
							))}
						</div>
					</div>

					<div className='modal-actions'>
						<button
							type='submit'
							className='btn btn-primary'
							disabled={isAdding}
							style={{ width: '100%' }}>
							{isAdding ? 'Добавление...' : 'Добавить'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
