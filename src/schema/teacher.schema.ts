import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'Teacher',
})
export class Teacher {
  @Prop()
  _id: string

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  gender: string;

  @Prop()
  birthday: Date;

  @Prop()
  phoneNumber: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);