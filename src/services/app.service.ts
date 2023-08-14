import { Injectable } from '@nestjs/common';
import { CartItemModel, CartModel } from '../schemas/cart.entity';
import { RepositoryService } from 'src/repository/storage.repository';
import { PrismaClient } from '@prisma/client';
import { ProductModel } from 'src/schemas/product.entity';

@Injectable()
export class AppService {
  prisma: PrismaClient;

  constructor(private repository: RepositoryService) {
    this.prisma = new PrismaClient();
  }

  async getProducts(): Promise<ProductModel[]> {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async getCart(): Promise<CartModel[]> {
    const products = await this.prisma.cart.findMany();
    return products;
  }

  async addItem(cart: CartModel) {
    let createCart: CartModel;
    let createItems: any;

    const findCart = await this.prisma.cart.findUnique({
      where: {
        id: cart.userId,
      },
    });

    // Check if a cart already exist if not, let's create a cart entry.
    if (!findCart) {
      createCart = await this.prisma.cart.create({
        data: {
          userId: cart.userId,
          isDeleted: cart.isDeleted,
        },
      });
    }

    // Assign Cart Id
    const cartId = findCart?.id ? findCart.id : createCart.id;

    // If cart exist and there are items to add, let's create the items entry
    if (cartId && cart.items && cart.items) {
      createItems = await this.prisma.cartItem.create({
        data: {
          count: cart.items.count,
          cartId: cartId,
          productId: cart.items.productId,
        },
      });

      return createItems;
    }
  }

  async updateItemCount(itemId: number, count: number) {
    const updateQuantity = await this.prisma.cartItem.update({
      where: {
        id: +itemId,
      },
      data: {
        count: +count,
      },
    });
    console.log(updateQuantity);
    return updateQuantity;
  }

  async fetchItems(): Promise<CartItemModel[]> {
    const items = await this.prisma.cartItem.findMany();
    return items;
  }

  async deleteCart(cartId: number) {
    // 1st. Delete any reference to the cartId in the 'CartItem' table.
    const deleteCartItems = await this.prisma.cartItem.deleteMany({
      where: {
        cartId: {
          equals: cartId,
        },
      },
    });

    // 2nd. Delete any reference to the cartId in the 'Cart' table.
    const deleteCart = await this.prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    return {
      deletedCart: deleteCart,
      deletedCartItems: deleteCartItems,
    };
  }

  async getOrderV1(userId: number): Promise<any> {
    const result = await this.prisma.$queryRaw`SELECT
      (SELECT USR.NAME
        FROM PUBLIC."User" USR
        WHERE USR."id" = 1) AS NAME,
    
      (SELECT PDT.TITLE
        FROM PUBLIC."Product" PDT
        WHERE PDT.ID = ITM."productId") AS TITLE,
    
      (SELECT PDT.DESCRIPTION
        FROM PUBLIC."Product" PDT
        WHERE PDT.ID = ITM."productId") AS PRODUCT,
    
      (SELECT PDT.PRICE
        FROM PUBLIC."Product" PDT
        WHERE PDT.ID = ITM."productId") AS PRICE,
      ITM.COUNT
      FROM PUBLIC."Cart" CRT
      LEFT JOIN PUBLIC."CartItem" ITM ON (CRT.ID = ITM."cartId")
      WHERE CRT."userId" = ${+userId}`;

    return result;
  }
}
