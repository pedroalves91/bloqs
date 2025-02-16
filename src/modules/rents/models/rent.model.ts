import { getModelForClass, prop } from '@typegoose/typegoose';
import { RentSize, RentStatus } from '../enums';

export class Rent {
    @prop({ required: false })
    lockerId?: string;

    @prop({ required: true })
    weight: number;

    @prop({ required: true, enum: RentSize })
    size: RentSize;

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
