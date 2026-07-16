// Тип пользователя
export type TUser = {
	id: string;
	username: string;
};

// Тип карточки вишлиста (для ленты)
export type TWishlistCard = {
	_id: string;
	title: string;
	coverImage: string;
	author: { _id: string; username: string };
	itemCount: number;
	createdAt: string;
};

// Тип элемента вишлиста
export type TWishlistItem = {
	_id: string;
	wishlist: string;
	title: string;
	image: string;
	shopUrl: string;
	isBooked: boolean;
	isBookedByMe: boolean;
	createdAt: string;
};

// Тип детальной информации о вишлисте
export type TWishlistDetail = {
	_id: string;
	title: string;
	coverImage: string;
	author: { _id: string; username: string };
	isOwner: boolean;
	items: TWishlistItem[];
	createdAt: string;
	updatedAt: string;
};

// Тип ответа ленты (пагинация курсором)
export type TFeedResponse = {
	wishlists: TWishlistCard[];
	nextCursor: string | null;
};

// Тип ответа авторизации
export type TAuthResponse = {
	accessToken: string;
	user: TUser;
};

// Тип данных для авторизации
export type TLoginCredentials = {
	username: string;
	password: string;
};

// Тип данных для регистрации
export type TRegisterCredentials = {
	username: string;
	password: string;
};

// Тип данных для создания вишлиста
export type TCreateWishlistData = {
	title: string;
	coverImage: string;
	isPublic: boolean;
};

// Тип данных для обновления вишлиста
export type TUpdateWishlistData = {
	title?: string;
	coverImage?: string;
	isPublic?: boolean;
};

// Тип данных для создания элемента вишлиста
export type TCreateItemData = {
	title: string;
	image: string;
	shopUrl: string;
};
