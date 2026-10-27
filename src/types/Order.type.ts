import type { Additionals } from "./Product.type";
import type { Neighborhood } from "./Restaurant.type";

export interface Address {
  city: string;
  number: number;
  streetName: string;
  complement: string;
}



export interface Order {
  id: string;
  type: string;
  code: string;
  printed: boolean;
  received: boolean;
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
  created_at?: string;
}

export interface OrderFlavor {
  id: string;
  price: number;
  // O evento de socket `newOrder` pode vir sem essas relações carregadas.
  product?: {
    id: string;
    productName: string;
  };
  size?: {
    id: string;
    name: string;
    limitFlavors: number;
    price: number;
    created_at: string;
  };
  created_at: string;
}

export interface CreateOrder {
  type: string;
  paymentMethod: string;
  changeFor: number;
  items: CreateOrderItem[];
  observation?: string;
  costumerName: string;
  costumerPhone: string;
  address?: Address;
  neighborhoodId?: string;

}

//Transformação para enviar à API
export interface CreateOrderItem {
  name: string;
  observation?: string;
  quantity: number;
  flavors: string[];
  additionals?: string[];
}

// Produto completo no carrinho
export interface OrderItemBag {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  flavors: string[],
  /** Nomes dos sabores escolhidos — usado só para exibição no carrinho. */
  flavorNames?: string[],
  minQuantity?: number;
  observation: string,
  additionals?: Additionals[],
  /** Categoria/tamanho usados para reabrir a edição de itens compostos (pizzas). */
  categoryId?: string;
  sizeId?: string;
}

// Estrutura do produto no pedido
export interface OrderItem {
  name: string;
  observation?: string;
  quantity: number;
  price: number;
  additionals: Additionals[];
  flavors: OrderFlavor[];
}


export type OrderMode =  "delivery" | "pickup";