import axios from "axios";
import { api } from "../axios"
import type { CreatePayment, PixData } from "../../types/Payment.type";

export const PaymentSevice = {
  async createPayment(dto: CreatePayment){
    try{
      const { data } = await api.post<PixData>(`/payment/create-payment-pix`, dto)
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
  
  async getStatusPaymentPolling(restaurantId: string, orderId: string){
    const { data } = await api.get(`/payment/payment-status-polling/${restaurantId}/${orderId}`)
    return data.status
  }
}