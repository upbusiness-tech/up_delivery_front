import axios from "axios";
import { api } from "../axios"
import type { ProductDTO, Product } from "../../types/Product.type";

export const ProductService = {

  async createProduct(body: ProductDTO) {
      try {
        const { data } = await api.post<Product>("/product/create-product", body);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message);
        }
      }
    },

}