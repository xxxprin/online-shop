// src/services/customerService.ts
import prisma from "../utils/database";
import { CreateCustomerData, UpdateCustomerData } from "../types";

export class CustomerService {
  static async createCustomer(data: CreateCustomerData) {
    return await prisma.customer.create({
      data,
    });
  }

  static async getAllCustomers() {
    return await prisma.customer.findMany({
      include: { orders: true },
    });
  }

  static async getCustomerById(id: number) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            orderItems: { include: { product: true } },
          },
        },
      },
    });
  }

  static async updateCustomer(id: number, data: UpdateCustomerData) {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  }

  static async deleteCustomer(id: number) {
    return await prisma.customer.delete({
      where: { id },
    });
  }

  static async searchCustomers(search: string) {
    if (!search?.trim()) {
      return await prisma.customer.findMany();
    }

    const lowerSearch = search.toLowerCase();

    const allCustomers = await prisma.customer.findMany();

    return allCustomers.filter(
      (customer) =>
        customer.fullname.toLowerCase().includes(lowerSearch) ||
        (customer.email &&
          customer.email.toLowerCase().includes(lowerSearch)) ||
        customer.phoneNumber.includes(search)
    );
  }

  static async getCustomerOrders(customerId: number) {
    return await prisma.order.findMany({
      where: { customerId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { orderDate: "desc" },
    });
  }

  static async getTopCustomers(limit: number = 10) {
    const customers = await prisma.customer.findMany({
      include: {
        orders: true,
      },
    });

    return customers
      .map((customer) => ({
        ...customer,
        orderCount: customer.orders.length,
        totalSpent: customer.orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, limit);
  }

  static async getInactiveCustomers(months: number = 3) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    const allCustomers = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: { orderDate: "desc" },
          take: 1,
        },
      },
    });

    return allCustomers.filter((customer) => {
      const lastOrder = customer.orders[0];
      return !lastOrder || new Date(lastOrder.orderDate) < cutoffDate;
    });
  }
}
