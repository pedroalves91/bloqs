import { Types } from 'mongoose';
import { Country } from '../../general/enums/country.enum';

export interface Bloq {
    _id?: Types.ObjectId;
    title: string;
    address: string;
    country: Country;
}
