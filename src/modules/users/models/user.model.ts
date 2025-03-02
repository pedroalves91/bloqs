import { getModelForClass, prop } from '@typegoose/typegoose';
import { UserRole } from '../enums';
import { Country } from '../../general/enums/country.enum';

export class User {
    @prop({ required: true })
    name: string;

    @prop({ required: true, unique: true })
    email: string;

    @prop({ required: true })
    password: string;

    @prop({ enum: UserRole, default: UserRole.REGULAR_USER })
    role: UserRole;

    @prop({ required: true, enum: Country })
    country: Country;

    @prop({ default: Date.now })
    createdAt?: Date;
}

export const UserModel = getModelForClass(User);
