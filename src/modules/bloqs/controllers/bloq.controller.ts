import { Body, Delete, Get, Inject, Patch, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { BloqService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { NextFunction } from 'express';
import logger from '../../../utils/logger.util';
import { CreateBloqDto, UpdateBloqDto } from '../dtos';

@Route('bloqs')
@Tags('Bloqs')
@injectable()
export class BloqController {
    constructor(
        @inject(BloqService)
        private bloqService: BloqService
    ) {}

    @Post('/')
    @SuccessResponse(StatusCodes.CREATED, 'Bloq Created')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async createBloq(
        @Body() bloqData: CreateBloqDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Creating bloq in address: ${bloqData.address}`);
            const bloq = await this.bloqService.createBloq(bloqData.title, bloqData.address, bloqData.country);

            response.status(StatusCodes.CREATED).json(bloq);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/')
    @SuccessResponse(StatusCodes.OK, 'Bloqs Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findAllBloqs(@Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding all bloqs`);
            const bloqs = await this.bloqService.findAllBloqs();

            response.status(StatusCodes.OK).json(bloqs);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Get('/{id}')
    @SuccessResponse(StatusCodes.OK, 'Bloq Found')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async findBloqById(id: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Finding bloq with id: ${id}`);
            const bloq = await this.bloqService.findBloqById(id);

            response.status(StatusCodes.OK).json(bloq);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Patch('/{id}')
    @SuccessResponse(StatusCodes.OK, 'Bloq Updated')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async updateBloq(
        id: string,
        @Body() bloqData: UpdateBloqDto,
        @Inject() response,
        @Inject() next: NextFunction
    ): Promise<void> {
        try {
            logger.info(`Updating bloq with id: ${id}`);
            const bloq = await this.bloqService.updateBloq(id, bloqData);

            response.status(StatusCodes.OK).json(bloq);
        } catch (internalError) {
            next(internalError);
        }
    }

    @Delete('/{id}')
    @SuccessResponse(StatusCodes.NO_CONTENT, 'Bloq Deleted')
    @Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error')
    public async deleteBloq(id: string, @Inject() response, @Inject() next: NextFunction): Promise<void> {
        try {
            logger.info(`Deleting bloq with id: ${id}`);
            await this.bloqService.deleteBloq(id);

            response.status(StatusCodes.NO_CONTENT).send();
        } catch (internalError) {
            next(internalError);
        }
    }
}
