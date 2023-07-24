import { CartItemEntity } from './cart.entity';

type ORDER_STATUS = 'created' | 'completed';

export interface Payment {
  type: string;
  address?: string;
  creditCard?: any;
}

export interface Delivery {
  type: string;
  address: string;
}

export interface OrderEntity {
  id: string;
  userId: string;
  cartId: string;
  items: CartItemEntity[];
  payment: Payment;
  delivery: Delivery;
  comments: string;
  status: ORDER_STATUS;
  total: number;
}
