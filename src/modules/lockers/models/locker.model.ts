import { getModelForClass, prop } from '@typegoose/typegoose';
import { LockerStatus } from '../enums';
import { Size } from '../../general/enums/size.enum';
import mongoose from 'mongoose';

export class Locker {
    @prop({ default: () => new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @prop({ required: true })
    bloqId: string;

    @prop({ required: true, enum: LockerStatus, default: LockerStatus.OPEN })
    status: LockerStatus;

    @prop({ required: true, enum: Size })
    size: Size;

    @prop({ required: true, default: false })
    isOccupied: boolean;
}

export const LockerModel = getModelForClass(Locker);
