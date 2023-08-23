import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/schemas/cart.schema';
import { Model } from 'mongoose';
import { Order } from 'src/schemas/order.schema';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async addProducts(product: Product): Promise<Product> {
    const productItem = new this.productModel(product);
    return productItem.save();
  }

  async getCart(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async getOrder(): Promise<Order> {
    return this.orderModel.findOne().exec();
  }

  async addItem(cartDto: Cart) {
    let cartAvailable = false;

    const cartItem = new this.cartModel(cartDto);

    await this.getCart().then((response) => {
      cartAvailable = response.filter((cart) => cart.id === cartDto.id).length > 0;
    });

    // Check if a cart already exist if not, let's create a cart entry.
    if (!cartAvailable) {
      cartItem.save();
    } else {
      // If cart exist and there are items to add, let's create the items entry
      cartItem.updateOne({ id: cartDto.id }, cartDto);
    }
  }

  async updateItemCount(userId: string, itemId: string, count: number) {
    const cart: Cart = await this.getCart()[0];

    if (cart?.items) {
      const updated = cart.items.map((item) => ({
        ...item,
        count: itemId === item.product.id ? count : item.count,
      }));

      this.cartModel.updateOne({ userId: userId }, updated);
    }
  }

  deleteCart(cartId: string) {
    this.cartModel.updateOne({ id: cartId }, { isDeleted: true });
  }
}
