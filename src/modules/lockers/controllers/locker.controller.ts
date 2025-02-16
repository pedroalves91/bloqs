import { Body, Delete, Get, Inject, Patch, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { LockerService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { CreateLockerDto, UpdateLockerDto } from '../dtos';
import { NextFunction } from 'express';
import logger from '../../../utils/logger.util';

@Route('lockers')
@Tags('Lockers')
@injectable()
export class LockerController {
    constructor(
        @inject(LockerService)
        private lockerService: LockerService
    ) {}

    @Post('/')
    @SuccessResponse(StatusCodes.CREATED, 'Locker Created')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async createLocker(
        @Body() lockerData: CreateLockerDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Creating locker in bloq: ${lockerData.bloqId}`);
            const locker = await this.lockerService.createLocker(lockerData);

            response.status(StatusCodes.CREATED).json(locker);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/')
    @SuccessResponse(StatusCodes.OK, 'Lockers Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findAllLockers(@Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding all lockers`);
            const lockers = await this.lockerService.findAllLockers();

            response.status(StatusCodes.OK).json(lockers);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/{id}')
    @SuccessResponse(StatusCodes.OK, 'Locker Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findLockerById(id: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding locker with id: ${id}`);
            const locker = await this.lockerService.findLockerById(id);

            response.status(StatusCodes.OK).json(locker);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/bloq/{bloqId}')
    @SuccessResponse(StatusCodes.OK, 'Lockers Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findLockersByBloqId(bloqId: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding lockers in bloq: ${bloqId}`);
            const lockers = await this.lockerService.findLockersByBloqId(bloqId);

            response.status(StatusCodes.OK).json(lockers);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Patch('/{id}')
    @SuccessResponse(StatusCodes.OK, 'Locker Updated')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async updateLocker(
        id: string,
        @Body() lockerData: UpdateLockerDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Updating locker with id: ${id}`);
            const locker = await this.lockerService.updateLocker(id, lockerData);

            response.status(StatusCodes.OK).json(locker);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Delete('/{id}')
    @SuccessResponse(StatusCodes.NO_CONTENT, 'Locker Deleted')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async deleteLocker(id: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Deleting locker with id: ${id}`);
            await this.lockerService.deleteLocker(id);

            response.status(StatusCodes.NO_CONTENT).send();
        } catch (internalError) {
            next(internalError);
        }
    }
}
