import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Teacher } from './teacher.schema';
import { SchemaTypes } from 'mongoose';
import { Subject } from './subject.schema';
import { Semester } from './semester.schema';
import { Student } from './student.schema';

@Schema({
  timestamps: true,
  collection: 'Class',
})
export class Class {
  @Prop()
  title: string;

  @Prop()
  maxQuantityStudent: number

  @Prop({ type: SchemaTypes.String, ref: 'Teacher' })
  teacher: Teacher

  @Prop({ type: SchemaTypes.String, ref: 'Subject' })
  subject: Subject

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Semester' })
  semester: Semester

  @Prop([{ type: SchemaTypes.String, ref: 'Student' }])
  students: Student[]

  @Prop([{ studentId: String, score: Number, processScore: Number }])
  scores: IScrore[];
}

export interface IScrore {
  studentId: string;
  score: number;
  processScore: number
}

export const ClassSchema = SchemaFactory.createForClass(Class);