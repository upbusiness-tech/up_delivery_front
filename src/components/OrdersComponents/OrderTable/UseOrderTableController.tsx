import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import type { Order } from "../../../types/Order.type";
import { STATUS } from "../../../utils/texts/status.enum";
import { OrderService } from "../../../api/services/order.service";

interface UseOrderTableControllerProps {
  updateStatusOrder: (status: string, orderId: string) => Promise<void>;
}

export function useOrderTableController({ updateStatusOrder }: UseOrderTableControllerProps) {
  const [printedOrders, setPrintedOrders] = useState<string[]>([]);

  const sendWhatsAppMessage = (order: Order, message: string) => {
    const phone = order.costumerPhone.replace(/\D/g, "");
    window.location.href = `whatsapp://send?phone=55${phone}&text=${encodeURIComponent(message)}`;
  };

  const isReceived = (order: Order) => order.printed || printedOrders.includes(order.id);

  const handleReceived = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (isReceived(order)) return;
    try {
      await OrderService.updatePrinted(order.id);
      setPrintedOrders((prev) => [...prev, order.id]);
      sendWhatsAppMessage(order, `Olá, ${order.costumerName}! 👋\n\nRecebemos seu pedido #${order.code} e já vamos começar o preparo.\n\nObrigado pela preferência! ❤️`);
    } catch {
      return;
    }
  };

  const handleStatusChange = async (e: SelectChangeEvent<string>, order: Order) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === order.status) return;

    await updateStatusOrder(newStatus, order.id);

    if (newStatus === STATUS.EM_ROTA) {
      sendWhatsAppMessage(order, `Olá, ${order.costumerName}! 🚀\n\nSeu pedido #${order.code} saiu para entrega e está a caminho.\n\nEm breve ele chegará até você. Obrigado pela preferência!`);
    }

    if (newStatus === STATUS.PRONTO_RETIRADA) {
      sendWhatsAppMessage(order, `Olá, ${order.costumerName}! 🛍️\n\nSeu pedido #${order.code} está pronto para retirada.\n\nJá pode passar para buscar. Estamos te esperando!`);
    }
  };

  return { isReceived, handleReceived, handleStatusChange };
}