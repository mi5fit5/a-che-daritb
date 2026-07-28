import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import logoUrl from '../assets/images/logo.svg';
import { useSelector, useDispatch } from '@store';
import { logout } from '@slices/authSlice';

export const Layout: React.FC = () => {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [burgerOpen, setBurgerOpen] = useState(false);
	const burgerRef = useRef<HTMLDivElement>(null);

	const handleLogout = async () => {
		setBurgerOpen(false);
		await dispatch(logout()).unwrap();
		navigate('/login');
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (burgerRef.current && !burgerRef.current.contains(e.target as Node)) {
				setBurgerOpen(false);
			}
		};
		if (burgerOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [burgerOpen]);

	return (
		<div className='app-layout'>
			<header className='header'>
				<div className='header-inner'>
					<Link to='/' className='header-logo'>
						<img src={logoUrl} alt='а чё дарить ?' style={{ height: '32px' }} />
					</Link>

					<nav className='header-nav header-nav--desktop'>
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

					<div className='header-user header-user--desktop'>
						{user && <span className='header-username'>@{user.username}</span>}
						<button className='btn btn-ghost btn-sm' onClick={handleLogout}>
							Выйти
						</button>
					</div>

					<div className='header-mobile' ref={burgerRef}>
						<button
							className={`burger-btn ${burgerOpen ? 'is-open' : ''}`}
							onClick={() => setBurgerOpen(!burgerOpen)}
							aria-label='Меню'>
							<span className='burger-line' />
							<span className='burger-line' />
							<span className='burger-line' />
						</button>

						{burgerOpen && (
							<div className='burger-dropdown'>
								{user && (
									<div className='burger-username'>@{user.username}</div>
								)}
								<Link
									to='/'
									className={`burger-link ${location.pathname === '/' ? 'active' : ''}`}
									onClick={() => setBurgerOpen(false)}>
									Лента
								</Link>
								<Link
									to='/my'
									className={`burger-link ${location.pathname === '/my' ? 'active' : ''}`}
									onClick={() => setBurgerOpen(false)}>
									Мои вишлисты
								</Link>
								<button
									className='burger-link burger-logout'
									onClick={handleLogout}>
									Выйти
								</button>
							</div>
						)}
					</div>
				</div>
			</header>

			<main className='main-content'>
				<Outlet />
			</main>
		</div>
	);
};
