import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    login: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    fullName: string

    @Prop({default:""})
    orderId:string

    @Prop({default:''})
    acqId:string

    @Prop({default:false})
    freeTrialUsed:boolean

    @Prop()
    activationLink: string

    @Prop({default:false})
    isActivated: boolean

    @Prop()
    email:string

    @Prop()
    phone:string

    @Prop()
    address:string

    @Prop({default:''})
    dealer:string

}

export const UserSchema = SchemaFactory.createForClass(User);