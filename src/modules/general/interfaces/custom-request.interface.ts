import { Request } from 'express';
import { UserRole } from '../../users/enums';
import { Country } from '../enums/country.enum';

export interface CustomRequest extends Request {
    user?: UserFromRequest;
}

export interface UserFromRequest {
    email?: string;
    id?: string;
    role: UserRole;
    country: Country;
}
