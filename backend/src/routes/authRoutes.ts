import { Router } from 'express';
import { body } from 'express-validator';
import {
	register,
	login,
	refresh,
	getMe,
	logout,
} from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: { message: 'Слишком много попыток. Повторите позже.' },
});

router.post(
	'/register',
	authLimiter,
	[
		body('username')
			.trim()
			.isLength({ min: 3, max: 30 })
			.withMessage('Имя пользователя: 3-30 символов'),
		body('password')
			.isLength({ min: 6 })
			.withMessage('Пароль: минимум 6 символов'),
	],
	validate,
	register
);

router.post(
	'/login',
	authLimiter,
	[
		body('username').trim().notEmpty().withMessage('Введите имя пользователя'),
		body('password').notEmpty().withMessage('Введите пароль'),
	],
	validate,
	login
);

router.post('/refresh', refresh);
router.get('/me', auth, getMe);
router.post('/logout', logout);

export default router;
