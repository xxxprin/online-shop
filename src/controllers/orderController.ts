import { Request, Response } from "express";
import { OrderService } from "../services/orderService";

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const order = await OrderService.getOrderById(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateOrder(req: Request, res: Response) {
    try {
      const order = await OrderService.updateOrder(
        parseInt(req.params.id),
        req.body
      );
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteOrder(req: Request, res: Response) {
    try {
      await OrderService.deleteOrder(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOrderProducts(req: Request, res: Response) {
    try {
      const products = await OrderService.getOrderProducts(
        parseInt(req.params.orderId)
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOrdersByPeriod(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "startDate and endDate are required" });
      }
      const orders = await OrderService.getOrdersByPeriod(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getOrdersInTransit(req: Request, res: Response) {
    try {
      const orders = await OrderService.getOrdersInTransit();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
