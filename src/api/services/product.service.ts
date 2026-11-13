import axios from "axios";
import { api } from "../axios"
import type { ProductDTO, Product, ProductCategory, ProducSizeDTO, AdditionalDTO, UpdateAdditionalDTO, UpdateProductDetailsDTO } from "../../types/Product.type";
import { deleteProductImage, uploadProductImage } from "../../lib/firebaseStorage";

export const ProductService = {

  async createProduct(body: ProductDTO, productImage?: File) {
    let uploadedImage: string | undefined;

    try {
      if (productImage) {
        uploadedImage = await uploadProductImage(productImage);
        body.image = uploadedImage;
      }

      const { data } = await api.post<Product>("/product/create-product", body);
      return data;
    } catch (error) {
      // Falha ao criar o produto: não deixa a imagem enviada como órfã.
      if (uploadedImage) {
        void deleteProductImage(uploadedImage);
      }

      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },


  async createCategory(body: { categoryName: string }){
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

  async deleteProduct(productId: string, image?: string){
    try {
      const { data } = await api.delete(`/product/delete-product/${productId}`);

      // A imagem sai do Storage só depois que o produto foi removido do banco.
      if (image) {
        void deleteProductImage(image);
      }

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
      const { data } = await api.post(`/additional/create-additional`, body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async updateAdditional(additionalId: string, body: UpdateAdditionalDTO) {
    try {
      const { data } = await api.patch(`/additional/update-additional/${additionalId}`, body);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async deleteAdditional(additionalId: string) {
    try {
      const { data } = await api.delete(`/additional/delete-additional/${additionalId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      }
      throw error;
    }
  },

  async updateProduct(
    productId: string,
    body: UpdateProductDetailsDTO,
    imageFile?: File,
    previousImage?: string,
  ){
    let uploadedImage: string | undefined;

    try {
      if (imageFile) {
        uploadedImage = await uploadProductImage(imageFile);
        body.image = uploadedImage;
      }

      const { data } = await api.patch(`/product/update-product/${productId}`, body)

      // Troca concluída: a imagem antiga deixa de ser referenciada.
      if (uploadedImage && previousImage && previousImage !== uploadedImage) {
        void deleteProductImage(previousImage);
      }

      return data as Product
    } catch (error) {
      // Falha no PATCH: não deixa a imagem recém-enviada como órfã.
      if (uploadedImage) {
        void deleteProductImage(uploadedImage);
      }

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

  async updateFeaturedProduct(productId: string) {
    try {
      const { data } = await api.patch(`/product/toggle-featured-product/${productId}/featured`);
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


