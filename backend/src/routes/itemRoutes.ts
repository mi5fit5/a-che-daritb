import { Router } from 'express';
import { body } from 'express-validator';
import { addItem, updateItem, deleteItem } from '../controllers/itemController';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';

const router = Router({ mergeParams: true });

router.post(
	'/',
	auth,
	[
		body('title').trim().notEmpty().withMessage('Укажите название вещи'),
		body('image').trim().notEmpty().withMessage('Укажите URL изображения'),
		body('shopUrl').trim().notEmpty().withMessage('Укажите ссылку на магазин'),
	],
	validate,
	addItem
);

router.put(
	'/:id',
	auth,
	[body('title').optional().trim().notEmpty()],
	validate,
	updateItem
);

router.delete('/:id', auth, deleteItem);

export default router;
