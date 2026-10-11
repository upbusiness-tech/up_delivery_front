import { useState } from "react";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";
import { RestaurantService } from "../../../api/services/restaurant.service";
import type { Order } from "../../../types/Order.type";

interface props { orders?: Order[] }

export default function UseHeaderOrdersController({ orders }: props) {
  const [modalPendingOrders, setModalPendingOrders] = useState(false);
  const handleOpenModalPendingOrders = () => setModalPendingOrders(true);
  const handleCloseModalPendingOrders = () => setModalPendingOrders(false);

  const { data: restaurantIsOpen } = useRestaurantData(RestaurantService.restaurantIsopen, QueryCacheName.RESTAURANT_ISOPEN);
  const { data: restaurantInfos } = useRestaurantData(RestaurantService.getMe, QueryCacheName.RESTAURANT);

  const pendingOrders = orders?.filter(order => !order.printed);

  const menuUrl = `${import.meta.env.VITE_MENU_BASE_URL}/${restaurantInfos?.slug}`;
  const handleCopyMenuLink = () => navigator.clipboard.writeText(menuUrl);

  return {
    handleCloseModalPendingOrders,
    handleOpenModalPendingOrders,
    modalPendingOrders,
    restaurantIsOpen,
    restaurantInfos,
    pendingOrders,
    menuUrl,
    handleCopyMenuLink
  }
}