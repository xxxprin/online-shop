import { Request, Response } from "express";
import { OrderItemService } from "../services/orderItemService";

export class OrderItemController {
  static async createOrderItem(req: Request, res: Response) {
    try {
      const orderItem = await OrderItemService.createOrderItem(req.body);
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllOrderItems(req: Request, res: Response) {
    try {
      const orderItems = await OrderItemService.getAllOrderItems();
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOrderItemById(req: Request, res: Response) {
    try {
      const orderItem = await OrderItemService.getOrderItemById(
        parseInt(req.params.id)
      );
      if (!orderItem) {
        return res.status(404).json({ error: "OrderItem not found" });
      }
      res.json(orderItem);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateOrderItem(req: Request, res: Response) {
    try {
      const orderItem = await OrderItemService.updateOrderItem(
        parseInt(req.params.id),
        req.body
      );
      res.json(orderItem);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteOrderItem(req: Request, res: Response) {
    try {
      await OrderItemService.deleteOrderItem(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
