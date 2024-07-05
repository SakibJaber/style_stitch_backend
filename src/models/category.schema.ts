import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Category {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop()
  backgroundColor: string;

  @Prop()
  isExpandable: boolean;

  @Prop()
  subCategory: SubCategory[];
}

export class SubCategory {
  @Prop()
  name: string;

  @Prop()
  imageUrl: string;

  @Prop()
  isExpandable: boolean;

  @Prop()
  leafCategory: LeafCategory[];
}

export class LeafCategory {
  @Prop()
  name: string;

  @Prop()
  imageUrl: string;

  @Prop()
  isExpandable: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
