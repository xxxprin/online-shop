import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

router.get("/search/products", ProductController.searchProducts);
router.get("/analytics/popular", ProductController.getPopularProducts);
router.get("/analytics/low-stock", ProductController.getLowStockProducts);
router.get("/category/:category", ProductController.getProductsByCategory);
router.get("/price/range", ProductController.getProductsByPriceRange);

export default router;
