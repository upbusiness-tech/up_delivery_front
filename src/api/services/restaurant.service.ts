import { type CreateOrder } from './../../types/Order.type';
import axios from "axios";
import { api } from "../axios"
import type { Product, ProductCategory } from "../../types/Product.type";

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

  async createOrder(restaurantId: string, order: CreateOrder){
    try{
      const {data} = await api.post(`/order/create-order/${restaurantId}`, order)
      return data
    }catch(error){
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
  },

  async restaurantCategories(restaurantId: string) {
    try {
      const { data } = await api.get<ProductCategory[]>(`/product_category`, {
        params: {
          join: 'restaurant',
          filter: `restaurant.id||$eq||${restaurantId}`,
        },
      });
      // console.log("Categorias: ", data)
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantProducts() {
    try {
      const { data } = await api.get<Product[]>(`/product/products-restaurant`);
      // console.log("produtos: ", data)
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
}