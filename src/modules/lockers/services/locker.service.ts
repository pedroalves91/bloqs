import { inject, injectable } from 'tsyringe';
import { LockerRepository } from '../repositories';
import { GeneralError, InternalServerError, NotFoundError } from '../../../utils/http-error.util';
import logger from '../../../utils/logger.util';
import { CreateLockerDto, UpdateLockerDto } from '../dtos';

@injectable()
export class LockerService {
    constructor(@inject(LockerRepository) private lockerRepository: LockerRepository) {}

    async createLocker(lockerData: CreateLockerDto) {
        try {
            return await this.lockerRepository.createLocker(lockerData);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error creating locker: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findLockerById(id: string) {
        try {
            const locker = await this.lockerRepository.findById(id);

            if (!locker) {
                throw new NotFoundError('Locker not found');
            }

            return locker;
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding locker: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findLockersByBloqId(bloqId: string) {
        try {
            const locker = await this.lockerRepository.findByBloqId(bloqId);

            if (!locker) {
                throw new NotFoundError('Locker not found');
            }

            return locker;
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding lockers: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findAllLockers() {
        try {
            return await this.lockerRepository.findAll();
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding lockers: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async updateLocker(id: string, updateLockerDto: UpdateLockerDto) {
        try {
            await this.findLockerById(id);
            return await this.lockerRepository.updateLocker(id, updateLockerDto);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error updating locker: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async deleteLocker(id: string) {
        try {
            await this.findLockerById(id);
            return await this.lockerRepository.deleteLocker(id);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error deleting locker: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }
}
