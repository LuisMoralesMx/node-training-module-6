import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CartItem, CartItemSchema } from './cart.schema';

type ORDER_STATUS = 'created' | 'completed';

@Schema()
export class Payment {
  @Prop()
  type: string;

  @Prop()
  address?: string;

  @Prop()
  creditCard?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

@Schema()
export class Delivery {
  @Prop()
  type: string;

  @Prop()
  address: string;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  cartId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem;

  @Prop({ type: [PaymentSchema], default: [] })
  payment: Payment;

  @Prop({ type: [DeliverySchema], default: [] })
  delivery: Delivery;

  @Prop()
  comments: string;

  @Prop()
  status: ORDER_STATUS;

  @Prop()
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
