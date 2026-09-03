import type { Order } from "../../types/Order.type";
import { moneyMask, paymentMethodMask } from "../masks/mask";

const formatCurrency = (v: number) => `R$${v.toFixed(2).replace(".", ",")}`;

export const buildOrderMessage = (order: Order, avgTime = 20) => {
  const items = order.items.map((i) => `${i.quantity}x ${i.name}`).join("\n");
  const troco = order.paymentMethod === "Dinheiro" ? `\nTroco: ${formatCurrency(order.changeFor)}` : "";
  const deliveryInfo = order.type === "pickup" ? "📦Retirada no local" : "🛵Entrega";
  return `Olá, *${order.costumerName}!*👋\nRecebemos seu pedido😁\n------------------------------------\n*Itens*\n${items}\n------------------------------------\n*Total: ${moneyMask(order.orderTotal)}*\n*Pagamento: ${paymentMethodMask(order.paymentMethod)}*${troco}\n------------------------------------\n${deliveryInfo}\n⏱️Tempo médio: ${avgTime}min\n------------------------------------\nPedido gerado via UpDelivery`;
};

export const sendWhatsAppMessage = (order: Order, message: string) => {
  const phone = order.costumerPhone.replace(/\D/g, "");
  window.location.href = `whatsapp://send?phone=55${phone}&text=${encodeURIComponent(message)}`;
};