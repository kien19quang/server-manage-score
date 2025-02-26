import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'Subject',
})
export class Subject {
  @Prop()
  _id: string

  @Prop()
  title: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);