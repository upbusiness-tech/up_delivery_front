import axios from "axios";
import { api } from "../axios"
import type { ProductDTO, Product, ProductCategory, ProducSizeDTO, AdditionalDTO } from "../../types/Product.type";

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

  async createCategory(body: any){
    try {
      const { data } = await api.post<ProductCategory>("/product_category/create-category", body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async deleteProduct(productId: string){
    try {
      const { data } = await api.delete(`/product/delete-product/${productId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
  
  async addProductSize(productId: string, body: ProducSizeDTO){
    try {
      const { data } = await api.post(`/product/add-product-size/${productId}`, body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async createAdditional(body: AdditionalDTO){
    try {
      const { data } = await api.post(`additional/create-additional`, body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  }
}


