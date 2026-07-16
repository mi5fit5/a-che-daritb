import { Router } from 'express';
import { bookItem, unbookItem } from '../controllers/bookingController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/:itemId/book', auth, bookItem);
router.delete('/:itemId/book', auth, unbookItem);

export default router;
