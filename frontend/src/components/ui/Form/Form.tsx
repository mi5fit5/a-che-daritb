import React from 'react';
import { clsx } from 'clsx';

import styles from './Form.module.scss';

interface FormGroupProps {
	children: React.ReactNode;
	className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
	children,
	className,
}) => <div className={clsx(styles.group, className)}>{children}</div>;

export const FormLabel: React.FC<
	React.LabelHTMLAttributes<HTMLLabelElement>
> = ({ className, children, ...rest }) => (
	<label className={clsx(styles.label, className)} {...rest}>
		{children}
	</label>
);

export const FormInput: React.FC<
	React.InputHTMLAttributes<HTMLInputElement>
> = ({ className, ...rest }) => (
	<input className={clsx(styles.input, className)} {...rest} />
);

interface FormErrorProps {
	children: React.ReactNode;
}

export const FormError: React.FC<FormErrorProps> = ({ children }) => (
	<span className={styles.error}>{children}</span>
);

interface PasswordInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type'
> {
	showPassword: boolean;
	onTogglePassword: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
	showPassword,
	onTogglePassword,
	className,
	...rest
}) => (
	<div className={styles.passwordWrapper}>
		<input
			className={clsx(styles.input, className)}
			type={showPassword ? 'text' : 'password'}
			{...rest}
		/>
		<button
			type='button'
			className={clsx(styles.passwordToggle, showPassword && styles.isVisible)}
			onClick={onTogglePassword}
			aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
		/>
	</div>
);
