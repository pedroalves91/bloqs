import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

export const bodyValidationMiddleware = <T>(payloadClass: ClassConstructor<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = plainToInstance(payloadClass, req.body); // Convert raw body to DTO instance
        const errors = await validate(parsedBody as object);

        if (errors.length > 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Validation failed',
                errors: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
        } else {
            next();
        }
    };
};
