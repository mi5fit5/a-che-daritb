import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	console.error('Ошибка сервера', err.message);
	res.status(500).json({
		message: 'Внутренняя ошибка сервера',
		...(process.env.NODE_ENV === 'development' && { error: err.message }),
	});
};
