import { Types } from 'mongoose';
import { UserRole } from '../enums';
import { Country } from '../../general/enums/country.enum';

export interface User {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    country: Country;
    createdAt?: Date;
}
