import prisma from "../src/utils/database";

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
}, 10000);

afterAll(async () => {
  await prisma.$disconnect();
});
