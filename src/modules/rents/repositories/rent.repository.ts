import { injectable } from 'tsyringe';
import { Rent, RentModel } from '../models';
import { CreateRentDto, UpdateRentDto } from '../dtos';
import { RentStatus } from '../enums';

@injectable()
export class RentRepository {
    async createRent(createRentDto: CreateRentDto): Promise<Rent> {
        return await RentModel.create(createRentDto);
    }

    async findById(id: string): Promise<Rent | null> {
        return RentModel.findById(id).lean();
    }

    async findAll(): Promise<Rent[]> {
        return RentModel.find().lean();
    }

    async findByLockerId(lockerId: string): Promise<Rent[]> {
        return RentModel.find({ lockerId }).lean();
    }

    async updateRent(id: string, updateRentDto: UpdateRentDto): Promise<Rent | null> {
        return RentModel.findByIdAndUpdate({ _id: id }, { $set: updateRentDto });
    }

    async setLockerId(id: string, lockerId: string): Promise<Rent | null> {
        return RentModel.findByIdAndUpdate(
            id,
            { $set: { lockerId, status: RentStatus.WAITING_DROPOFF } },
            { new: true }
        );
    }

    async dropoffRent(id: string, code: string): Promise<void> {
        await RentModel.findByIdAndUpdate(
            { _id: id },
            { $set: { status: RentStatus.WAITING_PICKUP, code } },
            { new: true }
        );
    }

    async pickupRent(id: string): Promise<void> {
        await RentModel.findByIdAndUpdate({ _id: id }, { $set: { status: RentStatus.DELIVERED } }, { new: true });
    }
}
