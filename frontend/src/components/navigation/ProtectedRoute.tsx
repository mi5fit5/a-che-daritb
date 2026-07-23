import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { Loader } from '@components/ui/Loader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
	const location = useLocation();

	if (isLoading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' replace state={{ from: location.pathname }} />;
	}

	return <>{children}</>;
};
