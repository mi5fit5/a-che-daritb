import React, { useEffect, useState } from 'react';

interface Props {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning';
	onConfirm: () => void | Promise<void>;
	onCancel: () => void;
}

export const ConfirmModal: React.FC<Props> = ({
	title,
	message,
	confirmText = 'Удалить',
	cancelText = 'Отмена',
	variant = 'danger',
	onConfirm,
	onCancel,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isMouseDownOnOverlay, setIsMouseDownOnOverlay] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onCancel();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onCancel]);

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onConfirm();
		} finally {
			setIsLoading(false);
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
					onCancel();
				}
				setIsMouseDownOnOverlay(false);
			}}>
			<div className='modal confirm-modal'>
				<div className='modal-header'>
					<h2 className='modal-title'>{title}</h2>
					<button
						className='modal-close'
						onClick={onCancel}
						aria-label='Закрыть'>
						✕
					</button>
				</div>

				<p className='confirm-modal-message'>{message}</p>

				<div className='confirm-modal-actions'>
					<button
						className='btn btn-secondary'
						onClick={onCancel}
						disabled={isLoading}>
						{cancelText}
					</button>
					<button
						className={`btn btn-${variant}`}
						onClick={handleConfirm}
						disabled={isLoading}>
						{isLoading ? '...' : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};
