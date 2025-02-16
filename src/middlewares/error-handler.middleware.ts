import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { isGeneralError } from '../utils/http-error.util';

export const errorHandler: ErrorRequestHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // If the error is a custom general error handle it
    if (isGeneralError(err)) {
        res.status(err.getCode()).json({
            message: err.message,
        });
        return;
    }

    // If the error is an unexpected one, send a generic 500 error
    res.status(500).json({
        message: 'Internal server error',
        details: err.message || 'Something went wrong',
    });
};
