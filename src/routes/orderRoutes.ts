import { Router } from "express";
import { OrderController } from "../controllers/orderController";

const router = Router();

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderById);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

router.get("/:orderId/products", OrderController.getOrderProducts);
router.get("/analytics/period", OrderController.getOrdersByPeriod);
router.get("/status/in-transit", OrderController.getOrdersInTransit);

export default router;
