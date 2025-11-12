import { ProductService } from "../src/services/productService";

describe("ProductService", () => {
  it("should create product and search by name", async () => {
    await ProductService.createProduct({
      name: "Тестовый Смартфон",
      description: "Описание смартфона",
      price: 29990,
      category: "Электроника",
      stockQuantity: 50,
      sku: "TEST001",
    });

    const results = await ProductService.searchProducts("смартфон");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain("смартфон");
  });

  it("should create product and search by description", async () => {
    await ProductService.createProduct({
      name: "Наушники",
      description: "Беспроводные наушники с шумоподавлением",
      price: 9990,
      category: "Аудио",
      stockQuantity: 30,
      sku: "TEST002",
    });

    const results = await ProductService.searchProducts("шумоподавление");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should get products by category (case insensitive)", async () => {
    await ProductService.createProduct({
      name: "Планшет",
      description: "Тестовый планшет",
      price: 19990,
      category: "Гаджеты",
      stockQuantity: 20,
      sku: "TEST003",
    });

    const results = await ProductService.getProductsByCategory("гаджеты");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category.toLowerCase()).toBe("гаджеты");
  });

  it("should get low stock products", async () => {
    const product = await ProductService.createProduct({
      name: "Товар с малым запасом",
      description: "Тест",
      price: 500,
      category: "Тест",
      stockQuantity: 5,
      sku: "LOW001",
    });

    const lowStock = await ProductService.getLowStockProducts(10);
    expect(lowStock.some((p) => p.id === product.id)).toBe(true);
  });
});
