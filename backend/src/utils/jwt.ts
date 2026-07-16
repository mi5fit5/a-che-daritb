import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-dev';
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export interface JwtPayload {
	userId: string;
	username: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
};

export const verifyAccessToken = (token: string): JwtPayload => {
	return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
	return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
