import { NextFunction, Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../../modules/users/controllers';
import { bodyValidationMiddleware } from '../../middlewares';
import { CreateUserDto, LoginDto } from '../../modules/users/dtos';

const router: Router = Router();

router.post(
    '/register',
    bodyValidationMiddleware(CreateUserDto),
    (request: Request, response: Response, next: NextFunction) => {
        const controller = container.resolve(UserController);
        controller.createUser(request.body, response, next);
    }
);

router.post(
    '/login',
    bodyValidationMiddleware(LoginDto),
    (request: Request, response: Response, next: NextFunction) => {
        const controller = container.resolve(UserController);
        controller.login(request.body, response, next);
    }
);

export default router;
