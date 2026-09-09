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
    if (!restaurantId) {
      console.log("[SettingsService] restaurantId ainda não disponível");
      return null;
    }
    try{
      console.log("[SettingsService] Buscando configurações:", restaurantId);
      const res = await api.get(`/restaurant-setting-usage/${restaurantId}/restaurant`)
      return res;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "[SettingsService] Erro:",
          error.response?.data?.message,
        );
      } else {
        console.error("[SettingsService] Erro:", error);
      }

      return null;
    }
  }
}