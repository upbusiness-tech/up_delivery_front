import axios from "axios";
import { api } from "../axios"
import type { CreatePayment, PixData } from "../../types/Payment.type";

export const PaymentSevice = {
  async createPayment(dto: CreatePayment){
    try{
      const { data } = await api.post<PixData>(`/payment/create-payment`, dto)
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
}