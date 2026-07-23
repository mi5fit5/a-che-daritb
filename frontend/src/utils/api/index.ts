import axios from 'axios';

export const api = axios.create({
	baseURL: '/api',
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const url = originalRequest?.url || '';
		const isAuthRoute =
			url.includes('/auth/login') ||
			url.includes('/auth/register') ||
			url.includes('/auth/refresh');

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isAuthRoute
		) {
			originalRequest._retry = true;
			try {
				const res = await axios.post(
					'/api/auth/refresh',
					{},
					{ withCredentials: true }
				);
				const newToken = res.data.accessToken;
				localStorage.setItem('accessToken', newToken);
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			} catch (err) {
				localStorage.removeItem('accessToken');
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	}
);
