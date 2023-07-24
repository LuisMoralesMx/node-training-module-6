import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartItemEntity } from '../schemas/cart.entity';

@Injectable()
export class RepositoryService {
  itemsStored: CartItemEntity[] = [];

  fetchItems(): CartItemEntity[] {
    return this.itemsStored;
  }

  storeItem(item: CartItemEntity) {
    if (item !== null && item.count > 1) {
      this.itemsStored.push(item);
    } else {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
