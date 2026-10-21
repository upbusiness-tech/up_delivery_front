import type { Order, OrderItem } from "../../types/Order.type";
import type { ProducSize, Product } from "../../types/Product.type";
import { moneyMask, paymentMethodMask } from "../masks/mask";

const fixOrderDate = (d: Date | string) => new Date(new Date(d).getTime() - 3 * 60 * 60 * 1000);

export const getItemFlavorLines = (item: OrderItem, products?: Product[]): string[] => {
  const nameOf = (f: string | ProducSize) => { const id = typeof f === "string" ? f : f.id; return products?.find((p) => p.sizes.some((ps) => ps.id === id))?.productName ?? ""; };
  const names = item.flavors.map(nameOf);
  if (names.length === 1 && names[0].trim().toLowerCase() === item.name.trim().toLowerCase()) return [];
  return names.map((n) => (names.length === 1 ? n : `1/${names.length} ${n}`));
};


export const buildOrderMessage = (order: Order, avgTime = 40, products?: Product[]) => {
  const sep = "------------------------------------";
  const items = order.items.map((i) => [`${i.quantity}x ${i.name}`, ...getItemFlavorLines(i, products).map((l) => `   • ${l}`), ...(i.additionals?.length ? [`   + ${i.additionals.map((a) => a.additionalName).join(", ")}`] : []), ...(i.observation ? [`   *${i.observation}*`] : [])].join("\n")).join("\n");
  const isDelivery = order.type === "delivery";
  const addr = order.costumerAddress;
  const fee = Number(order.neighborhood?.deliveryFee ?? 0);
  const total = Number(order.orderTotal) + fee;
  const date = fixOrderDate(order.created_at).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" });
  const address = isDelivery && addr?.streetName ? [`📍 ${addr.streetName}, ${addr.number}`, order.neighborhood?.neighborhoodName && `Bairro: ${order.neighborhood.neighborhoodName}`, addr.complement && `Complemento: ${addr.complement}`].filter(Boolean).join("\n") : "";
  const payment = [`*Pagamento: ${paymentMethodMask(order.paymentMethod)}*`, Number(order.changeFor) > 0 && `Troco para: ${moneyMask(Number(order.changeFor))}`, isDelivery && fee > 0 && `Taxa de entrega: ${moneyMask(fee)}`, `*Total: ${moneyMask(total)}*`].filter(Boolean).join("\n");
  return [
    `Olá, *${order.costumerName}!* 👋`,
    `Recebemos seu pedido 😁`,
    date,
    sep,
    `*Itens*\n${items}`,
    sep,
    payment,
    sep,
    [isDelivery ? "🛵 Entrega" : "📦 Retirada no local", address, `⏱️ Tempo médio: ${avgTime}min`].filter(Boolean).join("\n"),
    sep,
    `Pedido gerado via UpDelivery`,
  ].join("\n");
};

export const sendWhatsAppMessage = (order: Order, message: string) => {
  console.log('Chegou aq 3')
  const phone = order.costumerPhone.replace(/\D/g, "");
  window.location.href = `whatsapp://send?phone=55${phone}&text=${encodeURIComponent(message)}`;

};