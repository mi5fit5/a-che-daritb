import { api } from './index';
import type {
	TAuthResponse,
	TUser,
	TLoginCredentials,
	TRegisterCredentials,
} from '@types';

// Объект с запросами авторизации
export const authRequests = {
	// Авторизация
	login: async (credentials: TLoginCredentials): Promise<TAuthResponse> => {
		const response = await api.post('/auth/login', credentials);
		localStorage.setItem('accessToken', response.data.accessToken);
		return response.data;
	},

	// Регистрация
	register: async (
		credentials: TRegisterCredentials
	): Promise<TAuthResponse> => {
		const response = await api.post('/auth/register', credentials);
		localStorage.setItem('accessToken', response.data.accessToken);
		return response.data;
	},

	// Выход из аккаунта
	logout: async (): Promise<void> => {
		await api.post('/auth/logout');
		localStorage.removeItem('accessToken');
	},

	// Получить данные текущего пользователя
	getMe: async (): Promise<TUser> => {
		const response = await api.get('/auth/me');
		return response.data;
	},
};
