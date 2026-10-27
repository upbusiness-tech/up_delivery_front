import axios from "axios";
import api from "../axios";
import type { RestaurantSettingUsage } from "../../types/Settings.type";

export const SettingsService = {
  async toggleActive(id: string): Promise<RestaurantSettingUsage> {
    try {
      const { data } = await api.patch<RestaurantSettingUsage>(
        `/restaurant-setting-usage/${id}/toggle`,
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async getSettings(restaurantId: string): Promise<RestaurantSettingUsage[]> {
    const { data } = await api.get<RestaurantSettingUsage[]>(
      `/restaurant-setting-usage/${restaurantId}/restaurant`,
    );
    return data;
  },
};
