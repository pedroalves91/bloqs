import { RentSize, RentStatus } from '../enums';
import { Types } from 'mongoose';

export interface Rent {
    _id?: Types.ObjectId;
    lockerId?: string;
    weight: number;
    size: RentSize;
    status: RentStatus;
    senderEmail: string;
    code?: string;
    receiverEmail: string;
}
