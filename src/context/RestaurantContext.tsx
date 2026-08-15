import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { Neighborhood, Restaurant } from "../types/Restaurant.type";
import { RestaurantService } from "../api/services/restaurant.service";
import { OrderService } from "../api/services/order.service";
import type { Order } from "../types/Order.type";
import type { Additionals, Product, ProductCategory, Size } from "../types/Product.type";
import { useAuth } from "./AuthContext";

interface RestaurantContextValue {
  restaurant: Restaurant | undefined;
  // setRestaurant: (restaurant: Restaurant | undefined) => void;
  orders: Order[] | undefined;
  isLoading: boolean;
  setOrders: Dispatch<SetStateAction<Order[] | undefined>>; //aceita valor OU updater function
  fetchOrders: () => Promise<void>;
  categories: ProductCategory[] | undefined
  setCategories: Dispatch<SetStateAction<ProductCategory[]>>;
  products: Product[] | undefined;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  additionals: Additionals[] | undefined;
  neighborhoods: Neighborhood[] | undefined;
  sizes: Size[] | undefined
}

export const RestaurantContext  = createContext<RestaurantContextValue | undefined>(undefined)

export function RestaurantProvider({children}: { children: ReactNode }){
  const { user, loading: authLoading } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined)
  const [orders, setOrders] = useState<Order[] | undefined>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // controla se já buscou
  const [products, setProducts] = useState<Product[]>([]); // controla se já buscou
  const [additionals, setAdditionals] = useState<Additionals[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  
  
 useEffect(() => {
    if (authLoading) return; // ainda verificando sessão do Firebase
    if (!user) return; // ninguém logado
    loadRestaurant();
  }, [authLoading, user]);
  
  const loadRestaurant = async () => {
    const restaurant_data = await RestaurantService.getMe()
    // if(!restaurant) return;
    setRestaurant(restaurant_data)
    
    //Produtos
    const products_data = await RestaurantService.restaurantProducts()
    if(products_data) setProducts(products_data)
    
    //Categorias
    const categories_data = await RestaurantService.restaurantCategories(restaurant_data.id)
    if(categories_data) setCategories(categories_data)

    //Adicionais
    const additionals_data = await RestaurantService.restaurantAdditionals()
    if(additionals_data) setAdditionals(additionals_data)

    //Bairro
    const neighborhoods_data = await RestaurantService.restaurantNeighborhoods()
    if(neighborhoods_data) setNeighborhoods(neighborhoods_data)

    //Tamanhos
    const sizes_data = await RestaurantService.restaurantSizes()
    if(sizes_data) setSizes(sizes_data)
    
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
  <RestaurantContext.Provider 
    value={{restaurant, orders, setOrders, fetchOrders, isLoading, 
    categories, setCategories, products, setProducts, additionals,
    neighborhoods, sizes
  }}>
    {children}
  </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {throw new Error("useRestaurant deve ser usado dentro de <RestaurantProvider>")}
  return ctx;
}