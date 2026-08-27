import axios from "axios";
import { api } from "../axios"
import type { ProductDTO, Product, ProductCategory, ProducSizeDTO, AdditionalDTO } from "../../types/Product.type";
import { uploadToCloudinary } from "../../lib/claudinary";

export const ProductService = {

  async createProduct(body: ProductDTO, productImage?: File) {
    try {
      if (productImage) {
        const imageUrl = await uploadToCloudinary(productImage);
        body.image = imageUrl;
      }

      const { data } = await api.post<Product>("/product/create-product", body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  },

  async updateProduct(productId: string, body: any){
    try {
      const { data } = await api.patch(`product/${productId}`, body)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async updateActiveProduct(productId: string) {
    try {
    const { data } = await api.patch(`/product/toggle-active-product/${productId}/active`);
    console.log(data)
    return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async updateProductSize(productSizeid: string, body: any){
    try{
      const { data } = await api.patch(`product_size/${productSizeid}`, body)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  }, 

  async deleteProductSize(productId: string, productSizeid: string){
    try{
      const { data } = await api.delete(`product/delete-size-product/${productId}/${productSizeid}`)
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  }
}


