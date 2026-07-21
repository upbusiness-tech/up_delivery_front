import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { RestaurantService } from "../../api/services/restaurant.service";
import type { Order } from "../../types/Order.type";
import { createSocket } from "../../api/services/socket";
import { useNotificationSound } from "../../hooks/useNotificationSound";
import { useRestaurant } from "../../context/RestaurantContext";

export default function UseOrdersController(){
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [filter, setFilter] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>("Todos os tipos");
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
  const { play: playNotificationSound } = useNotificationSound();

  //Contexts
  const { restaurant, orders, isLoading, setOrders, fetchOrders } = useRestaurant()

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
    
  //Effect para rederizar os pedidos e capturar novo pedido
  useEffect(() => {
    if(!restaurant) return
      (async () => {
        await fetchOrders();
      })();
      const socket = createSocket(restaurant?.id);
      socket.on('newOrder', (newOrder) => {
        setOrders((prev) => [newOrder, ...prev]);
        setOrderToPrint(newOrder)
        playNotificationSound();
      });
    return () => {
      socket.disconnect();
    };
  }, [restaurant?.id]);//roda de novo quando restaurant for carregado

  useEffect(() => {
    if (orderToPrint) {
      const timeout = setTimeout(() => {
        window.print();
        setOrderToPrint(null); // limpa depois de imprimir
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [orderToPrint]);


  function openOrderDetail(order: Order) {
    setSelectedOrder(order);
  }

  function closeOrderDetail() {
    setSelectedOrder(null);
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
    orderToPrint
  }
}