import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './services/app.service';
import { Product } from './schemas/product.schema';
import { Cart } from './schemas/cart.schema';
import { Order } from './schemas/order.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products')
  getProducts(): Promise<Product[]> {
    return this.appService.getProducts();
  }

  @Post('item')
  addItems(@Body() cart: Cart) {
    return this.appService.addItem(cart);
  }

  @Put('user/:userId/item/:itemId/count/:count')
  updateItemQuantity(@Param('userId') userId: string, @Param('itemId') itemId: string, @Param('count') count: number) {
    return this.appService.updateItemCount(userId, itemId, count);
  }

  @Delete('cart/:id')
  deleteCart(@Param('id') id: string) {
    return this.appService.deleteCart(id);
  }

  @Get('cart')
  getCart(): Promise<Cart[]> {
    return this.appService.getCart();
  }

  @Get('order')
  getOrder(): Promise<Order> {
    return this.appService.getOrder();
  }
}
