import axios from "axios";
import { api } from "../axios"
import type { CreatePixPayment, PixData } from "../../types/Payment.type";

export const PaymentSevice = {
  async createPayment(restaurantId: string, dto: CreatePixPayment){
    try{
      const { data } = await api.post<PixData>(`/payment/create-payment-pix/${restaurantId}`, dto)
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async  createCardPayment(restaurantId: string, payload: any) {
    console.log("chegou aq")
    const { data } = await api.post(`/payment/card-payment/${restaurantId}`, payload);
    return data;
  },
  
  async getStatusPaymentPolling(restaurantId: string, orderId: string){
    const { data } = await api.get(`/payment/payment-status-polling/${restaurantId}/${orderId}`)
    return data.status
  }
}