import type { Order } from "./Order.type";

export interface OrderReportFilters {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  type?: "delivery" | "pickup";
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export interface OrderReportPaymentSummary {
  method: string;
  orders: number;
  revenue: number;
}

export interface OrderReportProductSummary {
  name: string;
  quantity: number;
  revenue: number;
}

export interface OrderReportSummary {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  deliveryOrders: number;
  pickupOrders: number;
  paymentMethods: OrderReportPaymentSummary[];
}

export interface OrderReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderReportResponse {
  orders: Order[];
  products: OrderReportProductSummary[];
  summary: OrderReportSummary;
  pagination: OrderReportPagination;
}
