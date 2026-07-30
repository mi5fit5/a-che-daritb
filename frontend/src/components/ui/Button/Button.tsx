import React from 'react';
import { clsx } from 'clsx';

import styles from './Button.module.scss';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'danger'
	| 'warning'
	| 'ghost'
	| 'outlinePrimary'
	| 'outlineWarning';

export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	icon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	variant,
	size,
	icon,
	className,
	children,
	...rest
}) => {
	return (
		<button
			className={clsx(
				styles.btn,
				variant && styles[variant],
				size === 'sm' && styles.sm,
				icon && styles.icon,
				className
			)}
			{...rest}>
			{children}
		</button>
	);
};

// Export styles for non-button elements styled as buttons (e.g. <Link>)
export { styles as buttonStyles };
