import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { wishlistRequests } from '@utils-api/wishlistRequests';
import type {
	TWishlistDetail,
	TWishlistCard,
	TCreateWishlistData,
} from '@types';

// Санка загрузки ленты вишлистов
export const fetchFeed = createAsyncThunk(
	'wishlist/fetchFeed',
	async (
		{ cursor, search }: { cursor?: string; search?: string },
		{ rejectWithValue }
	) => {
		try {
			const data = await wishlistRequests.getFeed(cursor, search);
			return data;
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка загрузки ленты');
		}
	}
);

// Санка загрузки своих вишлистов
export const fetchMyWishlists = createAsyncThunk(
	'wishlist/fetchMyWishlists',
	async (_, { rejectWithValue }) => {
		try {
			const data = await wishlistRequests.getMyWishlists();
			return data.wishlists;
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка загрузки вишлистов');
		}
	}
);

// Санка загрузки вишлиста по ID
export const fetchWishlistById = createAsyncThunk(
	'wishlist/fetchById',
	async (id: string, { rejectWithValue }) => {
		try {
			const data = await wishlistRequests.getWishlistById(id);
			return data;
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка загрузки вишлиста');
		}
	}
);

// Санка создания вишлиста
export const createWishlist = createAsyncThunk(
	'wishlist/create',
	async (wishlistData: TCreateWishlistData, { rejectWithValue }) => {
		try {
			const data = await wishlistRequests.createWishlist(wishlistData);
			return data;
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка создания вишлиста');
		}
	}
);

// Санка удаления вишлиста
export const deleteWishlist = createAsyncThunk(
	'wishlist/delete',
	async (id: string, { rejectWithValue }) => {
		try {
			await wishlistRequests.deleteWishlist(id);
			return id;
		} catch (error: unknown) {
			const message =
				error instanceof AxiosError ? error.response?.data?.message : undefined;
			return rejectWithValue(message || 'Ошибка удаления вишлиста');
		}
	}
);

// Типизация стейта вишлистов
type TWishlistState = {
	feed: TWishlistCard[];
	myWishlists: TWishlistDetail[];
	currentWishlist: TWishlistDetail | null;
	isLoading: boolean;
	error: string | null;
	hasNextPage: boolean;
	nextCursor: string | null;
};

// Начальное состояние
const initialState: TWishlistState = {
	feed: [],
	myWishlists: [],
	currentWishlist: null,
	isLoading: false,
	error: null,
	hasNextPage: false,
	nextCursor: null,
};

// Слайс
const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Загрузка ленты
			.addCase(fetchFeed.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchFeed.fulfilled, (state, action) => {
				state.isLoading = false;

				// Если передан курсор — дозагрузка (append), иначе — начальная загрузка
				if (action.meta.arg.cursor) {
					state.feed = [...state.feed, ...action.payload.wishlists];
				} else {
					state.feed = action.payload.wishlists;
				}

				state.hasNextPage = !!action.payload.nextCursor;
				state.nextCursor = action.payload.nextCursor;
			})
			.addCase(fetchFeed.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Загрузка своих вишлистов
			.addCase(fetchMyWishlists.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchMyWishlists.fulfilled, (state, action) => {
				state.isLoading = false;
				state.myWishlists = action.payload;
			})
			.addCase(fetchMyWishlists.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Загрузка вишлиста по ID
			.addCase(fetchWishlistById.pending, (state) => {
				// Показываем лоадер только при первой загрузке, не при рефетче
				if (!state.currentWishlist) {
					state.isLoading = true;
				}
			})
			.addCase(fetchWishlistById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentWishlist = action.payload;
			})
			.addCase(fetchWishlistById.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export default wishlistSlice.reducer;
