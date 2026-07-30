import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '@store';
import { register, clearError } from '@slices/authSlice';

import { FormGroup, FormLabel, FormInput, PasswordInput, Button } from '@ui';

import styles from './RegisterPage.module.scss';

export const RegisterPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [localError, setLocalError] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector((state) => state.auth);

	const from = (location.state as { from?: string })?.from || '/';

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLocalError('');
		dispatch(clearError());

		if (password !== confirmPassword) {
			setLocalError('Пароли не совпадают');
			return;
		}
		if (password.length < 6) {
			setLocalError('Пароль должен быть не менее 6 символов');
			return;
		}

		try {
			await dispatch(register({ username, password })).unwrap();
			navigate(from, { replace: true });
		} catch {
			/* */
		}
	};

	const displayError = localError || error;

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>Создать аккаунт</h1>
				<p className={styles.subtitle}>Присоединяйтесь к «А чё дарить?»</p>

				{displayError && <div className={styles.error}>{displayError}</div>}

				<form className={styles.form} onSubmit={handleSubmit}>
					<FormGroup>
						<FormLabel htmlFor='register-username'>Имя пользователя</FormLabel>
						<FormInput
							id='register-username'
							type='text'
							placeholder='Придумайте имя'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoFocus
							minLength={3}
							maxLength={30}
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel htmlFor='register-password'>Пароль</FormLabel>
						<PasswordInput
							id='register-password'
							placeholder='Минимум 6 символов'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							showPassword={showPassword}
							onTogglePassword={() => setShowPassword(!showPassword)}
							required
							minLength={6}
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel htmlFor='register-confirm'>Подтвердите пароль</FormLabel>
						<PasswordInput
							id='register-confirm'
							placeholder='Повторите пароль'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							showPassword={showConfirmPassword}
							onTogglePassword={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
							required
						/>
					</FormGroup>

					<Button
						variant='primary'
						type='submit'
						disabled={isLoading}
						className={styles.submitBtn}>
						{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
					</Button>
				</form>

				<p className={styles.footer}>
					Уже есть аккаунт?{' '}
					<Link to='/login' state={{ from }}>
						Войти
					</Link>
				</p>
			</div>
		</div>
	);
};
