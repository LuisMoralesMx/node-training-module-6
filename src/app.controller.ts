import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
  addItems(@Body() cart: CartEntity) {
    return this.appService.addItem(cart);
  }

  @Put('item/:id/count/:count')
  updateItemQuantity(@Param('id') id: string, @Param('count') count: number) {
    return this.appService.updateItemCount(id, count);
  }

  @Delete('cart/:id')
  deleteCart(@Param('id') id: string) {
    return this.appService.deleteCart(id);
  }

  @Get('items')
  getItems(): CartItemEntity[] {
    return this.appService.fetchItems();
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
