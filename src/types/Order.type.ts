import type { Additionals } from "./Product.type";
import type { Neighborhood } from "./Restaurant.type";

export interface Address {
  city: string;
  number: number;
  streetName: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  additionals: Additionals[];
  flavors: string[];
}

export interface Order {
  id: string;
  type: string;
  code: string;
  printed: boolean;
  items: OrderItem[];
  orderTotal: number;
  paymentMethod: string;
  changeFor: number;
  isPaid: boolean;
  status: string;
  discount: number;
  observation: string;
  costumerName: string;
  costumerPhone: string;
  costumerAddress: Address;
  neighborhood: Neighborhood;
  restaurant: { id: string };
}

export interface CreateOrder {
  type: string;
  paymentMethod: string;
  changeFor: number;
  items: CreateOrderItem[];
  observation: string;
  costumerName: string;
  costumerPhone: string;
  address?: Address;
  neighborhoodId?: string;
}

//Tranforma um OrderItemBag em um OrderItem para a requisição sem o id
export interface CreateOrderItem {
  name: string;
  quantity: number;
  flavors: string[];
  additionals?: string[];
}

//Usar o CreateOrderItem para tranformar isso em um OrderItem
export interface OrderItemBag {
  id: string;
  name: string;
  quantity: number;
  price: number;
  flavors: string[],
  observation: string,
  additionals?: Additionals[]
}

export type OrderMode =  "delivery" | "pickup";