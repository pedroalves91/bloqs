import { injectable } from 'tsyringe';
import { BloqModel } from '../models';
import { Bloq } from '../models';
import { UpdateBloqDto } from '../dtos';

@injectable()
export class BloqRepository {
    async createBloq(title: string, address: string): Promise<Bloq> {
        return await BloqModel.create({ title, address });
    }

    async findById(id: string): Promise<Bloq | null> {
        return BloqModel.findById(id).lean();
    }

    async findAll(): Promise<Bloq[]> {
        return BloqModel.find().lean();
    }

    async updateBloq(id: string, updateBloqDto: UpdateBloqDto): Promise<Bloq | null> {
        return BloqModel.findByIdAndUpdate({ _id: id }, { $set: updateBloqDto }, { new: true });
    }

    async deleteBloq(id: string): Promise<Bloq | null> {
        return BloqModel.findByIdAndDelete(id);
    }
}
