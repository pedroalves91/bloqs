import { NextFunction, Response, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger.util';
import { parseBearer, verifyToken } from '../utils/auth.utils';
import { JwtPayload } from '../modules/general/interfaces';
import { container } from 'tsyringe';
import { UserService } from '../modules/users/services';
import { User } from '../modules/users/interfaces';
import { CustomRequest } from '../modules/general/interfaces';
import { UnauthorizedError } from '../utils/http-error.util';

export const jwtGuardMiddleware: RequestHandler = async (
    request: CustomRequest,
    response: Response,
    next: NextFunction
) => {
    const authHeader = request.headers.authorization;

    try {
        if (!authHeader) {
            throw new UnauthorizedError('No authorization header provided');
        }

        const accessToken = parseBearer(authHeader);
        if (!accessToken) {
            throw new UnauthorizedError('Invalid authorization format');
        }

        const payload: JwtPayload = await verifyToken(accessToken);
        if (!payload?.email) {
            throw new UnauthorizedError('Invalid token payload');
        }

        const userEmail = payload.email;
        const user = await verifyUserEmail(userEmail);

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        // Extract user from payload and attach to request
        request.user = user;
        next();
    } catch (error) {
        logger.error('Authentication failed:', error);
        if (error instanceof UnauthorizedError) {
            response.status(error.statusCode).json({
                message: error.message,
            });
        } else {
            response.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Authentication failed',
            });
        }
    }
};

const verifyUserEmail = async (email: string): Promise<User | null> => {
    const userService = container.resolve(UserService);
    return await userService.findUserByEmail(email);
};
