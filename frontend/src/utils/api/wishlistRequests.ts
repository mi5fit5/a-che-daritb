import { api } from './index';
import type {
	TWishlistDetail,
	TFeedResponse,
	TCreateWishlistData,
	TUpdateWishlistData,
	TCreateItemData,
	TWishlistItem,
	TUpdateItemData,
} from '@types';

// Объект с запросами для вишлистов
export const wishlistRequests = {
	// Получить ленту вишлистов (с пагинацией курсором)
	getFeed: async (cursor?: string, search?: string): Promise<TFeedResponse> => {
		const response = await api.get('/wishlists', {
			params: { cursor, search },
		});
		return response.data;
	},

	// Получить список своих вишлистов
	getMyWishlists: async (): Promise<{ wishlists: TWishlistDetail[] }> => {
		const response = await api.get('/wishlists/my');
		return response.data;
	},

	// Получить вишлист по ID
	getWishlistById: async (id: string): Promise<TWishlistDetail> => {
		const response = await api.get(`/wishlists/${id}`);
		return response.data;
	},

	// Создать новый вишлист
	createWishlist: async (
		data: TCreateWishlistData
	): Promise<TWishlistDetail> => {
		const response = await api.post('/wishlists', data);
		return response.data;
	},

	// Обновить вишлист
	updateWishlist: async (
		id: string,
		data: TUpdateWishlistData
	): Promise<TWishlistDetail> => {
		const response = await api.put(`/wishlists/${id}`, data);
		return response.data;
	},

	// Удалить вишлист
	deleteWishlist: async (id: string): Promise<void> => {
		await api.delete(`/wishlists/${id}`);
	},

	// Добавить элемент в вишлист
	addItem: async (
		wishlistId: string,
		itemData: TCreateItemData
	): Promise<TWishlistItem> => {
		const response = await api.post(`/wishlists/${wishlistId}/items`, itemData);
		return response.data;
	},

	// Редактировать элемент вишлиста
	editItem: async (
		itemId: string,
		itemData: TUpdateItemData
	): Promise<TWishlistItem> => {
		const response = await api.put(`/items/${itemId}`, itemData);
		return response.data;
	},

	// Забронировать элемент
	bookItem: async (_wishlistId: string, itemId: string) => {
		const response = await api.post(`/items/${itemId}/book`);
		return response.data;
	},

	// Снять бронь с элемента
	unbookItem: async (_wishlistId: string, itemId: string) => {
		const response = await api.delete(`/items/${itemId}/book`);
		return response.data;
	},

	// Удалить элемент из вишлиста
	deleteItem: async (wishlistId: string, itemId: string) => {
		await api.delete(`/wishlists/${wishlistId}/items/${itemId}`);
	},
};
