import { Types } from 'mongoose';
import { LockerStatus } from '../enums';

export interface Locker {
    _id?: Types.ObjectId;
    bloqId: string;
    status: LockerStatus;
    isOccupied: boolean;
}
