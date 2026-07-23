import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { login, clearError } from '@slices/authSlice';
import logoUrl from '../assets/images/logo.svg';

export const LoginPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector((state) => state.auth);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch(clearError());

		try {
			await dispatch(login({ username, password })).unwrap();
			navigate('/');
		} catch {
			/* */
		}
	};

	return (
		<div className='auth-page'>
			<div className='auth-card'>
				<h1 className='auth-title'>
					<img src={logoUrl} alt='А чё дарить?' style={{ height: '32px' }} />
				</h1>
				<p className='auth-subtitle'>Войдите, чтобы продолжить</p>

				{error && <div className='auth-error'>{error}</div>}

				<form className='auth-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label className='form-label' htmlFor='login-username'>
							Имя пользователя
						</label>
						<input
							id='login-username'
							className='form-input'
							type='text'
							placeholder='Введите имя'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoFocus
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='login-password'>
							Пароль
						</label>
						<div className='password-wrapper'>
							<input
								id='login-password'
								className='form-input'
								type={showPassword ? 'text' : 'password'}
								placeholder='Введите пароль'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type='button'
								className={`password-toggle ${showPassword ? 'is-visible' : ''}`}
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							/>
						</div>
					</div>

					<button
						className='btn btn-primary'
						type='submit'
						disabled={isLoading}>
						{isLoading ? 'Вход...' : 'Войти'}
					</button>
				</form>

				<p className='auth-footer'>
					Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
				</p>
			</div>
		</div>
	);
};
