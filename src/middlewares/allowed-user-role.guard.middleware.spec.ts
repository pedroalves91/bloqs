import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/users/enums';
import { ForbiddenError, UnauthorizedError } from '../utils/http-error.util';
import { allowedUserRolesGuard } from './allowed-user-role.guard.middleware';
import { CustomRequest } from '../modules/general/interfaces';

describe('allowedUserRolesGuard', () => {
    let mockRequest: Partial<CustomRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
        mockNext = jest.fn();
    });

    it('should throw UnauthorizedError if user is not authenticated', async () => {
        mockRequest.user = undefined; // User is not authenticated

        const middleware = allowedUserRolesGuard([UserRole.OPERATIONS_USER]);

        await middleware(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError('User not authenticated'));
    });

    it('should throw ForbiddenError if user has insufficient permissions', async () => {
        mockRequest.user = { role: UserRole.REGULAR_USER };

        const middleware = allowedUserRolesGuard([UserRole.OPERATIONS_USER]);

        await middleware(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(new ForbiddenError('Insufficient permissions'));
    });

    it('should call next() if user has sufficient permissions', async () => {
        mockRequest.user = { role: UserRole.OPERATIONS_USER };

        const middleware = allowedUserRolesGuard([UserRole.OPERATIONS_USER, UserRole.REGULAR_USER]);

        await middleware(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});
