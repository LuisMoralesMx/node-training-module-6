import { ProductEntity } from './product.entity';

export interface CartItemEntity {
  product: ProductEntity;
  count: number;
}

export interface CartEntity {
  id: string;
  userId: string;
  isDeleted: boolean;
  items: CartItemEntity[];
}

export interface CartModel {
  id: number;
  userId: number;
  isDeleted?: boolean;
  items?: CartItemModel;
}

export interface CartItemModel {
  productId: number;
  count: number;
}
