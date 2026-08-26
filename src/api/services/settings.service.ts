import axios from "axios";
import api from "../axios";

export const SettingsController = {
  async toggleActive(id: string) {
    try {
      const { data } = await api.patch(`${id}/toggle`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
}