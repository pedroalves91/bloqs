import { getModelForClass, prop } from '@typegoose/typegoose';
import { Country } from '../../general/enums/country.enum';
import mongoose from 'mongoose';

export class Bloq {
    @prop({ default: () => new mongoose.Types.ObjectId() })
    _id: mongoose.Types.ObjectId;

    @prop({ required: true })
    title: string;

    @prop({ required: true })
    address: string;

    @prop({ required: true, enum: Country })
    country: Country;
}

export const BloqModel = getModelForClass(Bloq);
