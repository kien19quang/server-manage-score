import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'Admin',
  toObject: {
    transform(doc, ret) {
      delete ret.password;
      return ret;
    },
  },
})
export class Admin {
  @Prop()
  _id: string

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);