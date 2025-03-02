import { RentStatus } from '../enums';
import { Types } from 'mongoose';
import { Size } from '../../general/enums/size.enum';

export interface Rent {
    _id?: Types.ObjectId;
    lockerId?: string;
    weight: number;
    size: Size;
    status: RentStatus;
    senderEmail: string;
    code?: string;
    receiverEmail: string;
}
