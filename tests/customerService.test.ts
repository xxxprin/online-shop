import { CustomerService } from "../src/services/customerService";
import prisma from "../src/utils/database";

describe("CustomerService", () => {
  it("should create customer and find by fullname", async () => {
    const created = await CustomerService.createCustomer({
      fullname: "Тест Тестов",
      phoneNumber: "+79998887766",
      email: "test@example.com",
      address: "ул. Тестовая, 1",
    });

    const results = await CustomerService.searchCustomers("тест");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].fullname.toLowerCase()).toContain("тест");
  });

  it("should create customer and find by email", async () => {
    await CustomerService.createCustomer({
      fullname: "Пётр Петров",
      phoneNumber: "+79998887767",
      email: "petr@example.com",
      address: "ул. Петрова, 2",
    });

    const results = await CustomerService.searchCustomers("petr@example.com");
    expect(results.length).toBe(1);
    expect(results[0].email).toBe("petr@example.com");
  });

  it("should get all customers", async () => {
    await CustomerService.createCustomer({
      fullname: "Иван Иванов",
      phoneNumber: "+79998887768",
      email: "ivan@example.com",
      address: "ул. Иванова, 3",
    });

    const customers = await CustomerService.getAllCustomers();
    expect(customers.length).toBeGreaterThan(0);
  });

  it("should update customer", async () => {
    const created = await CustomerService.createCustomer({
      fullname: "Старый Клиент",
      phoneNumber: "+79998887769",
      email: "old@example.com",
      address: "Старый адрес",
    });

    const updated = await CustomerService.updateCustomer(created.id, {
      fullname: "Новый Клиент",
    });

    expect(updated.fullname).toBe("Новый Клиент");
  });

  it("should delete customer", async () => {
    const created = await CustomerService.createCustomer({
      fullname: "Удаляемый Клиент",
      phoneNumber: "+79998887770",
      email: "delete@example.com",
      address: "Адрес",
    });

    await CustomerService.deleteCustomer(created.id);

    const found = await prisma.customer.findUnique({
      where: { id: created.id },
    });
    expect(found).toBeNull();
  });
});
