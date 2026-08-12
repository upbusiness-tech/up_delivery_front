import axios from "axios";
import { api } from "../axios"
import type { CreatePixPayment, PixData } from "../../types/Payment.type";

export const PaymentSevice = {
  async createPixPayment(restaurantId: string, dto: CreatePixPayment){
    try{
      const { data } = await api.post<PixData>(`/payment/create-pix-payment/${restaurantId}`, dto)
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async  createCardPayment(restaurantId: string, payload: any) {
    const { data } = await api.post(`/payment/create-card-payment/${restaurantId}`, payload);
    return data;
  },

  async  createCashPayment(orderId: string) {
    const { data } = await api.post(`/payment/create-cash-payment/${orderId}`);
    return data;
  },
  
  async getStatusPaymentPolling(restaurantId: string, orderId: string){
    const { data } = await api.get(`/payment/payment-status-polling/${restaurantId}/${orderId}`)
    return data.status
  }
}