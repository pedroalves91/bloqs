import { injectable } from 'tsyringe';
import { User } from '../models';
import { UserModel } from '../models';
import { CreateUserDto } from '../dtos';

@injectable()
export class UserRepository {
    async createUser(userData: CreateUserDto): Promise<User> {
        return await UserModel.create(userData);
    }

    async findByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({ email }).lean();
    }
}
