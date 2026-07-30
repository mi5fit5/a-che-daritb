import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '@store';
import { login, clearError } from '@slices/authSlice';

import logoUrl from '@assets/images/logo.svg';
import { FormGroup, FormLabel, FormInput, PasswordInput, Button } from '@ui';

import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector((state) => state.auth);

	const from = (location.state as { from?: string })?.from || '/';

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch(clearError());

		try {
			await dispatch(login({ username, password })).unwrap();
			navigate(from, { replace: true });
		} catch {
			/* */
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>
					<img src={logoUrl} alt='А чё дарить?' style={{ height: '32px' }} />
				</h1>
				<p className={styles.subtitle}>Войдите, чтобы продолжить</p>

				{error && <div className={styles.error}>{error}</div>}

				<form className={styles.form} onSubmit={handleSubmit}>
					<FormGroup>
						<FormLabel htmlFor='login-username'>Имя пользователя</FormLabel>
						<FormInput
							id='login-username'
							type='text'
							placeholder='Введите имя'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoFocus
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel htmlFor='login-password'>Пароль</FormLabel>
						<PasswordInput
							id='login-password'
							placeholder='Введите пароль'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							showPassword={showPassword}
							onTogglePassword={() => setShowPassword(!showPassword)}
							required
						/>
					</FormGroup>

					<Button
						variant='primary'
						type='submit'
						disabled={isLoading}
						className={styles.submitBtn}>
						{isLoading ? 'Вход...' : 'Войти'}
					</Button>
				</form>

				<p className={styles.footer}>
					Нет аккаунта?{' '}
					<Link to='/register' state={{ from }}>
						Зарегистрироваться
					</Link>
				</p>
			</div>
		</div>
	);
};
