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
    return this.repository.cartStored;
  }

  getOrder(): OrderEntity {
    const cart = this.repository.cartStored;
    const user: UserEntity = userMock;

    let order: OrderEntity = null;

    if (cart !== null && cart.items.length > 0) {
      order = this.createOrder(user, cart);
    } else {
      throw new HttpException('There are no items to generate the order', HttpStatus.BAD_REQUEST);
    }

    return order;
  }

  addItem(cart: CartEntity) {
    if (cart.items[0].product.id) {
      const cartId = this.validateCartId(cart, userMock);

      const newItem = cart.items.map((item) => ({
        count: item.count,
        product: catalogMock.filter((catalog) => catalog.id === cart.items[0].product.id)[0],
      }));

      this.repository.cartStored = {
        id: cartId,
        userId: userMock.id,
        isDeleted: false,
        items: this.repository.cartStored?.items ? this.repository.cartStored?.items.concat(newItem) : newItem,
      };
    } else {
      throw new HttpException('Item does not exist in catalog', HttpStatus.BAD_REQUEST);
    }
  }

  fetchItems(): CartItemEntity[] {
    return this.repository.cartStored.items;
  }

  updateItemCount(itemId: string, count: number) {
    if (this.repository.cartStored?.items) {
      const updated = this.repository.cartStored.items.map((item) => ({
        ...item,
        count: itemId === item.product.id ? count : item.count,
      }));

      this.repository.cartStored.items = updated;
    }
  }

  deleteCart(cartId: string) {
    if (this.repository.cartStored) {
      if (this.repository.cartStored.id === cartId) {
        this.repository.cartStored.isDeleted = true;
      } else {
        throw new HttpException('There is no cart to remove', HttpStatus.BAD_REQUEST);
      }
    }
  }

  createOrder(user: UserEntity, cartItems: CartEntity): OrderEntity {
    return {
      id: uuidv4(),
      userId: user.id,
      cartId: '4e2752c3-00c0-4647-8caf-f27c4e9bbd61',
      items: cartItems.items,
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
      total: cartItems.items.reduce((previousVal, currentVal) => {
        return previousVal + currentVal.product.price * currentVal.count;
      }, 0),
    };
  }

  validateCartId(cart: CartEntity, user: UserEntity): any {
    let cartId = null;

    if (cart.id) {
      // If exists, validate if the cartId for the current user.
      if (cart.userId === user.id) {
        cartId = cart.id;
      } else {
        throw new HttpException('User Id do not match', HttpStatus.BAD_REQUEST);
      }
    } else {
      // If it does not exist, a new one is generated.
      cartId = uuidv4();
    }
    return cartId;
  }
}
