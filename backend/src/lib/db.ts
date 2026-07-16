import mongoose from 'mongoose';

// Подключение к БД
export const connectDB = async () => {
	try {
		const dbUri =
			process.env.MONGODB_URI || 'mongodb://localhost:27017/wishlist-manager';
		const conn = await mongoose.connect(dbUri);

		console.log(`БД подключена: ${conn.connection.host}`);
	} catch (err) {
		if (err instanceof Error) {
			console.log('Ошибка при подключении к БД:', err.message);
		} else {
			console.log('Неизвестная ошибка');
		}

		process.exit(1);
	}
};
