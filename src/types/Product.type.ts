import type { Neighborhood, Restaurant } from "./Restaurant.type";

export interface ProductRestaurant {
  id: string;
  restaurantName: string;
}
export interface ProductCategory {
  id: string;
  categoryName: string;
}
export interface Additionals {
  id: string;
  additionalName: string;
  additionalPrice: number;
  category: ProductCategory
}

export interface Product {
  id: string;
  productName: string;
  productDescription: string;
  productActive: boolean;
  productCategory: ProductCategory;
  sizes: ProducSize[];
  restaurant: ProductRestaurant;
  created_at: Date;
}

export interface ProducSize {
  id: string; 
  price: number;
  size: Size
}

export interface ProducSizeDTO {
  price: number;
  size: string
}

export interface Size {
  id: string;
  name: string;
  limitFlavors: number;
}

export interface MenuData {
  restaurant: Restaurant | undefined;
  products: Product[];
  categories: ProductCategory[];
  additionals: Additionals[];
  neighborhoods: Neighborhood[];
}

export interface ProductBag {
  id: string;
  productName: string;
  productCategory: ProductCategory;
  price: number,
  quantity: number,
  flavors: string[];
}

export interface ProductDTO {
	productName: string,
	productCategory: string,
	sizes: ProducSizeDTO[]
}




