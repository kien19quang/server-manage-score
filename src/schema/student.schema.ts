import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Semester } from './semester.schema';
import { Class } from './class.schema';
import { Transcript } from './transcript.schema';

@Schema({
  timestamps: true,
  collection: 'Student',
})
export class Student {
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

  @Prop()
  wards: string;

  @Prop()
  district: string;
  
  @Prop()
  province: string;
  
  @Prop()
  nameBank: string;

  @Prop()
  accountNumber: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Semester' })
  semester: Semester

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Class' }])
  classes: Class[]

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Transcript' }])
  transcript: Transcript[]
}

export const StudentSchema = SchemaFactory.createForClass(Student);