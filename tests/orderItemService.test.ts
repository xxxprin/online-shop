import { OrderItemService } from "../src/services/orderItemService";
import prisma from "../src/utils/database";

describe("OrderItemService", () => {
  it("should create order item and reduce stock", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullname: "Клиент для заказа",
        phoneNumber: "+71111111111",
        address: "ул. Тестовая, 1",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Товар для теста",
        description: "Описание товара",
        price: 1500,
        category: "Тест",
        stockQuantity: 10,
        sku: "TEST001",
      },
    });

    const order = await prisma.order.create({
      data: {
        totalAmount: 0,
        status: "PENDING",
        shippingAddress: "ул. Тестовая, 1",
        customerId: customer.id,
      },
    });

    const item = await OrderItemService.createOrderItem({
      orderId: order.id,
      productId: product.id,
      quantity: 3,
    });

    expect(item.quantity).toBe(3);
    expect(item.unitPrice).toBe(1500);

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });
    expect(updatedProduct?.stockQuantity).toBe(7);
  });

  it("should throw error if insufficient stock", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullname: "Клиент 2",
        phoneNumber: "+72222222222",
        address: "Адрес",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Товар с малым запасом",
        description: "Тест",
        price: 500,
        category: "Тест",
        stockQuantity: 1,
        sku: "LOW001",
      },
    });

    const order = await prisma.order.create({
      data: {
        totalAmount: 0,
        status: "PENDING",
        shippingAddress: "Адрес",
        customerId: customer.id,
      },
    });

    await expect(
      OrderItemService.createOrderItem({
        orderId: order.id,
        productId: product.id,
        quantity: 5,
      })
    ).rejects.toThrow("Insufficient stock");
  });

  it("should delete order item and restore stock", async () => {
    const customer = await prisma.customer.create({
      data: {
        fullname: "Клиент для удаления",
        phoneNumber: "+73333333333",
        address: "Адрес",
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Товар для удаления",
        description: "Тест",
        price: 2000,
        category: "Тест",
        stockQuantity: 10,
        sku: "DEL001",
      },
    });

    const order = await prisma.order.create({
      data: {
        totalAmount: 0,
        status: "PENDING",
        shippingAddress: "Адрес",
        customerId: customer.id,
      },
    });

    const item = await OrderItemService.createOrderItem({
      orderId: order.id,
      productId: product.id,
      quantity: 4,
    });

    await OrderItemService.deleteOrderItem(item.id);

    const restoredProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });
    expect(restoredProduct?.stockQuantity).toBe(10);
  });
});
