import { Types } from 'mongoose';
import { LockerStatus } from '../enums';
import { Size } from '../../general/enums/size.enum';

export interface Locker {
    _id?: Types.ObjectId;
    bloqId: string;
    status: LockerStatus;
    isOccupied: boolean;
    size: Size;
}
