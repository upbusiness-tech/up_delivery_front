import axios from "axios";
import { api } from "../axios"
import type {
  CardPaymentPayload,
  CardPaymentResult,
  CreatePixPayment,
  OrderPaymentStatusData,
  PixData,
  RestaurantPublicKey,
} from "../../types/Payment.type";

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

  async createCardPayment(restaurantId: string, payload: CardPaymentPayload) {
    const { data } = await api.post<CardPaymentResult>(
      `/payment/create-payment-card/${restaurantId}`,
      payload,
    );
    return data;
  },

  async createCashPayment(orderId: string, changeFor: any) {
    const { data } = await api.post(`/payment/create-cash-payment/${orderId}`, changeFor);
    return data;
  },

  async getRestaurantPublicKey(restaurantId: string) {
    const { data } = await api.get<RestaurantPublicKey>(
      `/payment/public-key/${restaurantId}`,
    );
    return data;
  },

  async getStatusPaymentPolling(restaurantId: string, paymentId: string){
    const { data } = await api.get(`/payment/payment-status-polling/${restaurantId}/${paymentId}`)
    return data.status
  },

  async getPaymentStatus(orderId: string) {
    const { data } = await api.get<OrderPaymentStatusData>(
      `/payment/${orderId}/payment-status`,
    );
    return data;
  },
}
