import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db';
import authRoutes from './routes/authRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/items', bookingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start
const start = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Сервер запущен на порту: ${PORT}`);
	});
};

start();

export default app;
