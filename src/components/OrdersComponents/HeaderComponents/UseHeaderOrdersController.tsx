import { useState } from "react";
import type { Order } from "../../../types/Order.type";
import {
  useRestaurantIsOpen,
  useRestaurantMe,
} from "../../../hooks/queries/useRestaurantQueries";
import { useUpdateOrderReceived } from "../../../hooks/queries/useOrdersQueries";
import { STATUS } from "../../../utils/texts/status.enum";
import {
  buildOrderMessage,
  sendWhatsAppMessage,
} from "../../../utils/whatsapp/orderMessage";

interface props { orders?: Order[] }

export default function UseHeaderOrdersController({ orders }: props) {
  const [modalPendingOrders, setModalPendingOrders] = useState(false);
  const handleOpenModalPendingOrders = () => setModalPendingOrders(true);
  const handleCloseModalPendingOrders = () => setModalPendingOrders(false);

  const { data: restaurantIsOpen } = useRestaurantIsOpen();
  const { data: restaurantInfos } = useRestaurantMe();
  const updateReceivedMutation = useUpdateOrderReceived();

  const pendingOrders = orders?.filter(
    (order) => order.status !== STATUS.CANCELADO && !order.received,
  );

  async function handleReceiveOrder(order: Order) {
    if (order.received) return;

    try {
      await updateReceivedMutation.mutateAsync(order.id);
      sendWhatsAppMessage(order, buildOrderMessage(order));
    } catch {
      return;
    }
  }

  return {
    handleCloseModalPendingOrders,
    handleOpenModalPendingOrders,
    handleReceiveOrder,
    isUpdatingReceived: updateReceivedMutation.isPending,
    modalPendingOrders,
    restaurantIsOpen,
    restaurantInfos,
    pendingOrders,
  }
}
