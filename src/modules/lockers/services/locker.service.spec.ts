import { mock, MockProxy } from 'jest-mock-extended';
import { LockerService } from './locker.service';
import { LockerRepository } from '../repositories';
import { LockerStatus } from '../enums';
import { Locker } from '../models';
import { CreateLockerDto } from '../dtos';
import { InternalServerError } from '../../../utils/http-error.util';

describe('LockerService', () => {
    let lockerService: LockerService;
    let lockerRepositoryMock: MockProxy<LockerRepository>;

    beforeEach(() => {
        lockerRepositoryMock = mock<LockerRepository>();
        lockerService = new LockerService(lockerRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('createLocker', () => {
        it('should create a locker', async () => {
            const lockerDto: CreateLockerDto = {
                bloqId: '456',
                status: LockerStatus.OPEN,
            };

            lockerRepositoryMock.createLocker.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);

            const result = await lockerService.createLocker(lockerDto);

            expect(result).toEqual({ _id: '123', bloqId: '456', status: LockerStatus.OPEN });
        });

        it('should throw an error if the locker creation fails', async () => {
            const lockerDto: CreateLockerDto = {
                bloqId: '456',
                status: LockerStatus.OPEN,
            };

            lockerRepositoryMock.createLocker.mockRejectedValue(new Error('Test Error'));

            await expect(lockerService.createLocker(lockerDto)).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('findLockerById', () => {
        it('should find a locker by id', async () => {
            lockerRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);

            const result = await lockerService.findLockerById('123');

            expect(result).toEqual({ _id: '123', bloqId: '456', status: LockerStatus.OPEN });
        });

        it('should throw an error if the locker search fails', async () => {
            lockerRepositoryMock.findById.mockRejectedValue(new Error('Test Error'));

            await expect(lockerService.findLockerById('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('findLockersByBloqId', () => {
        it('should find lockers by bloqId', async () => {
            lockerRepositoryMock.findByBloqId.mockResolvedValue([
                { _id: '123', bloqId: '456', status: LockerStatus.OPEN },
            ] as unknown as Locker[]);

            const result = await lockerService.findLockersByBloqId('456');

            expect(result).toEqual([{ _id: '123', bloqId: '456', status: LockerStatus.OPEN }]);
        });

        it('should throw an error if the locker search fails', async () => {
            lockerRepositoryMock.findByBloqId.mockRejectedValue(new Error('Test Error'));

            await expect(lockerService.findLockersByBloqId('456')).rejects.toThrow(
                new InternalServerError('Test Error')
            );
        });
    });

    describe('findAllLockers', () => {
        it('should find all lockers', async () => {
            lockerRepositoryMock.findAll.mockResolvedValue([
                { _id: '123', bloqId: '456', status: LockerStatus.OPEN },
            ] as unknown as Locker[]);

            const result = await lockerService.findAllLockers();

            expect(result).toEqual([{ _id: '123', bloqId: '456', status: LockerStatus.OPEN }]);
        });

        it('should throw an error if the locker search fails', async () => {
            lockerRepositoryMock.findAll.mockRejectedValue(new Error('Test Error'));

            await expect(lockerService.findAllLockers()).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('updateLocker', () => {
        it('should update a locker', async () => {
            lockerRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);
            lockerRepositoryMock.updateLocker.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);

            const result = await lockerService.updateLocker('123', { status: LockerStatus.CLOSED });

            expect(result).toEqual({ _id: '123', bloqId: '456', status: LockerStatus.OPEN });
        });

        it('should throw an error if the locker update fails', async () => {
            lockerRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);
            lockerRepositoryMock.updateLocker.mockRejectedValue(new Error('Test Error'));

            await expect(lockerService.updateLocker('123', { status: LockerStatus.CLOSED })).rejects.toThrow(
                new InternalServerError('Test Error')
            );
        });
    });

    describe('deleteLocker', () => {
        it('should delete a locker', async () => {
            lockerRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);
            lockerRepositoryMock.deleteLocker.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);

            const result = await lockerService.deleteLocker('123');

            expect(result).toEqual({ _id: '123', bloqId: '456', status: LockerStatus.OPEN });
        });

        it('should throw an error if the locker deletion fails', async () => {
            lockerRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                bloqId: '456',
                status: LockerStatus.OPEN,
            } as unknown as Locker);
            lockerRepositoryMock.deleteLocker.mockRejectedValue(new Error('Test Error'));

            await expect(lockerService.deleteLocker('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });
});
