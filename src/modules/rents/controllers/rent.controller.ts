import { Body, Get, Inject, Patch, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { RentService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { CreateRentDto, SetRentLockerDto, UpdateRentDto } from '../dtos';
import { NextFunction } from 'express';
import logger from '../../../utils/logger.util';

@Route('rents')
@Tags('Rents')
@injectable()
export class RentController {
    constructor(
        @inject(RentService)
        private rentService: RentService
    ) {}

    @Post('/')
    @SuccessResponse(StatusCodes.CREATED, 'Rent Created')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async createRent(
        @Body() rentData: CreateRentDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Creating rent for locker: ${rentData.lockerId}`);
            const rent = await this.rentService.createRent(rentData);

            response.status(StatusCodes.CREATED).json(rent);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/')
    @SuccessResponse(StatusCodes.OK, 'Rents Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findAllRents(@Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding all rents`);
            const rents = await this.rentService.findAllRents();

            response.status(StatusCodes.OK).json(rents);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/{id}')
    @SuccessResponse(StatusCodes.OK, 'Rent Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findRentById(id: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding rent with id: ${id}`);
            const rent = await this.rentService.findRentById(id);

            response.status(StatusCodes.OK).json(rent);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/locker/{lockerId}')
    @SuccessResponse(StatusCodes.OK, 'Rents Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findRentsByLockerId(
        lockerId: string,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Finding rents for locker: ${lockerId}`);
            const rents = await this.rentService.findRentsByLockerId(lockerId);

            response.status(StatusCodes.OK).json(rents);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Patch('/{id}')
    @SuccessResponse(StatusCodes.OK, 'Rent Updated')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async updateRent(
        id: string,
        @Body() rentData: UpdateRentDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Updating rent with id: ${id}`);
            const rent = await this.rentService.updateRent(id, rentData);

            response.status(StatusCodes.OK).json(rent);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Patch('/{id}/locker')
    @SuccessResponse(StatusCodes.NO_CONTENT, 'Rent Updated')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async setLockerId(
        id: string,
        @Body() rentLocker: SetRentLockerDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Setting locker id for rent with id: ${id}`);
            await this.rentService.setLockerId(id, rentLocker.lockerId);

            response.status(StatusCodes.NO_CONTENT).send();
        } catch (internalError) {
            next(internalError);
        }
    }

    @Patch('/{id}/dropoff')
    @SuccessResponse(StatusCodes.NO_CONTENT, 'Rent Updated')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async dropoffRent(id: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Dropping off rent with id: ${id}`);
            await this.rentService.dropoffRent(id);

            response.status(StatusCodes.NO_CONTENT).send();
        } catch (internalError) {
            next(internalError);
        }
    }

    @Patch('/{id}/pickup')
    @SuccessResponse(StatusCodes.NO_CONTENT, 'Rent Updated')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async pickupRent(id: string, code: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Picking up rent with id: ${id}`);
            await this.rentService.pickupRent(id, code);

            response.status(StatusCodes.NO_CONTENT).send();
        } catch (internalError) {
            next(internalError);
        }
    }
}
