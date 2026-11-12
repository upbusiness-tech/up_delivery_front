import { useState } from "react";
import type { Order } from "../../../types/Order.type";
import {
  useRestaurantMe,
  useRestaurantOpenToggle,
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
  const [toggleOpenDialog, setToggleOpenDialog] = useState(false);
  const handleOpenModalPendingOrders = () => setModalPendingOrders(true);
  const handleCloseModalPendingOrders = () => setModalPendingOrders(false);

  const {
    isOpen: restaurantIsOpen,
    isLoading: isLoadingRestaurant,
    isToggling: isTogglingRestaurant,
    error: toggleRestaurantError,
    toggle: toggleRestaurant,
  } = useRestaurantOpenToggle();
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

  function handleOpenToggleOpenDialog() {
    setToggleOpenDialog(true);
  }

  function handleCloseToggleOpenDialog() {
    if (isTogglingRestaurant) return;
    setToggleOpenDialog(false);
  }

  async function handleConfirmToggleOpen() {
    try {
      await toggleRestaurant();
      setToggleOpenDialog(false);
    } catch {
      return;
    }
  }

  return {
    handleCloseModalPendingOrders,
    handleOpenModalPendingOrders,
    handleReceiveOrder,
    handleCloseToggleOpenDialog,
    handleConfirmToggleOpen,
    handleOpenToggleOpenDialog,
    isLoadingRestaurant,
    isTogglingRestaurant,
    isUpdatingReceived: updateReceivedMutation.isPending,
    modalPendingOrders,
    nextRestaurantIsOpen: !restaurantIsOpen,
    restaurantIsOpen,
    restaurantInfos,
    pendingOrders,
    toggleOpenDialog,
    toggleRestaurantError,
  }
}
