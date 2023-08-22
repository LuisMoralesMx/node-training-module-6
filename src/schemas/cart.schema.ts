import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product, ProductSchema } from './product.schema';

@Schema()
export class CartItem {
  @Prop({ type: [ProductSchema], default: [] })
  product: Product;

  @Prop()
  count: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

export type CatDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
