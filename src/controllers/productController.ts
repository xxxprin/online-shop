import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController {
  static async createProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductById(
        parseInt(req.params.id)
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.updateProduct(
        parseInt(req.params.id),
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      await ProductService.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async searchProducts(req: Request, res: Response) {
    try {
      const { search } = req.query;
      if (!search) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const products = await ProductService.searchProducts(search as string);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getPopularProducts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await ProductService.getPopularProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getLowStockProducts(req: Request, res: Response) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const products = await ProductService.getLowStockProducts(threshold);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const products = await ProductService.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getProductsByPriceRange(req: Request, res: Response) {
    try {
      const { minPrice, maxPrice } = req.query;
      if (!minPrice || !maxPrice) {
        return res
          .status(400)
          .json({ error: "minPrice and maxPrice are required" });
      }
      const products = await ProductService.getProductsByPriceRange(
        parseFloat(minPrice as string),
        parseFloat(maxPrice as string)
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
