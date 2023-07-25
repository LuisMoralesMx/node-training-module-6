import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartEntity, CartItemEntity } from '../schemas/cart.entity';

@Injectable()
export class RepositoryService {
  cartStored: CartEntity = null;

  fetchItems(): CartEntity {
    return this.cartStored;
  }

  storeItem(item: CartItemEntity) {
    if (item !== null && item.count > 1) {
      this.cartStored.items.push(item);
    } else {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
