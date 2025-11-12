import prisma from "../utils/database";
import { CreateOrderItemData, UpdateOrderItemData } from "../types";

export class OrderItemService {
  static async createOrderItem(
    data: CreateOrderItemData & { orderId: number }
  ) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error(`Product with id ${data.productId} not found`);
    }

    if (product.stockQuantity < data.quantity) {
      throw new Error("Insufficient stock");
    }

    await prisma.product.update({
      where: { id: data.productId },
      data: { stockQuantity: { decrement: data.quantity } },
    });

    return await prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: product.price,
      },
      include: { product: true, order: true },
    });
  }

  static async getAllOrderItems() {
    return await prisma.orderItem.findMany({
      include: { order: true, product: true },
    });
  }

  static async getOrderItemById(id: number) {
    return await prisma.orderItem.findUnique({
      where: { id },
      include: { order: true, product: true },
    });
  }

  static async updateOrderItem(id: number, data: UpdateOrderItemData) {
    const existingItem = await prisma.orderItem.findUnique({ where: { id } });
    if (!existingItem) throw new Error("OrderItem not found");

    if (data.quantity && data.quantity !== existingItem.quantity) {
      const diff = data.quantity - existingItem.quantity;
      await prisma.product.update({
        where: { id: existingItem.productId },
        data: { stockQuantity: { decrement: diff } },
      });
    }

    return await prisma.orderItem.update({
      where: { id },
      data,
      include: { order: true, product: true },
    });
  }

  static async deleteOrderItem(id: number) {
    const item = await prisma.orderItem.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!item) return;

    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQuantity: { increment: item.quantity } },
    });

    return await prisma.orderItem.delete({ where: { id } });
  }
}
