import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  id: number;

  @Prop({ require: true })
  title: string;

  @Prop({ require: true })
  description: string;

  @Prop()
  author: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
