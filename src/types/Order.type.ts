export type OrderType = "delivery" | "retirada" | "balcao";

export type OrderStatus =
  | "pendente"
  | "confirmado"
  | "em_preparo"
  | "saiu_para_entrega"
  | "entregue"
  | "cancelado";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  size?: string;
  flavors?: string[];
  addons?: string[];
  notes?: string;
}

export interface Order {
  id: string;
  code: string;
  type: OrderType;
  createdAt: string;
  status: OrderStatus;
  customer: string;
  phone: string;
  address?: string;
  payment: string;
  changeFor?: number;
  courier?: string;
  items: OrderItem[];
  total: number;
}

export const STATUS_FLOW: OrderStatus[] = [
  "pendente",
  "confirmado",
  "em_preparo",
  "saiu_para_entrega",
  "entregue",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_preparo: "Em preparo",
  saiu_para_entrega: "Saiu para entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
};