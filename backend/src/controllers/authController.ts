import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
	JwtPayload,
} from '../utils/jwt';

const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict' as const,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	path: '/api/auth',
};

export const register = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password } = req.body;

		const existing = await User.findOne({ username });
		if (existing) {
			res
				.status(409)
				.json({ message: 'Пользователь с таким именем уже существует' });
			return;
		}

		const passwordHash = await bcrypt.hash(password, 12);
		const user = await User.create({ username, passwordHash });

		const payload: JwtPayload = {
			userId: user._id.toString(),
			username: user.username,
		};
		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);

		res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
		res.status(201).json({
			accessToken,
			user: { id: user._id, username: user.username },
		});
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка регистрации' });
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		if (!user) {
			res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
			return;
		}

		const payload: JwtPayload = {
			userId: user._id.toString(),
			username: user.username,
		};
		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);

		res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
		res.json({
			accessToken,
			user: { id: user._id, username: user.username },
		});
	} catch (_err) {
		res.status(500).json({ message: 'Ошибка входа' });
	}
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			res.status(401).json({ message: 'Refresh token отсутствует' });
			return;
		}

		const payload = verifyRefreshToken(token);
		const newPayload: JwtPayload = {
			userId: payload.userId,
			username: payload.username,
		};
		const accessToken = generateAccessToken(newPayload);
		const refreshToken = generateRefreshToken(newPayload);

		res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
		res.json({ accessToken });
	} catch {
		res.status(401).json({ message: 'Невалидный refresh token' });
	}
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await User.findById(req.user!.userId).select('-passwordHash');
		if (!user) {
			res.status(404).json({ message: 'Пользователь не найден' });
			return;
		}
		res.json({ id: user._id, username: user.username });
	} catch {
		res.status(500).json({ message: 'Ошибка получения данных' });
	}
};

export const logout = (_req: Request, res: Response): void => {
	res.clearCookie('refreshToken', { path: '/api/auth' });
	res.json({ message: 'Выход выполнен' });
};
