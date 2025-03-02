import { JwtPayload } from '../modules/general/interfaces';
import { UnauthorizedError } from './http-error.util';
import jwt from 'jsonwebtoken';
import config from 'config';

export const parseBearer = (header: string): string => {
    const [, token] = header.trim().split(' ');
    return token;
};

export const verifyToken = (token: string): JwtPayload => {
    const secretKey: string = config.get<string>('jwt.secret');

    try {
        const payload = jwt.verify(token, secretKey);
        return payload as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token has expired');
        }

        if (error instanceof jwt.JsonWebTokenError) {
            throw new UnauthorizedError('Invalid token');
        }

        throw new UnauthorizedError('Error validating token');
    }
};
