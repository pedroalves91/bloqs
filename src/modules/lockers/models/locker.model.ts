import { getModelForClass, prop } from '@typegoose/typegoose';
import { LockerStatus } from '../enums';

export class Locker {
    @prop({ required: true })
    bloqId: string;

    @prop({ required: true, enum: LockerStatus, default: LockerStatus.OPEN })
    status: LockerStatus;

    @prop({ required: true, default: false })
    isOccupied: boolean;
}

export const LockerModel = getModelForClass(Locker);
