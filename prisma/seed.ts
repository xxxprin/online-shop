import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const customer1 = await prisma.customer.create({
    data: {
      fullname: "Иванов Иван Иванович",
      phoneNumber: "+79161234567",
      email: "ivanov@example.com",
      address: "Москва, ул. Ленина, д. 1",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      fullname: "Петрова Мария Сергеевна",
      phoneNumber: "+79167654321",
      email: "petrova@example.com",
      address: "Санкт-Петербург, Невский пр., д. 100",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone 14",
      description: "Смартфон Apple iPhone 14 128GB",
      price: 79990,
      category: "Электроника",
      stockQuantity: 50,
      sku: "IPH14-128-BLK",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "MacBook Air",
      description: "Ноутбук Apple MacBook Air M2",
      price: 129990,
      category: "Электроника",
      stockQuantity: 25,
      sku: "MBA-M2-256",
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Футболка хлопковая",
      description: "Хлопковая футболка белого цвета",
      price: 1990,
      category: "Одежда",
      stockQuantity: 5, // Low stock
      sku: "TSH-COT-WHT",
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: "Война и мир",
      description: "Роман Льва Толстого",
      price: 890,
      category: "Книги",
      stockQuantity: 15,
      sku: "BOOK-TOL-WAR",
    },
  });

  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      shippingAddress: "Москва, ул. Ленина, д. 1",
      totalAmount: 79990,
      status: OrderStatus.DELIVERED,
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 79990,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      shippingAddress: "Санкт-Петербург, Невский пр., д. 100",
      totalAmount: 131980,
      status: OrderStatus.IN_TRANSIT,
      orderItems: {
        create: [
          {
            productId: product2.id,
            quantity: 1,
            unitPrice: 129990,
          },
          {
            productId: product3.id,
            quantity: 1,
            unitPrice: 1990,
          },
        ],
      },
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
