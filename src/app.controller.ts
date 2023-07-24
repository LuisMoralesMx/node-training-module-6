import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './services/app.service';
import { ProductEntity } from './schemas/product.entity';
import { CartEntity, CartItemEntity } from './schemas/cart.entity';
import { OrderEntity } from './schemas/order.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products')
  getProducts(): ProductEntity[] {
    return this.appService.getProducts();
  }

  @Post('item')
  addItems(@Body() item: CartItemEntity) {
    return this.appService.addItem(item);
  }

  @Get('items')
  async getItems(): Promise<CartItemEntity[]> {
    return await this.appService.fetchItems();
  }

  @Get('cart')
  getCart(): CartEntity {
    return this.appService.getCart();
  }

  @Get('order')
  getOrder(): OrderEntity {
    return this.appService.getOrder();
  }
}
