import React, { useState } from 'react';

import { Modal, Button } from '@ui';

import styles from './ConfirmModal.module.scss';

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

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onConfirm();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal title={title} onClose={onCancel} className={styles.confirmModal}>
			<p className={styles.message}>{message}</p>

			<div className={styles.actions}>
				<Button variant='secondary' onClick={onCancel} disabled={isLoading}>
					{cancelText}
				</Button>
				<Button variant={variant} onClick={handleConfirm} disabled={isLoading}>
					{isLoading ? '...' : confirmText}
				</Button>
			</div>
		</Modal>
	);
};
