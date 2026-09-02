import { useEffect, useState } from "react";
import { RestaurantService } from "../../../api/services/restaurant.service";
import type { Restaurant } from "../../../types/Restaurant.type";
import { OrderService } from "../../../api/services/order.service";
import type { Order } from "../../../types/Order.type";
import { STATUS } from "../../../utils/texts/status.enum";
import { useRestaurant } from "../../../context/RestaurantContext";
import { buildOrderMessage, sendWhatsAppMessage } from "../../../utils/whatsapp/orderMessage";

interface props {
  restaurant: Restaurant | undefined
}

export default function UseHeaderOrdersController({restaurant}: props){
  const { orders, setOrders } = useRestaurant();
  const [restaurantOpen, setRestaurantOpen] = useState<boolean>()
  const [modalStatusRestaurant, setModalStatusRestaurant] = useState(false);
  const [modalPendingOrders, setModalPendingOrders] = useState(false);
  const handleOpenModalStatusRestaurant = () => setModalStatusRestaurant(true)
  const handleCloseModalStatusRestaurant = () => setModalStatusRestaurant(false)

  const handleOpenModalPendingOrders = () => {setModalPendingOrders(true); };
  const handleCloseModalPendingOrders = () => {setModalPendingOrders(false);};

  const pendingOrders = (orders ?? []).filter((o) => o.status !== STATUS.CANCELADO && !o.printed);

  useEffect(() => {
    restaurantIsOpen()
  }, [restaurant?.id])

  async function restaurantIsOpen(){
    if(!restaurant) return;
    const restaurantIsOpen = await RestaurantService.restaurantOpen(restaurant.id)
    if(!restaurantIsOpen?.data){
      setRestaurantOpen(false)
      return
    }
    setRestaurantOpen(true)
  }

  async function handleReceiveOrder(order: Order){
    try {
      await OrderService.updatePrinted(order.id);
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, printed: true } : o)));
      sendWhatsAppMessage(order, buildOrderMessage(order));
    } catch {
      return;
    }
  }

  return {
    restaurantOpen,
    modalStatusRestaurant,
    handleCloseModalStatusRestaurant,
    handleOpenModalStatusRestaurant,
    handleCloseModalPendingOrders,
    handleOpenModalPendingOrders,
    modalPendingOrders,
    pendingOrders,
    handleReceiveOrder
  }
}