import { CustomRequest } from '../modules/general/interfaces';
import { NextFunction, RequestHandler, Response } from 'express';
import { UserRole } from '../modules/users/enums';
import { ForbiddenError, UnauthorizedError } from '../utils/http-error.util';

export const allowedUserRolesGuard = (userRoles: UserRole[]): RequestHandler => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('User not authenticated');
            }

            const userRole = req.user.role;

            if (userRole && userRoles.includes(userRole)) {
                return next();
            } else {
                throw new ForbiddenError('Insufficient permissions');
            }
        } catch (error) {
            next(error);
        }
    };
};
