import prisma from "../utils/database";
import { CreateProductData, UpdateProductData } from "../types";

export class ProductService {
  static async createProduct(data: CreateProductData) {
    return await prisma.product.create({
      data,
    });
  }

  static async getAllProducts() {
    return await prisma.product.findMany({
      include: { orderItems: true },
    });
  }

  static async getProductById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: { include: { order: true } },
      },
    });
  }

  static async updateProduct(id: number, data: UpdateProductData) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: number) {
    return await prisma.product.delete({
      where: { id },
    });
  }

  static async searchProducts(search: string) {
    if (!search?.trim()) {
      return await prisma.product.findMany();
    }

    const lowerSearch = search.toLowerCase();

    const allProducts = await prisma.product.findMany();

    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerSearch) ||
        product.description.toLowerCase().includes(lowerSearch)
    );
  }

  static async getProductsByCategory(category: string) {
    if (!category?.trim()) return [];

    const lowerCategory = category.toLowerCase();

    const allProducts = await prisma.product.findMany();

    return allProducts.filter((product) =>
      product.category.toLowerCase().includes(lowerCategory)
    );
  }

  static async getLowStockProducts(threshold: number = 10) {
    return await prisma.product.findMany({
      where: {
        stockQuantity: { lt: threshold },
      },
      orderBy: { stockQuantity: "asc" },
    });
  }

  static async getPopularProducts(limit: number = 10) {
    const popularProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const productIds = popularProducts.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    return popularProducts.map((popular) => {
      const product = products.find((p) => p.id === popular.productId);
      return {
        ...product,
        totalSold: popular._sum.quantity || 0,
      };
    });
  }

  static async getProductsByPriceRange(minPrice: number, maxPrice: number) {
    return await prisma.product.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
      orderBy: { price: "asc" },
    });
  }
}
