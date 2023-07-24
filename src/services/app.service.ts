import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductEntity } from '../schemas/product.entity';
import { CartEntity, CartItemEntity } from '../schemas/cart.entity';
import { OrderEntity } from '../schemas/order.entity';
import { RepositoryService } from 'src/repository/storage.repository';
import { catalogMock } from 'src/mocks/catalog.mock';
import { userMock } from 'src/mocks/user.mock';
import { UserEntity } from 'src/schemas/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(private repository: RepositoryService) {}

  getProducts(): ProductEntity[] {
    return catalogMock;
  }

  getCart(): CartEntity {
    return null;
  }

  getOrder(): OrderEntity {
    const items = this.repository.itemsStored;
    const user: UserEntity = userMock;

    let order: OrderEntity = null;

    if (items !== null && items.length > 0) {
      order = this.createOrder(user, items);
    } else {
      throw new HttpException('There are no items to generate the order', HttpStatus.BAD_REQUEST);
    }

    return order;
  }

  addItem(item: CartItemEntity) {
    if (item.product.id) {
      const product = catalogMock.filter((catalog) => catalog.id === item.product.id);

      this.repository.itemsStored.push({
        product: product[0],
        count: item.count,
      });
    } else {
      throw new HttpException('Item does not exist in catalog,', HttpStatus.BAD_REQUEST);
    }
  }

  fetchItems(): CartItemEntity[] {
    return this.repository.itemsStored;
  }

  createOrder(user: UserEntity, items: CartItemEntity[]): OrderEntity {
    return {
      id: uuidv4(),
      userId: user.id,
      cartId: '4e2752c3-00c0-4647-8caf-f27c4e9bbd61',
      items: items,
      payment: {
        type: 'Credit Card',
        address: 'Los Angeles 1225',
        creditCard: '000000000000',
      },
      delivery: {
        type: 'Post',
        address: 'Los Angeles 1225',
      },
      comments: '',
      status: 'created',
      total: 1,
    };
  }
}
