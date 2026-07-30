import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';

import styles from './Modal.module.scss';

interface ModalProps {
	title: string;
	onClose: () => void;
	className?: string;
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
	title,
	onClose,
	className,
	children,
}) => {
	const [isMouseDownOnOverlay, setIsMouseDownOnOverlay] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	return (
		<div
			className={styles.overlay}
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) setIsMouseDownOnOverlay(true);
			}}
			onMouseUp={(e) => {
				if (isMouseDownOnOverlay && e.target === e.currentTarget) {
					onClose();
				}
				setIsMouseDownOnOverlay(false);
			}}>
			<div className={clsx(styles.modal, className)}>
				<div className={styles.header}>
					<h2 className={styles.title}>{title}</h2>
					<button
						className={styles.closeBtn}
						onClick={onClose}
						aria-label='Закрыть'>
						✕
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

export { styles as modalStyles };
