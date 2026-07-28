import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer): Server => {
	io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL || 'http://localhost:5173',
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		socket.on('join-wishlist', (wishlistId: string) => {
			socket.join(`wishlist:${wishlistId}`);
		});

		socket.on('leave-wishlist', (wishlistId: string) => {
			socket.leave(`wishlist:${wishlistId}`);
		});
	});

	return io;
};

export const getIO = (): Server => {
	if (!io) {
		throw new Error('Socket.IO not initialized');
	}
	return io;
};
