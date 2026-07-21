import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { Restaurant } from "../types/Restaurant.type";
import { RestaurantService } from "../api/services/restaurant.service";
import { OrderService } from "../api/services/order.service";
import type { Order } from "../types/Order.type";

interface RestaurantContextValue {
  restaurant: Restaurant | undefined;
  // setRestaurant: (restaurant: Restaurant | undefined) => void;
  orders: Order[] | undefined;
  isLoading: boolean;
  setOrders: Dispatch<SetStateAction<Order[]>>; //aceita valor OU updater function
  fetchOrders: () => Promise<void>;
}

export const RestaurantContext  = createContext<RestaurantContextValue | undefined>(undefined)

export function RestaurantProvider({children}: { children: ReactNode }){
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // controla se já buscou
  
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;
    loadRestaurant();
  }, []);
  
  const loadRestaurant = async () => {
    const data = await RestaurantService.getMe()
    setRestaurant(data)
  }
  
  async function fetchOrders() {
    if (hasFetched) return; // já tem os dados, não busca de novo
    setIsLoading(true);
    try {
      const data = await OrderService.listOrders();
      setOrders(data);
      setHasFetched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return(
  <RestaurantContext.Provider value={{restaurant, orders, setOrders, fetchOrders, isLoading}}>
    {children}
  </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {throw new Error("useRestaurant deve ser usado dentro de <RestaurantProvider>")}
  return ctx;
}