import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

import { useSelector, useDispatch } from '@store';
import { logout } from '@slices/authSlice';

import logoUrl from '@assets/images/logo.svg';
import { Button } from '@ui';

import styles from './Layout.module.scss';

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
		<div className={styles.appLayout}>
			<header className={styles.header}>
				<div className={styles.headerInner}>
					<Link to='/' className={styles.headerLogo}>
						<img src={logoUrl} alt='а чё дарить ?' style={{ height: '32px' }} />
					</Link>

					<nav className={clsx(styles.headerNav, styles.headerNavDesktop)}>
						<Link
							to='/'
							className={clsx(
								styles.headerNavLink,
								location.pathname === '/' && styles.active
							)}>
							Лента
						</Link>
						<Link
							to='/my'
							className={clsx(
								styles.headerNavLink,
								location.pathname === '/my' && styles.active
							)}>
							Мои вишлисты
						</Link>
					</nav>

					<div className={clsx(styles.headerUser, styles.headerUserDesktop)}>
						{user && (
							<span className={styles.headerUsername}>@{user.username}</span>
						)}
						<Button variant='ghost' size='sm' onClick={handleLogout}>
							Выйти
						</Button>
					</div>

					<div className={styles.headerMobile} ref={burgerRef}>
						<button
							className={clsx(
								styles.burgerBtn,
								burgerOpen && styles.burgerBtnOpen
							)}
							onClick={() => setBurgerOpen(!burgerOpen)}
							aria-label='Меню'>
							<span className={styles.burgerLine} />
							<span className={styles.burgerLine} />
							<span className={styles.burgerLine} />
						</button>

						{burgerOpen && (
							<div className={styles.burgerDropdown}>
								{user && (
									<div className={styles.burgerUsername}>@{user.username}</div>
								)}
								<Link
									to='/'
									className={clsx(
										styles.burgerLink,
										location.pathname === '/' && styles.active
									)}
									onClick={() => setBurgerOpen(false)}>
									Лента
								</Link>
								<Link
									to='/my'
									className={clsx(
										styles.burgerLink,
										location.pathname === '/my' && styles.active
									)}
									onClick={() => setBurgerOpen(false)}>
									Мои вишлисты
								</Link>
								<button
									className={clsx(styles.burgerLink, styles.burgerLogout)}
									onClick={handleLogout}>
									Выйти
								</button>
							</div>
						)}
					</div>
				</div>
			</header>

			<main className={styles.mainContent}>
				<Outlet />
			</main>
		</div>
	);
};
