import { NextFunction, Response, Router } from 'express';
import { allowedUserRolesGuard, bodyValidationMiddleware, jwtGuardMiddleware } from '../../middlewares';
import { CustomRequest } from '../../modules/general/interfaces';
import { container } from 'tsyringe';
import { CreateRentDto, SetRentLockerDto, UpdateRentDto } from '../../modules/rents/dtos';
import { RentController } from '../../modules/rents/controllers';
import { UserRole } from '../../modules/users/enums';

const router: Router = Router();

router.use(jwtGuardMiddleware);

router.post(
    '/',
    bodyValidationMiddleware(CreateRentDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(RentController);
        controller.createRent(request.body, response, next);
    }
);

router.get(
    '/',
    allowedUserRolesGuard([UserRole.OPERATIONS_USER]),
    (_request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(RentController);
        controller.findAllRents(response, next);
    }
);

router.get('/:id', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(RentController);
    controller.findRentById(request?.params?.id, request, response, next);
});

router.get(
    '/locker/:lockerId',
    allowedUserRolesGuard([UserRole.OPERATIONS_USER]),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(RentController);
        controller.findRentsByLockerId(request?.params?.lockerId, response, next);
    }
);

router.patch(
    '/:id/locker',
    bodyValidationMiddleware(SetRentLockerDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(RentController);
        controller.setLockerId(request?.params?.id, request.body, request, response, next);
    }
);

router.patch('/:id/dropoff', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(RentController);
    controller.dropoffRent(request?.params?.id, request, response, next);
});

router.patch('/:id/pickup/:code', (request: CustomRequest, response: Response, next: NextFunction) => {
    const controller = container.resolve(RentController);
    controller.pickupRent(request?.params?.id, request?.params?.code, response, next);
});

router.patch(
    '/:id',
    bodyValidationMiddleware(UpdateRentDto),
    (request: CustomRequest, response: Response, next: NextFunction) => {
        const controller = container.resolve(RentController);
        controller.updateRent(request?.params?.id, request.body, request, response, next);
    }
);

export default router;
