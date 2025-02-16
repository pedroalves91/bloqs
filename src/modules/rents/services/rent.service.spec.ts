import { mock, MockProxy } from 'jest-mock-extended';
import { RentService } from './rent.service';
import { RentRepository } from '../repositories';
import { CreateRentDto, UpdateRentDto } from '../dtos';
import { RentSize, RentStatus } from '../enums';
import { Rent } from '../models';
import { EmailService } from '../../internal/emails/services';
import { LockerService } from '../../lockers/services';
import { LockerStatus } from '../../lockers/enums';
import { Locker } from '../../lockers/models';
import { BadRequestError, InternalServerError } from '../../../utils/http-error.util';

describe('RentService', () => {
    let rentService: RentService;
    let rentRepositoryMock: MockProxy<RentRepository>;
    let emailServiceMock: MockProxy<EmailService>;
    let lockerServiceMock: MockProxy<LockerService>;

    beforeEach(() => {
        rentRepositoryMock = mock<RentRepository>();
        emailServiceMock = mock<EmailService>();
        lockerServiceMock = mock<LockerService>();
        rentService = new RentService(rentRepositoryMock, emailServiceMock, lockerServiceMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('createRent', () => {
        it('should create a rent', async () => {
            const createRentDto: CreateRentDto = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };
            rentRepositoryMock.createRent.mockResolvedValue({ _id: '123', ...createRentDto } as unknown as Rent);

            const result = await rentService.createRent(createRentDto);

            expect(result).toEqual({ _id: '123', ...createRentDto });
        });

        it('should throw an error if the rent creation fails', async () => {
            const createRentDto: CreateRentDto = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
            };
            rentRepositoryMock.createRent.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.createRent(createRentDto)).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('findRentById', () => {
        it('should find a rent by id', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.CREATED,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);

            const result = await rentService.findRentById('123');

            expect(result).toEqual(rent);
        });

        it('should throw an error if the rent search fails', async () => {
            rentRepositoryMock.findById.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.findRentById('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('findAllRents', () => {
        it('should find all rents', async () => {
            const rents: Rent[] = [
                {
                    lockerId: '456',
                    weight: 7,
                    size: RentSize.M,
                    status: RentStatus.CREATED,
                    senderEmail: 'sender@mail.com',
                    receiverEmail: 'receiver@mail.com',
                    code: '123',
                },
            ];

            rentRepositoryMock.findAll.mockResolvedValue(rents);

            const result = await rentService.findAllRents();

            expect(result).toEqual(rents);
        });

        it('should throw an error if the rent search fails', async () => {
            rentRepositoryMock.findAll.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.findAllRents()).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('findRentsByLockerId', () => {
        it('should find all rents by locker id', async () => {
            const rents: Rent[] = [
                {
                    lockerId: '456',
                    weight: 7,
                    size: RentSize.M,
                    status: RentStatus.CREATED,
                    senderEmail: 'sender@mail.com',
                    receiverEmail: 'receiver@mail.com',
                    code: '123',
                },
            ];

            rentRepositoryMock.findByLockerId.mockResolvedValue(rents);

            const result = await rentService.findRentsByLockerId('123');

            expect(result).toEqual(rents);
        });

        it('should throw an error if the rent search fails', async () => {
            rentRepositoryMock.findByLockerId.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.findRentsByLockerId('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('updateRent', () => {
        it('should update a rent', async () => {
            const updateRentDto: UpdateRentDto = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.CREATED,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
            };

            lockerServiceMock.findLockerById.mockResolvedValue({
                _id: '456',
                status: LockerStatus.OPEN,
                isOccupied: false,
            } as unknown as Locker);
            rentRepositoryMock.updateRent.mockResolvedValue({ _id: '123', ...updateRentDto } as unknown as Rent);

            const result = await rentService.updateRent('123', updateRentDto);

            expect(result).toEqual({ _id: '123', ...updateRentDto });
        });

        it('should throw an error if the rent update fails', async () => {
            const updateRentDto: UpdateRentDto = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.CREATED,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
            };

            lockerServiceMock.findLockerById.mockResolvedValue({
                _id: '456',
                status: LockerStatus.OPEN,
                isOccupied: false,
            } as unknown as Locker);
            rentRepositoryMock.updateRent.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.updateRent('123', updateRentDto)).rejects.toThrow(
                new InternalServerError('Test Error')
            );
        });
    });

    describe('dropoffRent', () => {
        it('should dropoff a rent', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_DROPOFF,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.dropoffRent.mockResolvedValue();

            const result = await rentService.dropoffRent('123');

            expect(result).toBeUndefined();
        });

        it('should throw an error if the rent dropoff fails', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_DROPOFF,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.dropoffRent.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.dropoffRent('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });

        it('should throw a bad request error if rent does not have lockerId', async () => {
            const rent: Rent = {
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_DROPOFF,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.dropoffRent.mockResolvedValue();

            await expect(rentService.dropoffRent('123')).rejects.toThrow(
                new BadRequestError('Rent does not have a locker assigned')
            );
        });

        it('should throw a bad request error if rent status is not waiting dropoff', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.CREATED,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.dropoffRent.mockResolvedValue();

            await expect(rentService.dropoffRent('123')).rejects.toThrow(
                new BadRequestError('Rent is not in drop off status')
            );
        });
    });

    describe('pickupRent', () => {
        it('should pickup a rent', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_PICKUP,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.pickupRent.mockResolvedValue();

            const result = await rentService.pickupRent('123', '123');

            expect(result).toBeUndefined();
        });

        it('should throw an error if the rent pickup fails', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_PICKUP,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.pickupRent.mockRejectedValue(new Error('Test Error'));

            await expect(rentService.pickupRent('123', '123')).rejects.toThrow(new InternalServerError('Test Error'));
        });

        it('should throw a bad request error if the rent does not have lockerId', async () => {
            const rent: Rent = {
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_PICKUP,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.pickupRent.mockResolvedValue();

            await expect(rentService.pickupRent('123', '123')).rejects.toThrow(
                new BadRequestError('Rent does not have a locker assigned')
            );
        });

        it('should throw a bad request error if the rent is not in pick up status', async () => {
            const rent: Rent = {
                lockerId: '456',
                weight: 7,
                size: RentSize.M,
                status: RentStatus.WAITING_DROPOFF,
                senderEmail: 'send@mail.com',
                receiverEmail: 'receiver@mail.com',
                code: '123',
            };

            rentRepositoryMock.findById.mockResolvedValue(rent);
            rentRepositoryMock.pickupRent.mockResolvedValue();

            await expect(rentService.pickupRent('123', '123')).rejects.toThrow(
                new BadRequestError('Rent is not in pickup status')
            );
        });
    });
});
