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

function getPixPaymentErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown }
      | string
      | undefined;

    const rawMessage =
      typeof data === "string" ? data : data?.message;

    const message = Array.isArray(rawMessage)
      ? rawMessage
          .filter((item): item is string => typeof item === "string")
          .join(" ")
      : typeof rawMessage === "string"
        ? rawMessage
        : "";

    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";
    }

    if (error.response.status >= 500) {
      return "Não foi possível gerar o Pix agora. Tente novamente em instantes.";
    }

    if (message.trim()) return message.trim();

    return "Não foi possível gerar o Pix. Tente novamente.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "Não foi possível gerar o Pix. Tente novamente.";
}

export const PaymentSevice = {

  async createPixPayment(restaurantId: string, dto: CreatePixPayment){
    try{
      const { data } = await api.post<PixData>(`/payment/create-pix-payment/${restaurantId}`, dto)
      return data
    }catch (error) {
      console.error("Erro ao criar pagamento Pix:", error);
      throw new Error(getPixPaymentErrorMessage(error));
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
