import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Semester } from './semester.schema';
import { Teacher } from './teacher.schema';
import { Subject } from './subject.schema';
import { Student } from './student.schema';

@Schema({
  timestamps: true,
  collection: 'Transcript',
})
export class Transcript {
  @Prop({ type: SchemaTypes.String, ref: 'Student' })
  student: Student

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Semester' })
  semester: Semester

  @Prop({ type: SchemaTypes.String, ref: 'Subject' })
  subject: Subject

  @Prop({ type: SchemaTypes.String, ref: 'Teacher' })
  teacher: Teacher

  @Prop()
  score: number;

  @Prop()
  processScore: number
}

export const TranscriptSchema = SchemaFactory.createForClass(Transcript);