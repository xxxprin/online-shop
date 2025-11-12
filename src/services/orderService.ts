import prisma from "../utils/database";
import { CreateOrderData, UpdateOrderData } from "../types";
import { OrderStatus } from "@prisma/client";

export class OrderService {
  static async createOrder(data: CreateOrderData) {
    const { customerId, shippingAddress, orderItems } = data;

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: orderItems.map((item) => item.productId),
        },
      },
    });

    let totalAmount = 0;
    const orderItemsWithPrices = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new Error(`Product with id ${item.productId} not found`);

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return await prisma.order.create({
      data: {
        customerId,
        shippingAddress,
        totalAmount,
        orderItems: {
          create: orderItemsWithPrices,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }

  static async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });
  }

  static async getOrderById(id: number) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async updateOrder(id: number, data: UpdateOrderData) {
    if (data.status === OrderStatus.CANCELLED) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: true,
        },
      });

      if (order) {
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    return await prisma.order.update({
      where: { id },
      data,
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async deleteOrder(id: number) {
    return await prisma.order.delete({
      where: { id },
    });
  }

  static async getOrderProducts(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return (
      order?.orderItems.map((item) => ({
        ...item.product,
        orderQuantity: item.quantity,
        orderUnitPrice: item.unitPrice,
      })) || []
    );
  }

  static async getOrdersByPeriod(startDate: Date, endDate: Date) {
    return await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });
  }

  static async getOrdersInTransit() {
    return await prisma.order.findMany({
      where: {
        status: OrderStatus.IN_TRANSIT,
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });
  }
}
