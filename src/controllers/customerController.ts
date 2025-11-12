import { Request, Response } from "express";
import { CustomerService } from "../services/customerService";

export class CustomerController {
  static async createCustomer(req: Request, res: Response) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const customer = await CustomerService.getCustomerById(
        parseInt(req.params.id)
      );
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const customer = await CustomerService.updateCustomer(
        parseInt(req.params.id),
        req.body
      );
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    try {
      await CustomerService.deleteCustomer(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async searchCustomers(req: Request, res: Response) {
    try {
      const { search } = req.query;
      if (!search) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const customers = await CustomerService.searchCustomers(search as string);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCustomerOrders(req: Request, res: Response) {
    try {
      const orders = await CustomerService.getCustomerOrders(
        parseInt(req.params.customerId)
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getTopCustomers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const customers = await CustomerService.getTopCustomers(limit);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getInactiveCustomers(req: Request, res: Response) {
    try {
      const months = parseInt(req.query.months as string) || 3;
      const customers = await CustomerService.getInactiveCustomers(months);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
