import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Order } from "../../types/Order.type";
import { OrderService } from "../../api/services/order.service";
import { QueryCacheName, useRestaurantData } from "../../hooks/useRestaurantData";

export default function UseOrdersController(){

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  //Busca pedidos
  const { data: orders = [], isLoading } = useRestaurantData(OrderService.listOrders, QueryCacheName.ORDERS)

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId) ?? null;
  function openOrderDetail(order: Order) {  setSelectedOrderId(order.id)  }
  function closeOrderDetail() { setSelectedOrderId(null)  }

  function deliveryFee(order: Order){
    return order.type === "delivery"
    ? Number(order.neighborhood?.deliveryFee ?? 0)
    : 0;
  }

  return{
    isDesktop,
    orders,
    isLoading,
    selectedOrder,
    openOrderDetail,
    closeOrderDetail,
    deliveryFee,
  }
}