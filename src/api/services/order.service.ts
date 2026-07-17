import axios from "axios";
import { api } from "../axios"

export const OrderService = {
  async listOrders(){
    try{
      const { data } = await api.get(`/order`);
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  }
}