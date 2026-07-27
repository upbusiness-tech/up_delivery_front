export interface Address {
  city: string;
  number: number;
  streetName: string;
}

export interface Neighborhood {
  id: string;
  neighborhoodName: string;
  deliveryFee: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
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
  neighborhood: Neighborhood
}

export interface CreateOrder {
  type: string;
  paymentMethod: string;
  changeFor: number;
  items: CreateOrderItem[];
  observation: string;
  costumerName: string;
  costumerPhone: string;
  address: Address;
  neighborhoodId: string;
}

//Tranforma um OrderItemBag em um OrderItem para a requisição sem o id
export interface CreateOrderItem {
  name: string;
  quantity: number;
  flavors: string[]
}

//Usar o CreateOrderItem para tranformar isso em um OrderItem
export interface OrderItemBag {
  id: string;
  name: string;
  quantity: number;
  price: number;
  flavors: string[]
}

// id: uuid-12312
// name: Coca-Cola 1L
// quantity: 1
// price: 10
// flavors: [uuid-90324]

// id: uuid-12312
// name: Pizza P 2 Sabores
// quantity: 1
// price: 30
// flavors: [uuid-90324, uuid-90324]

// -------------------------------------------------

// name: Coca-Cola 1L
// quantity: 1
// flavors: [uuid-90324]

// name: Pizza P 2 Sabores
// quantity: 1
// flavors: [uuid-90324, uuid-90324]
