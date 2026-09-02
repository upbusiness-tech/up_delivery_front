import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { RestaurantService } from "../../api/services/restaurant.service";
import type { Order } from "../../types/Order.type";
// import { createSocket } from "../../api/services/socket";
// import { useNotificationSound } from "../../hooks/useNotificationSound";
import { useRestaurant } from "../../context/RestaurantContext";
import { OrderService } from "../../api/services/order.service";
// import { useRef } from "react";


export default function UseOrdersController(){

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [filter, setFilter] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>("Todos os tipos");
  const [query, setQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
  // const { play: playNotificationSound } = useNotificationSound();

  // const socketRef = useRef<any>(null);
  
  //Contexts
  const { restaurant, orders, isLoading, setOrders, fetchOrders, orderToPrint, dequeuePrint } = useRestaurant()

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId) ?? null;

  function openOrderDetail(order: Order) {
    setSelectedOrderId(order.id);
  }

  function closeOrderDetail() {
    setSelectedOrderId(null);
  }


  const restaurantIsOpen = async (restaurantId: string) => {
    const restaurantIsOpen = await RestaurantService.restaurantIsopen(restaurantId);
    if(restaurantIsOpen){
      console.log("ABERTO")
    }else{
      console.log("FECHADO")
    }
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!restaurant?.id) return;

    RestaurantService.restaurantOpen(restaurant.id).then((response) => {
      if (!response?.data) {
        setOrders([]);
      }
    });
  }, [restaurant?.id]);
    
  // Effect para rederizar os pedidos e capturar novo pedido
  useEffect(() => {
    if (!restaurant) return;
    fetchOrders();
  }, [restaurant?.id]);

  useEffect(() => {
    if (orderToPrint) {
      const timeout = setTimeout(() => {
        window.print();
        dequeuePrint();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [orderToPrint]);




  async function updateStatusOrder(status: string, orderId: string){
    const updateOrder = await OrderService.updateStatusOrder(status, orderId)
    
    setOrders((prev) =>
      (prev ?? []).map((order) =>
        order.id === updateOrder.id ? updateOrder : order
      )
    );
  }

  function deliveryFee(order: Order){
    return order.type === "delivery"
    ? Number(order.neighborhood?.deliveryFee ?? 0)
    : 0;
  }

  return{
    restaurantIsOpen,
    isDesktop,
    filter,
    setFilter,
    type,
    setType,
    query,
    setQuery,
    orders,
    loading,
    selectedOrder,
    openOrderDetail,
    closeOrderDetail,
    orderToPrint,
    updateStatusOrder,
    deliveryFee,
    restaurant
  }
}