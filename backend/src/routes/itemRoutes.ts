import { Router } from 'express';
import { body } from 'express-validator';
import { addItem, updateItem, deleteItem } from '../controllers/itemController';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';
import { ITEM_PRIORITIES } from '../models/Item';

const router = Router({ mergeParams: true });

router.post(
	'/',
	auth,
	[
		body('title').trim().notEmpty().withMessage('Укажите название вещи'),
		body('image').trim().notEmpty().withMessage('Укажите URL изображения'),
		body('shopUrl').trim().notEmpty().withMessage('Укажите ссылку на магазин'),
		body('price')
			.notEmpty()
			.withMessage('Укажите стоимость')
			.isFloat({ min: 0 })
			.withMessage('Стоимость должна быть числом ≥ 0'),
		body('priority')
			.optional()
			.isIn([...ITEM_PRIORITIES])
			.withMessage('Недопустимый уровень важности'),
	],
	validate,
	addItem
);

router.put(
	'/:id',
	auth,
	[
		body('title').optional().trim().notEmpty(),
		body('price')
			.optional()
			.isFloat({ min: 0 })
			.withMessage('Стоимость должна быть числом ≥ 0'),
		body('priority')
			.optional()
			.isIn([...ITEM_PRIORITIES])
			.withMessage('Недопустимый уровень важности'),
	],
	validate,
	updateItem
);

router.delete('/:id', auth, deleteItem);

export default router;
