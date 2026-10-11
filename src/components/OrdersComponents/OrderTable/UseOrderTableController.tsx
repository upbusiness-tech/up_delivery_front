import type { SelectChangeEvent } from "@mui/material";
import type { Order } from "../../../types/Order.type";
import { STATUS } from "../../../utils/texts/status.enum";
import { OrderService } from "../../../api/services/order.service";
import { buildOrderMessage, sendWhatsAppMessage } from "../../../utils/whatsapp/orderMessage";
import { QueryCacheName } from "../../../hooks/useRestaurantData";
import type { Restaurant } from "../../../types/Restaurant.type";
import { useQueryClient } from "@tanstack/react-query";

export function useOrderTableController() {
  
  const queryClient = useQueryClient();

  const updateOrderCache = (
    orderId: string,
    changes: Partial<Order>
  ) => {
    queryClient.setQueryData<Order[]>(
      [QueryCacheName.ORDERS],
      (oldOrders) =>
        oldOrders?.map((order) =>
          order.id === orderId
            ? { ...order, ...changes }
            : order
        )
    );
  };

  const updateStatusOrder = async (status: string, orderId: string) => {
    await OrderService.updateStatusOrder(status, orderId)
  }   

  const isReceived = (order: Order) => order.printed;

  const handleReceived = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (isReceived(order)) return;
    try {
      await OrderService.updatePrinted(order.id);
      updateOrderCache(order.id, { printed: true });
      sendWhatsAppMessage(order, buildOrderMessage(order));
    } catch {
      return;
    }
  };

  const handleStatusChange = async (e: SelectChangeEvent<string>, order: Order) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === order.status) return;
    try {
      await updateStatusOrder(newStatus, order.id)
      updateOrderCache(order.id, { status: newStatus });
    } catch {
      return;
    }

    if (newStatus === STATUS.EM_ROTA) {
      sendWhatsAppMessage(order, `Seu pedido saiu para entrega e está a caminho.\nEm breve ele chegará até você. Obrigado pela preferência!`);
    }

    if (newStatus === STATUS.PRONTO_RETIRADA) {
      const restaurant = queryClient.getQueryData<Restaurant>([QueryCacheName.RESTAURANT]);
      sendWhatsAppMessage(order, `📦Seu pedido está pronto para retirada.\nJá pode passar para buscar. Estamos te esperando!😁\n📍${restaurant?.restaurantAddress}`);
    }
  };

  return { isReceived, handleReceived, handleStatusChange };
}