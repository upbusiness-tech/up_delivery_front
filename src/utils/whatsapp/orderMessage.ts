import type { Order, OrderItem } from "../../types/Order.type";
import type { Product } from "../../types/Product.type";
import { moneyMask, paymentMethodMask } from "../masks/mask";

const fixOrderDate = (d: Date | string | undefined) => {
  if (!d) return new Date();
  return new Date(new Date(d).getTime() - 3 * 60 * 60 * 1000);
};

export const getItemFlavorLines = (item: OrderItem, products?: Product[]): string[] => {
  if (!item.flavors || item.flavors.length === 0) return [];
  const names = item.flavors
    .map((flavor) => {
      if (flavor.product?.productName) return flavor.product.productName;
      const sizeId = flavor.size?.id;
      if (sizeId && products) {
        const found = products.find((p) => p.sizes?.some((ps) => ps.id === sizeId));
        if (found?.productName) return found.productName;
      }
      return "";
    })
    .filter((n) => n.trim());
  if (names.length === 0) return [];
  if (names.length === 1 && names[0].trim().toLowerCase() === item.name.trim().toLowerCase()) return names.map((n) => `1/${names.length} ${n}`);
  return names.map((n) => (names.length === 1 ? n : `1/${names.length} ${n}`));
};

export const buildOrderMessage = (order: Order, avgTime = 40, products?: Product[]) => {
  const sep = "━━━━━━━━━━━━━━━━━━━━";
  const items = order.items
    .map((i) => {
      const lines = [`${i.quantity}x ${i.name}`];
      const flavorLines = getItemFlavorLines(i, products);
      flavorLines.forEach((l) => lines.push(`   • ${l}`));
      if (i.additionals?.length) {
        lines.push(`   + ${i.additionals.map((a) => a.additionalName).join(", ")}`);
      }
      if (i.observation) {
        lines.push(`   *${i.observation}*`);
      }
      return lines.join("\n");
    })
    .join("\n");
  const isDelivery = order.type === "delivery";
  const addr = order.costumerAddress;
  const fee = Number(order.neighborhood?.deliveryFee ?? 0);
  const total = Number(order.orderTotal) + fee;
  const date = fixOrderDate(order.created_at).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" });
  const address = isDelivery && addr?.streetName
    ? [
        `*Rua:* ${addr.streetName}, ${addr.number}`,
        order.neighborhood?.neighborhoodName && `*Bairro:* ${order.neighborhood.neighborhoodName}`,
        addr.complement && `*Complemento:* ${addr.complement}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  const payment = [
    `*Pagamento:* ${paymentMethodMask(order.paymentMethod)}`,
    Number(order.changeFor) > 0 && `*Troco para:* ${moneyMask(Number(order.changeFor))}`,
    isDelivery && fee > 0 && `*Taxa de entrega:* ${moneyMask(fee)}`,
    `*Total:* ${moneyMask(total)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    `Olá, *${order.costumerName}!* 👋`,
    `Recebemos seu pedido 😁`,
    date,
    sep,
    `*Itens*\n${items}`,
    sep,
    payment,
    sep,
    [isDelivery ? "🛵 *Entrega*" : "📦 *Retirada no local*", address, `⏱️ Tempo médio: ${avgTime}min`]
      .filter(Boolean)
      .join("\n"),
    sep,
    `Pedido gerado via UpDelivery`,
    "━━━━━━━━━━━━━━━━━━━━",
    "⭐*DEIXE SUA OPINIÃO!*⭐",
    "Queremos melhorar sua experiência!💛",
    "📝 *Avalie sua experiência aqui:*",
    "https://forms.gle/tZPJg3dVz2dCt5QB9",
  ].join("\n");
};

export const sendWhatsAppMessage = (order: Order, message: string) => {
  const phone = (order.costumerPhone || "").replace(/\D/g, "");
  window.location.href = `whatsapp://send?phone=55${phone}&text=${encodeURIComponent(message)}`;
};

export const openWhatsAppChat = (order: Order) => {
  sendWhatsAppMessage(order, buildOrderMessage(order));
};