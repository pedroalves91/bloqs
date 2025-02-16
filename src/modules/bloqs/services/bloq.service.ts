import { inject, injectable } from 'tsyringe';
import { BloqRepository } from '../repository';
import logger from '../../../utils/logger.util';
import { UpdateBloqDto } from '../dtos';
import { GeneralError, InternalServerError, NotFoundError } from '../../../utils/http-error.util';

@injectable()
export class BloqService {
    constructor(@inject(BloqRepository) private bloqRepository: BloqRepository) {}

    async createBloq(title: string, address: string) {
        try {
            return await this.bloqRepository.createBloq(title, address);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error creating bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findBloqById(id: string) {
        try {
            const bloq = await this.bloqRepository.findById(id);

            if (!bloq) {
                throw new NotFoundError('Bloq not found');
            }

            return bloq;
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findAllBloqs() {
        try {
            return await this.bloqRepository.findAll();
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding bloqs: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async updateBloq(id: string, updateBloqDto: UpdateBloqDto) {
        try {
            await this.findBloqById(id);
            return await this.bloqRepository.updateBloq(id, updateBloqDto);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error updating bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async deleteBloq(id: string) {
        try {
            await this.findBloqById(id);
            return await this.bloqRepository.deleteBloq(id);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error deleting bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }
}
