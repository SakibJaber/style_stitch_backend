import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: [true, 'Duplicate Number'] })
  phone: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  alterNumber: string;

  @Prop()
  hint: string;

  @Prop()
  gender: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
