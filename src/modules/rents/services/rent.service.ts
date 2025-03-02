import { inject, injectable } from 'tsyringe';
import { RentRepository } from '../repositories';
import { CreateRentDto, UpdateRentDto } from '../dtos';
import {
    BadRequestError,
    ForbiddenError,
    GeneralError,
    InternalServerError,
    NotFoundError,
} from '../../../utils/http-error.util';
import logger from '../../../utils/logger.util';
import { RentStatus } from '../enums';
import { generateCode } from '../../../utils/general.utils';
import { EmailService } from '../../internal/emails/services';
import { LockerService } from '../../lockers/services';
import { LockerStatus } from '../../lockers/enums';
import { UserFromRequest } from '../../general/interfaces';
import { UserRole } from '../../users/enums';
import { BloqService } from '../../bloqs/services';

@injectable()
export class RentService {
    constructor(
        @inject(RentRepository) private rentRepository: RentRepository,
        @inject(EmailService) private readonly emailService: EmailService,
        @inject(LockerService) private readonly lockerService: LockerService,
        @inject(BloqService) private readonly bloqService: BloqService
    ) {}

    async createRent(createRentDto: CreateRentDto, user: UserFromRequest) {
        try {
            const rent = await this.rentRepository.createRent(createRentDto);

            const lockerId = await this.bloqService.assignBloqAndLocker(rent, user.country);

            const updatedRent = await this.rentRepository.setLockerId(rent._id.toString(), lockerId);

            await this.lockerService.updateLocker(lockerId, { status: LockerStatus.CLOSED });

            return updatedRent;
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error creating rent: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findRentById(id: string, user?: UserFromRequest) {
        try {
            const rent = await this.rentRepository.findById(id);

            if (!rent) {
                throw new NotFoundError('Rent not found');
            }

            if (user && rent.senderEmail !== user.email && user.role !== UserRole.OPERATIONS_USER) {
                throw new ForbiddenError('You are not authorized to view this rent');
            }

            return rent;
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding rent: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findAllRents() {
        try {
            return await this.rentRepository.findAll();
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding rents: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async findRentsByLockerId(lockerId: string) {
        try {
            await this.lockerService.findLockerById(lockerId);

            return await this.rentRepository.findByLockerId(lockerId);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error finding rents: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async updateRent(id: string, updateRentDto: UpdateRentDto, user?: UserFromRequest) {
        try {
            const rent = await this.findRentById(id);

            if (user && rent.senderEmail !== user.email && user.role !== UserRole.OPERATIONS_USER) {
                throw new ForbiddenError('You are not authorized to view this rent');
            }

            if (updateRentDto.lockerId) {
                const locker = await this.lockerService.findLockerById(updateRentDto.lockerId);

                if (locker.isOccupied) {
                    throw new BadRequestError('Locker is already occupied');
                }

                if (locker.status !== LockerStatus.OPEN) {
                    throw new BadRequestError('Locker is not open');
                }
            }

            return await this.rentRepository.updateRent(id, updateRentDto);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error updating rent: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async dropoffRent(id: string, user?: UserFromRequest) {
        try {
            const rent = await this.findRentById(id);

            if (user && rent.senderEmail !== user.email && user.role !== UserRole.OPERATIONS_USER) {
                throw new ForbiddenError('You are not authorized to view this rent');
            }

            if (!rent.lockerId) {
                throw new BadRequestError('Rent does not have a locker assigned');
            }

            if (rent.status !== RentStatus.WAITING_DROPOFF) {
                throw new ForbiddenError('Rent is not in drop off status');
            }

            const randomCode = generateCode();
            await this.rentRepository.dropoffRent(id, randomCode);

            await this.lockerService.updateLocker(rent.lockerId, { isOccupied: true });

            await this.emailService.sendRentDropoffEmail(rent.receiverEmail, rent.lockerId, randomCode);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error dropping off rent: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    async pickupRent(id: string, code: string, user: UserFromRequest) {
        try {
            const rent = await this.findRentById(id);

            if (!rent.lockerId) {
                throw new BadRequestError('Rent does not have a locker assigned');
            }

            if (rent.status !== RentStatus.WAITING_PICKUP) {
                throw new ForbiddenError('Rent is not in pickup status');
            }

            if (rent.receiverEmail !== user.email && user.role !== UserRole.OPERATIONS_USER) {
                throw new ForbiddenError('You are not authorized to update this rent');
            }

            this.validateRentCode(rent.code, code);
            await this.rentRepository.pickupRent(id);

            await this.lockerService.updateLocker(rent.lockerId, { isOccupied: false, status: LockerStatus.OPEN });

            await this.emailService.notifyRentDelivered(rent.senderEmail, code);
        } catch (error: any) {
            GeneralError.assessError(error);
            logger.error(`Error picking up rent: ${error.message}`);
            throw new InternalServerError(error.message);
        }
    }

    private validateRentCode(rentCode: string, code: string) {
        if (rentCode !== code) {
            throw new ForbiddenError('Invalid code');
        }
    }
}
