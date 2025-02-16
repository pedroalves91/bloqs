import { Router } from 'express';
import usersRouter from './users/index';
import bloqsRouter from './bloqs/index';
import lockersRouter from './lockers/index';
import rentsRouter from './rents/index';

const router: Router = Router();

router.use('/users', usersRouter);
router.use('/bloqs', bloqsRouter);
router.use('/lockers', lockersRouter);
router.use('/rents', rentsRouter);

export default router;
