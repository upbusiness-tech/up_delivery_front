import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { RestaurantService } from "../../api/services/restaurant.service";
import { OrderService } from "../../api/services/order.service";

export default function UseOrdersController(){
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [filter, setFilter] = useState<string>("Todos");
  const [type, setType] = useState<string>("Todos os tipos");
  const [query, setQuery] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const restaurantIsOpen = async (restaurantId: string) => {
    const restaurantIsOpen = await RestaurantService.restaurantIsopen(restaurantId);
    if(restaurantIsOpen){
      console.log("ABERTO")
    }else{
      console.log("FECHADO")
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    const data = await OrderService.listOrders();
    if (data) setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

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
    refetchOrders: loadOrders
  }
}