import { NextFunction, Response, Router } from 'express';
import { allowedUserRolesGuard, bodyValidationMiddleware, jwtGuardMiddleware } from '../../middlewares';
import { UserRole } from '../../modules/users/enums';
import { CustomRequest } from '../../modules/general/interfaces';
import { container } from 'tsyringe';
import { CreateLockerDto } from '../../modules/lockers/dtos';
import { LockerController } from '../../modules/lockers/controllers';

const router: Router = Router();

router.use(jwtGuardMiddleware);
router.use(allowedUserRolesGuard([UserRole.OPERATIONS_USER]));

router.post(
    '/',
    bodyValidationMiddleware(CreateLockerDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(LockerController);
        controller.createLocker(request.body, response, next);
    }
);

router.get('/', (_request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(LockerController);
    controller.findAllLockers(response, next);
});

router.get('/:id', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(LockerController);
    controller.findLockerById(request?.params?.id, response, next);
});

router.get('/bloq/:bloqId', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(LockerController);
    controller.findLockersByBloqId(request?.params?.bloqId, response, next);
});

router.patch(
    '/:id',
    bodyValidationMiddleware(CreateLockerDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(LockerController);
        controller.updateLocker(request?.params?.id, request.body, response, next);
    }
);

router.delete('/:id', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(LockerController);
    controller.deleteLocker(request?.params?.id, response, next);
});

export default router;
