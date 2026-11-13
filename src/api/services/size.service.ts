import axios from "axios";
import { api } from "../axios";
import type { Size, SizeDTO } from "../../types/Product.type";

export const SizeService = {
  async createSize(body: SizeDTO) {
    try {
      const { data } = await api.post<Size>("/size/create-size", body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async updateSize(sizeId: string, body: Partial<SizeDTO>) {
    try {
      const { data } = await api.patch<Size>(`/size/update-size/${sizeId}`, body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async deleteSize(sizeId: string) {
    try {
      const { data } = await api.delete(`/size/delete-size/${sizeId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },
};
