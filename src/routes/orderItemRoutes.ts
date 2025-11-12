import { Router } from "express";
import { OrderItemController } from "../controllers/orderItemController";

const router = Router();

router.post("/", OrderItemController.createOrderItem);
router.get("/", OrderItemController.getAllOrderItems);
router.get("/:id", OrderItemController.getOrderItemById);
router.put("/:id", OrderItemController.updateOrderItem);
router.delete("/:id", OrderItemController.deleteOrderItem);

export default router;
