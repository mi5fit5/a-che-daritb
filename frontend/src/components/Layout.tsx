import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import logoUrl from '../assets/images/logo.svg';
import { useSelector, useDispatch } from '@store';
import { logout } from '@slices/authSlice';

export const Layout: React.FC = () => {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = async () => {
		await dispatch(logout()).unwrap();
		navigate('/login');
	};

	return (
		<div className='app-layout'>
			<header className='header'>
				<div className='header-inner'>
					<Link to='/' className='header-logo'>
						<img src={logoUrl} alt='а чё дарить ?' style={{ height: '32px' }} />
					</Link>

					<nav className='header-nav'>
						<Link
							to='/'
							className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
							Лента
						</Link>
						<Link
							to='/my'
							className={`header-nav-link ${location.pathname === '/my' ? 'active' : ''}`}>
							Мои вишлисты
						</Link>
					</nav>

					<div className='header-user'>
						{user && <span className='header-username'>@{user.username}</span>}
						<button className='btn btn-ghost btn-sm' onClick={handleLogout}>
							Выйти
						</button>
					</div>
				</div>
			</header>

			<main className='main-content'>
				<Outlet />
			</main>
		</div>
	);
};
