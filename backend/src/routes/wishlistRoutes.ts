import { Router } from 'express';
import { body } from 'express-validator';
import {
	getFeed,
	getMyWishlists,
	getWishlistById,
	createWishlist,
	updateWishlist,
	deleteWishlist,
} from '../controllers/wishlistController';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';
import itemRoutes from './itemRoutes';

const router = Router();

router.get('/', auth, getFeed);
router.get('/my', auth, getMyWishlists);
router.get('/:id', auth, getWishlistById);

router.post(
	'/',
	auth,
	[
		body('title').trim().notEmpty().withMessage('Укажите название'),
		body('coverImage').trim().notEmpty().withMessage('Укажите URL обложки'),
	],
	validate,
	createWishlist
);

router.put(
	'/:id',
	auth,
	[
		body('title')
			.optional()
			.trim()
			.notEmpty()
			.withMessage('Название не может быть пустым'),
	],
	validate,
	updateWishlist
);

router.delete('/:id', auth, deleteWishlist);

// Вложенные маршруты для items
router.use('/:wishlistId/items', itemRoutes);

export default router;
