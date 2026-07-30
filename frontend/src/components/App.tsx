import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from '@store';
import { fetchMe } from '@slices/authSlice';

import { Layout, ProtectedRoute } from '@components';
import {
	LoginPage,
	RegisterPage,
	FeedPage,
	WishlistPage,
	MyWishlistsPage,
} from '@pages';

// Корневой компонент приложения
export const App = () => {
	const { isAuthenticated, isInitializing } = useSelector(
		(state) => state.auth
	);
	const dispatch = useDispatch();
	const location = useLocation();

	// Проверка сессии при монтировании
	useEffect(() => {
		dispatch(fetchMe());
	}, [dispatch]);

	if (isInitializing) {
		return null;
	}

	const redirectTo = (location.state as { from?: string })?.from || '/';

	return (
		<Routes>
			{/* Публичные маршруты */}
			<Route
				path='/login'
				element={
					isAuthenticated ? <Navigate to={redirectTo} replace /> : <LoginPage />
				}
			/>
			<Route
				path='/register'
				element={
					isAuthenticated ? (
						<Navigate to={redirectTo} replace />
					) : (
						<RegisterPage />
					)
				}
			/>

			{/* Защищённые маршруты */}
			<Route
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}>
				<Route path='/' element={<FeedPage />} />
				<Route path='/my' element={<MyWishlistsPage />} />
				<Route path='/wishlist/:id' element={<WishlistPage />} />
			</Route>

			{/* Фолбэк */}
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	);
};
