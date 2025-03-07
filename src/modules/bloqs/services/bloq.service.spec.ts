import { BloqService } from './bloq.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { BloqRepository } from '../repository';
import { Bloq } from '../models';
import { InternalServerError } from '../../../utils/http-error.util';
import { Country } from '../../general/enums/country.enum';
import { LockerService } from '../../lockers/services';

describe('BloqService', () => {
    let bloqService: BloqService;
    let bloqRepositoryMock: MockProxy<BloqRepository>;
    let lockerServiceMock: MockProxy<LockerService>;

    beforeEach(() => {
        bloqRepositoryMock = mock<BloqRepository>();
        lockerServiceMock = mock<LockerService>();
        bloqService = new BloqService(bloqRepositoryMock, lockerServiceMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('createBloq', () => {
        it('should create a bloq', async () => {
            bloqRepositoryMock.createBloq.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);

            const result = await bloqService.createBloq('Test Bloq', 'Test Address', Country.FRANCE);

            expect(result).toEqual({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            });
        });

        it('should throw an error if the bloq creation fails', async () => {
            bloqRepositoryMock.createBloq.mockRejectedValue(new Error('Test Error'));

            await expect(bloqService.createBloq('Test Bloq', 'Test Address', Country.FRANCE)).rejects.toThrow(
                new InternalServerError('Test Error')
            );
        });
    });

    describe('findBloqById', () => {
        it('should find a bloq by id', async () => {
            bloqRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);

            const result = await bloqService.findBloqById('123');

            expect(result).toEqual({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            });
        });

        it('should throw an error if the bloq search fails', async () => {
            bloqRepositoryMock.findById.mockRejectedValue(new Error('Test Error'));

            await expect(bloqService.findBloqById('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('findAllBloqs', () => {
        it('should find all bloqs', async () => {
            bloqRepositoryMock.findAll.mockResolvedValue([
                { _id: '123', title: 'Test Bloq', address: 'Test Address', country: Country.FRANCE },
            ] as unknown as Bloq[]);

            const result = await bloqService.findAllBloqs();

            expect(result).toEqual([
                { _id: '123', title: 'Test Bloq', address: 'Test Address', country: Country.FRANCE },
            ]);
        });

        it('should throw an error if the bloq search fails', async () => {
            bloqRepositoryMock.findAll.mockRejectedValue(new Error('Test Error'));

            await expect(bloqService.findAllBloqs()).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('updateBloq', () => {
        it('should update a bloq', async () => {
            bloqRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);
            bloqRepositoryMock.updateBloq.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);

            const result = await bloqService.updateBloq('123', {
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            });

            expect(result).toEqual({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            });
        });

        it('should throw an error if the bloq update fails', async () => {
            bloqRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);
            bloqRepositoryMock.updateBloq.mockRejectedValue(new Error('Test Error'));

            await expect(
                bloqService.updateBloq('123', { title: 'Test Bloq', address: 'Test Address', country: Country.FRANCE })
            ).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });

    describe('deleteBloq', () => {
        it('should delete a bloq', async () => {
            bloqRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);
            bloqRepositoryMock.deleteBloq.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);

            const result = await bloqService.deleteBloq('123');

            expect(result).toEqual({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            });
        });

        it('should throw an error if the bloq deletion fails', async () => {
            bloqRepositoryMock.findById.mockResolvedValue({
                _id: '123',
                title: 'Test Bloq',
                address: 'Test Address',
                country: Country.FRANCE,
            } as unknown as Bloq);
            bloqRepositoryMock.deleteBloq.mockRejectedValue(new Error('Test Error'));

            await expect(bloqService.deleteBloq('123')).rejects.toThrow(new InternalServerError('Test Error'));
        });
    });
});
