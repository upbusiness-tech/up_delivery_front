import axios from "axios";
import { api } from "../axios"

export const RestaurantService = {

  async getMe() {
    try {
      const { data } = await api.get("/restaurant/me");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
 
  async restaurantIsopen(restaurantId: string){
    try{
      const { data } = await api.get<boolean>(`/restaurant/restaurant-isopen/${restaurantId}`);
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  }
}