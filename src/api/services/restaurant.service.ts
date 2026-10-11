import { type CreateOrder } from './../../types/Order.type';
import axios from "axios";
import { api } from "../axios"
import type { Additionals, Product, ProductCategory, Size } from "../../types/Product.type";
import type { Neighborhood, Restaurant } from '../../types/Restaurant.type';

export const RestaurantService = {
  
  async getMe() {
    try {
      const { data } = await api.get<Restaurant>("/restaurant/me");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantProducts() {
    const { data } = await api.get<Product[]>(`/product/products-restaurant`);
    return data;
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
 
  async restaurantIsopen(){
    try{
      const { data } = await api.get<boolean>(`/restaurant/restaurant-isopen`);
      return data
    }catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantCategories() {
    try {
      const { data } = await api.get<ProductCategory[]>(`/product_category/categories-restaurant`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },


  async restaurantAdditionals() {
    try {
      const { data } = await api.get<Additionals[]>(`/additional/additionals-restaurant`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantNeighborhoods() {
    try {
      const { data } = await api.get<Neighborhood[]>(`/neighborhood/neighborhoods-restaurant`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantSizes(){
    try {
      const { data } = await api.get<Size[]>(`/size/sizes-restaurant`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantConnectMp(){
    try{
      const response = await api.get(`payment/oauth/connect`)
      return response;
    }catch(error){
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },
  
  
  //--------------------------------------------------------ROTAS SLUGS

  
  async getPublicRestaurant(slug: string) {
    try {
      const { data } = await api.get(`/restaurant/public/${slug}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantProductsPublic(restaurantId: string) {
    try {
      const { data } = await api.get<Product[]>(`/product/public/${restaurantId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantCategoriesPublic(restaurantId: string) {
    try {
      const { data } = await api.get<ProductCategory[]>(`/product_category/public/${restaurantId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantAdditionalsPublic(restaurantId: string) {
    try {
      const { data } = await api.get<Additionals[]>(`/additional/public/${restaurantId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  },

  async restaurantNeighborhoodsPublic(restaurantId: string) {
    try {
      const { data } = await api.get<Neighborhood[]>(`/neighborhood/public/${restaurantId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
    }
  }
}