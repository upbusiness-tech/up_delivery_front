import type { SelectChangeEvent } from "@mui/material";
import type { Order } from "../../../types/Order.type";
import { STATUS } from "../../../utils/texts/status.enum";
import { OrderService } from "../../../api/services/order.service";
import { useRestaurant } from "../../../context/RestaurantContext";
import { buildOrderMessage, sendWhatsAppMessage } from "../../../utils/whatsapp/orderMessage";

interface UseOrderTableControllerProps {
  updateStatusOrder: (status: string, orderId: string) => Promise<void>;
}

export function useOrderTableController({ updateStatusOrder }: UseOrderTableControllerProps) {
  const { setOrders, restaurant } = useRestaurant();

  const isReceived = (order: Order) => order.printed;

  const handleReceived = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (isReceived(order)) return;
    try {
      await OrderService.updatePrinted(order.id);
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, printed: true } : o)));
      sendWhatsAppMessage(order, buildOrderMessage(order));
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
      sendWhatsAppMessage(order, `Seu pedido saiu para entrega e está a caminho.\nEm breve ele chegará até você. Obrigado pela preferência!`);
    }

    if (newStatus === STATUS.PRONTO_RETIRADA) {
      sendWhatsAppMessage(order, `📦Seu pedido está pronto para retirada.\nJá pode passar para buscar. Estamos te esperando!😁\n📍${restaurant?.restaurantAddress}`);
    }
  };

  return { isReceived, handleReceived, handleStatusChange };
}