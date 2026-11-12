import type { Neighborhood, Restaurant } from "./Restaurant.type";

export interface ProductRestaurant {
  id: string;
  restaurantName: string;
}
export interface ProductCategory {
  id: string;
  categoryName: string;
  sortOrder: number;
}
export interface Additionals {
  id: string;
  additionalName: string;
  additionalPrice: number;
  category: ProductCategory;
  additionalType: 'single' | 'multiple';
}

export interface AdditionalDTO {
  additionalName: string;
  additionalPrice: number;
  additionalType: Additionals["additionalType"];
  categoryId: string;
}

export interface UpdateAdditionalDTO {
  additionalName?: string;
  additionalPrice?: number;
  additionalType?: Additionals["additionalType"];
  categoryId?: string;
}


export interface Product {
  id: string;
  productName: string;
  productDescription: string;
  image: string;
  productActive: boolean;
  isFeatured: boolean;
  productCategory: ProductCategory;
  minQuantity: number;
  sizes: ProducSize[];
  /** Adicionais personalizados. Quando `useCategoryAdditionals` é true, o cardápio usa os da categoria. */
  additionals?: Additionals[];
  useCategoryAdditionals?: boolean;
  /** Não é enviado pelos endpoints atuais; mantido para compatibilidade. */
  restaurant?: ProductRestaurant;
  created_at: Date;
}

export interface ProducSize {
  id: string; 
  price: number;
  product: Product;
  size: Size;
  created_at: Date
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
	productDescription?: string,
	productCategory: string,
	sizes: ProducSizeDTO[],
  image?: string;
}

export interface UpdateProductDetailsDTO {
  productName?: string;
  productDescription?: string;
  image?: string;
  useCategoryAdditionals?: boolean;
  additionalIds?: string[];
}

export interface SizeDTO {
  name: string;
  limitFlavors: number;
}




