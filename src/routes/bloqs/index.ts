import { NextFunction, Response, Router } from 'express';
import { container } from 'tsyringe';
import { CreateBloqDto, UpdateBloqDto } from '../../modules/bloqs/dtos';
import { BloqController } from '../../modules/bloqs/controllers';
import { jwtGuardMiddleware, allowedUserRolesGuard, bodyValidationMiddleware } from '../../middlewares';
import { CustomRequest } from '../../modules/general/interfaces';
import { UserRole } from '../../modules/users/enums';

const router: Router = Router();

router.use(jwtGuardMiddleware);
router.use(allowedUserRolesGuard([UserRole.OPERATIONS_USER]));

router.post(
    '/',
    bodyValidationMiddleware(CreateBloqDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(BloqController);
        controller.createBloq(request.body, response, next);
    }
);

router.get('/:id', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(BloqController);
    controller.findBloqById(request?.params?.id, response, next);
});

router.get('/', (_request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(BloqController);
    controller.findAllBloqs(response, next);
});

router.patch(
    '/:id',
    bodyValidationMiddleware(UpdateBloqDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(BloqController);
        controller.updateBloq(request?.params?.id, request.body, response, next);
    }
);

router.delete('/:id', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(BloqController);
    controller.deleteBloq(request?.params?.id, response, next);
});

export default router;
