import { inject, injectable } from 'tsyringe';
import { BloqRepository } from '../repository';
import logger from '../../../utils/logger.util';
import { UpdateBloqDto } from '../dtos';
import { GeneralError, InternalServerError, NotFoundError } from '../../../utils/http-error.util';
import { Bloq } from '../interfaces';
import { Rent } from '../../rents/interfaces';
import { Country } from '../../general/enums/country.enum';
import { LockerService } from '../../lockers/services';

@injectable()
export class BloqService {
    constructor(
        @inject(BloqRepository) private bloqRepository: BloqRepository,
        @inject(LockerService) private readonly lockerService: LockerService
    ) {}

    async createBloq(title: string, address: string, country: Country): Promise<Bloq> {
        try {
            console.log('Creating bloq SEGSGS');
            return await this.bloqRepository.createBloq(title, address, country);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error creating bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findBloqById(id: string): Promise<Bloq> {
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

    async findAllBloqs(): Promise<Bloq[]> {
        try {
            return await this.bloqRepository.findAll();
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding bloqs: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async updateBloq(id: string, updateBloqDto: UpdateBloqDto): Promise<Bloq | null> {
        try {
            await this.findBloqById(id);
            return await this.bloqRepository.updateBloq(id, updateBloqDto);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error updating bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async deleteBloq(id: string): Promise<Bloq | null> {
        try {
            await this.findBloqById(id);
            return await this.bloqRepository.deleteBloq(id);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error deleting bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async assignBloqAndLocker(rent: Rent, country: Country): Promise<string> {
        try {
            const bloqs = await this.bloqRepository.findByCountry(country);

            if (!bloqs.length) {
                throw new NotFoundError('No bloqs found for this country');
            }

            // we will use the first bloq found just for the sake of the example
            const bloq = bloqs[0];

            const lockers = await this.lockerService.findAvailableLockersByBloqIdAndSize(
                bloq._id.toString(),
                rent.size
            );

            if (!lockers.length) {
                throw new NotFoundError('No lockers found for this bloq');
            }

            const locker = lockers[0];

            return locker._id.toString();
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error assigning bloq: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }
}
