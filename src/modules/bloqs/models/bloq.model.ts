import { getModelForClass, prop } from '@typegoose/typegoose';

export class Bloq {
    @prop({ required: true })
    title: string;

    @prop({ required: true })
    address: string;
}

export const BloqModel = getModelForClass(Bloq);
