import { configureStore } from '@reduxjs/toolkit';
import {
	type TypedUseSelectorHook,
	useDispatch as dispatchHook,
	useSelector as selectorHook,
} from 'react-redux';

import authReducer from '../slices/authSlice';
import wishlistReducer from '../slices/wishlistSlice';

// Конфигурация стора
const store = configureStore({
	reducer: {
		auth: authReducer,
		wishlist: wishlistReducer,
	},
});

// Типизация стейта и диспача
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизация хуков
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
