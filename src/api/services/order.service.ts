import axios from "axios";
import { api } from "../axios"
import type { Order } from "../../types/Order.type";

export const OrderService = {
  async listOrders(){
    try{
      const { data } = await api.get<Order[]>(`/order/list-orders-restaurant`)
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
  async updateStatusOrder(status: string, orderId: string) {
    try {
      const {data} = await api.patch<Order>(`/order/${orderId}`, {
        status,
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error
    }
  },
  async updatePrinted(orderId: string) {
    try {
      const { data } = await api.post<Order>(`/order/${orderId}/printed`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },
  async updateOrderPaymentMethod(orderId: string, paymentMethod: string) {
    try {
      const { data } = await api.post(`/order/${orderId}/payment-method`, { paymentMethod });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    throw error;
    }
  },
}