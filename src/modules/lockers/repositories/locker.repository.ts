import { injectable } from 'tsyringe';
import { Locker, LockerModel } from '../models';
import { CreateLockerDto, UpdateLockerDto } from '../dtos';
import { LockerStatus } from '../enums';
import { Size } from '../../general/enums/size.enum';

@injectable()
export class LockerRepository {
    async createLocker(lockerData: CreateLockerDto): Promise<Locker> {
        return await LockerModel.create(lockerData);
    }

    async findById(id: string): Promise<Locker | null> {
        return LockerModel.findById(id).lean();
    }

    async findByBloqId(bloqId: string): Promise<Locker[]> {
        return LockerModel.find({ bloqId }).lean();
    }

    async findAll(): Promise<Locker[]> {
        return LockerModel.find().lean();
    }

    async findAvailableLockersByBloqIdAndSize(bloqId: string, size: Size): Promise<Locker[]> {
        return LockerModel.find({ bloqId, isOccupied: false, status: LockerStatus.OPEN, size }).lean();
    }

    async updateLocker(id: string, updateLockerDto: UpdateLockerDto): Promise<Locker | null> {
        return LockerModel.findByIdAndUpdate({ _id: id }, { $set: updateLockerDto }, { new: true });
    }

    async deleteLocker(id: string): Promise<Locker | null> {
        return LockerModel.findByIdAndDelete(id);
    }
}
