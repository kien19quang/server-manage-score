import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'Semester',
})
export class Semester {
  @Prop()
  title: string;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);