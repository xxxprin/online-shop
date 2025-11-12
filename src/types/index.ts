import { OrderStatus } from "@prisma/client";

export interface CreateCustomerData {
  fullname: string;
  phoneNumber: string;
  email?: string;
  address: string;
}

export interface UpdateCustomerData {
  fullname?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  sku: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stockQuantity?: number;
  sku?: string;
}

export interface CreateOrderData {
  customerId: number;
  shippingAddress: string;
  orderItems: CreateOrderItemData[];
}

export interface CreateOrderItemData {
  productId: number;
  quantity: number;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  shippingAddress?: string;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateOrderItemData {
  quantity?: number;
  unitPrice?: number;
}
