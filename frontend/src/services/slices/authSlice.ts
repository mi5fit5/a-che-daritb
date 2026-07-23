import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { authRequests } from '@utils-api/authRequests';
import type { TUser, TLoginCredentials, TRegisterCredentials } from '@types';

// Санка авторизации
export const login = createAsyncThunk(
	'auth/login',
	async (credentials: TLoginCredentials, { rejectWithValue }) => {
		try {
			const data = await authRequests.login(credentials);
			return data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				const message = error.response?.data?.message;
				if (message) return rejectWithValue(message);
				if (!error.response)
					return rejectWithValue('Сервер недоступен. Попробуйте позже');
			}
			return rejectWithValue('Ошибка авторизации');
		}
	}
);

// Санка регистрации
export const register = createAsyncThunk(
	'auth/register',
	async (credentials: TRegisterCredentials, { rejectWithValue }) => {
		try {
			const data = await authRequests.register(credentials);
			return data;
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				const message = error.response?.data?.message;
				if (message) return rejectWithValue(message);
				if (!error.response)
					return rejectWithValue('Сервер недоступен. Попробуйте позже');
			}
			return rejectWithValue('Ошибка регистрации');
		}
	}
);

// Санка выхода из аккаунта
export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			await authRequests.logout();
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка при выходе');
		}
	}
);

// Санка получения данных текущего пользователя
export const fetchMe = createAsyncThunk(
	'auth/fetchMe',
	async (_, { rejectWithValue }) => {
		try {
			const data = await authRequests.getMe();
			return data;
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка получения пользователя');
		}
	}
);

// Типизация стейта авторизации
type TAuthState = {
	user: TUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isInitializing: boolean;
	error: string | null;
};

// Начальное состояние
const initialState: TAuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	isInitializing: true,
	error: null,
};

// Слайс
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Авторизация
			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				login.fulfilled,
				(state, action: PayloadAction<{ user: TUser }>) => {
					state.isLoading = false;
					state.isAuthenticated = true;
					state.user = action.payload.user;
				}
			)
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Регистрация
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				register.fulfilled,
				(state, action: PayloadAction<{ user: TUser }>) => {
					state.isLoading = false;
					state.isAuthenticated = true;
					state.user = action.payload.user;
				}
			)
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Выход из аккаунта
			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.user = null;
			})

			// Получение данных текущего пользователя
			.addCase(fetchMe.pending, (state) => {
				state.isInitializing = true;
			})
			.addCase(fetchMe.fulfilled, (state, action: PayloadAction<TUser>) => {
				state.isInitializing = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(fetchMe.rejected, (state) => {
				state.isInitializing = false;
				state.isAuthenticated = false;
				state.user = null;
			});
	},
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
