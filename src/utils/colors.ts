import type { OrderStatus } from "../types/Order.type";

export const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  pendente: { bg: "#FFF4E5", color: "#B76E00" },
  confirmado: { bg: "#E5F0FF", color: "#0B5CD7" },
  em_preparo: { bg: "#EDE7FF", color: "#6B3FD6" },
  saiu_para_entrega: { bg: "#E3F7FF", color: "#0B84A5" },
  entregue: { bg: "#E6F7EC", color: "#1F9254" },
  cancelado: { bg: "#FDE8E8", color: "#C0362C" },
};