import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})

export class Product {
  @Prop()
  name: string;

  @Prop()
  desc: string;

  @Prop()
  wishlisted: string;

  @Prop()
  actual_price: number;

  @Prop()
  discounted_price: number;

  @Prop()
  discount: number;

  @Prop()
  category: string;

  @Prop()
  sub_category: string;

  @Prop()
  type: string;

  @Prop()
  genre: string;

  @Prop()
  brand: string;

  @Prop()
  image_url: string;

  @Prop()
  rating: number;

  @Prop()
  no_of_review: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
