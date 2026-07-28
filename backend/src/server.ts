import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db';
import { initSocket } from './lib/socket';
import authRoutes from './routes/authRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

app.set('trust proxy', 1);

app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/items', bookingRoutes);

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const start = async () => {
	await connectDB();
	initSocket(httpServer);
	httpServer.listen(PORT, () => {
		console.log(`Сервер запущен на порту: ${PORT}`);
	});
};

start();

export default app;
