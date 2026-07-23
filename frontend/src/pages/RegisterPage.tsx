import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { register, clearError } from '@slices/authSlice';

export const RegisterPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [localError, setLocalError] = useState('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isLoading, error } = useSelector((state) => state.auth);

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
			navigate('/');
		} catch {
			/* */
		}
	};

	const displayError = localError || error;

	return (
		<div className='auth-page'>
			<div className='auth-card'>
				<h1 className='auth-title'>Создать аккаунт</h1>
				<p className='auth-subtitle'>Присоединяйтесь к «А чё дарить?»</p>

				{displayError && <div className='auth-error'>{displayError}</div>}

				<form className='auth-form' onSubmit={handleSubmit}>
					<div className='form-group'>
						<label className='form-label' htmlFor='register-username'>
							Имя пользователя
						</label>
						<input
							id='register-username'
							className='form-input'
							type='text'
							placeholder='Придумайте имя'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							autoFocus
							minLength={3}
							maxLength={30}
						/>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='register-password'>
							Пароль
						</label>
						<div className='password-wrapper'>
							<input
								id='register-password'
								className='form-input'
								type={showPassword ? 'text' : 'password'}
								placeholder='Минимум 6 символов'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
							/>
							<button
								type='button'
								className={`password-toggle ${showPassword ? 'is-visible' : ''}`}
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							/>
						</div>
					</div>

					<div className='form-group'>
						<label className='form-label' htmlFor='register-confirm'>
							Подтвердите пароль
						</label>
						<div className='password-wrapper'>
							<input
								id='register-confirm'
								className='form-input'
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder='Повторите пароль'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
							<button
								type='button'
								className={`password-toggle ${showConfirmPassword ? 'is-visible' : ''}`}
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								aria-label={
									showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'
								}
							/>
						</div>
					</div>

					<button
						className='btn btn-primary'
						type='submit'
						disabled={isLoading}>
						{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
					</button>
				</form>

				<p className='auth-footer'>
					Уже есть аккаунт? <Link to='/login'>Войти</Link>
				</p>
			</div>
		</div>
	);
};
