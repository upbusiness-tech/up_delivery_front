export type Step = "menu" | "cart" | "info" | "address" | "review" | "payment" | "done";

export const CATEGORIES = ["Promoções", "Pizzas", "Lanches", "Bebidas", "Sobremesas"];

export const NEIGHBORHOODS = [
  { name: "Centro", fee: 5.0 },
  { name: "Jardim das Flores", fee: 8.0 },
  { name: "Vila Nova", fee: 10.0 },
  { name: "Parque Industrial", fee: 12.5 },
  { name: "Alto da Serra", fee: 15.0 },
];

export const STEPS: { key: Step; label: string }[] = [
  { key: "menu", label: "Cardápio" },
  { key: "cart", label: "Sacola" },
  { key: "info", label: "Seus dados" },
  { key: "address", label: "Endereço" },
  { key: "review", label: "Confirmar" },
  { key: "payment", label: "Pagamento" },
];

export const titles: Record<Step, string> = {
  menu: "Cardápio",
  cart: "Sacola",
  info: "Seus dados",
  address: "Endereço",
  review: "Confirmar pedido",
  payment: "Pagamento",
  done: "Pedido confirmado",
};

export interface Addon {
  id: string;
  name: string;
  price: number;
}
 
export interface Size {
  id: string;
  label: string;
  price: number;
}


export interface CartItem {
  uid: string;
  menuId: string;
  name: string;
  image: string;
  size: Size;
  addons: Addon[];
  qty: number;
  notes: string;
  unit: number;
}



