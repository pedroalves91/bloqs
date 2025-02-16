import { StatusCodes } from 'http-status-codes';

export interface ErrorOptions {
    details?: string;
    slug?: string;
    shouldExpose?: boolean;
}

export class GeneralError extends Error {
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    details?: string;
    slug?: string;
    shouldExpose: boolean = false;

    constructor(message: string, options: ErrorOptions = {}) {
        super(message);
        const { details, slug, shouldExpose = false } = options;

        this.details = details;
        this.shouldExpose = shouldExpose;
        this.slug = slug ?? (/^[a-z_]+(\.[a-z_]+)*$/.test(message) ? message : undefined);

        Object.setPrototypeOf(this, new.target.prototype);
    }

    getCode() {
        return this.statusCode;
    }

    static assessError(error) {
        if (error instanceof GeneralError) {
            throw error;
        }
    }
}

export class BadRequestError extends GeneralError {
    statusCode = StatusCodes.BAD_REQUEST;
    shouldExpose = true;
}

export class UnauthorizedError extends GeneralError {
    statusCode = StatusCodes.UNAUTHORIZED;
    shouldExpose = true;
}

export class ForbiddenError extends GeneralError {
    statusCode = StatusCodes.FORBIDDEN;
    shouldExpose = true;
}

export class NotFoundError extends GeneralError {
    statusCode = StatusCodes.NOT_FOUND;
    shouldExpose = true;
}

export class ConflictError extends GeneralError {
    statusCode = StatusCodes.CONFLICT;
    shouldExpose = true;
}

export class InternalServerError extends GeneralError {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    shouldExpose = false;
}

export const isGeneralError = (error: unknown): error is GeneralError => error instanceof GeneralError;
