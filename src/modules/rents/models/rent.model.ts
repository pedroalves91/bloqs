import { getModelForClass, prop } from '@typegoose/typegoose';
import { RentStatus } from '../enums';
import { Size } from '../../general/enums/size.enum';
import mongoose from 'mongoose';

export class Rent {
    @prop({ default: () => new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @prop({ required: false })
    lockerId?: string;

    @prop({ required: true })
    weight: number;

    @prop({ required: true, enum: Size })
    size: Size;

    @prop({ required: true, enum: RentStatus, default: RentStatus.CREATED })
    status: RentStatus;

    @prop({ required: true })
    senderEmail: string;

    @prop({ required: true })
    receiverEmail: string;

    @prop({ required: false })
    code: string;
}

export const RentModel = getModelForClass(Rent);
