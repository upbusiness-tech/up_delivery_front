interface SizeOrderItem {
  name: string,
  limitFlavors: number
}

interface ProductOrderItem {
  id: string;
  productName: string;
  productCategoryName: string;
}

export interface Flavors{
  id: string
  price: string;
  product: ProductOrderItem;
  size: SizeOrderItem;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  flavors: Flavors[];
}

export interface Address {
  city: string;
  number: number;
  streetName: string;
}

export interface Neighborhood {
  id: string;
  neighborhoodName: string;
  deliveryFee: number
}

export interface Order {
  id: string;
  type: string;
  code: string;
  printed: boolean;
  items: OrderItem[];
  orderTotal: number,
  paymentMethod: string,
  changeFor: number,
  isPaid: boolean,
  status: string,
  discount: number,
  observation: string,
  costumerName: string,
  costumerPhone: number,
  costumerAddress: Address,
  neighborhood: Neighborhood
}