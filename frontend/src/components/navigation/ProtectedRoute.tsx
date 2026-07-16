import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '@store';
import { Loader } from '@components/ui/Loader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

	if (isLoading) {
		return <Loader />;
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return <>{children}</>;
};
