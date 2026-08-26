import axios from "axios";
import api from "../axios";

export const SettingsService = {
  async toggleActive(id: string) {
    try {
      const { data } = await api.patch(`/restaurant-setting-usage/${id}/toggle`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
  async getSettings(restaurantId: string){
    try{
      const res = await api.get(`/restaurant-setting-usage/${restaurantId}/restaurant`)
      return res;
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  }
}