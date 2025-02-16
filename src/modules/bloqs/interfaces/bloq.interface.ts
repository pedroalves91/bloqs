import { Types } from 'mongoose';

export interface Bloq {
    _id?: Types.ObjectId;
    title: string;
    address: string;
}
