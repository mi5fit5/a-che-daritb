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
		if (error.response?.status === 401 && !originalRequest._retry) {
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
				if (
					window.location.pathname !== '/login' &&
					window.location.pathname !== '/register'
				) {
					window.location.href = '/login';
				}
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	}
);
