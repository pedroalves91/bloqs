import { Types } from 'mongoose';
import { UserRole } from '../enums';

export interface User {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
}
