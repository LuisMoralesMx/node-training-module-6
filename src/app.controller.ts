import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './services/app.service';
import { CartItemModel, CartModel } from './schemas/cart.entity';
import { ProductModel } from './schemas/product.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products')
  getProducts(): Promise<ProductModel[]> {
    return this.appService.getProducts();
  }

  @Post('item')
  addItems(@Body() cart: CartModel) {
    return this.appService.addItem(cart);
  }

  @Put('item/:id/count/:count')
  updateItemCount(@Param('id') id: number, @Param('count') count: number) {
    return this.appService.updateItemCount(id, count);
  }

  @Get('items')
  getItems(): Promise<CartItemModel[]> {
    return this.appService.fetchItems();
  }

  @Get('cart')
  getCart(): Promise<CartModel[]> {
    return this.appService.getCart();
  }

  @Delete('cart/:id')
  deleteCart(@Param('id') id: number) {
    return this.appService.deleteCart(id);
  }

  @Get('order/:id')
  getOrder(@Param('id') id: number): Promise<any> {
    return this.appService.getOrder(id);
  }
}
