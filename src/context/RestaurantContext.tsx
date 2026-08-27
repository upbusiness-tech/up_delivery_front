import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { Neighborhood, Restaurant } from "../types/Restaurant.type";
import { RestaurantService } from "../api/services/restaurant.service";
import { OrderService } from "../api/services/order.service";
import type { Order } from "../types/Order.type";
import type { Additionals, Product, ProductCategory, Size } from "../types/Product.type";
import { useAuth } from "./AuthContext";

//Socket de pedidos global
import { useRef } from "react";
import { createSocket } from "../api/services/socket";
import { useNotificationSound } from "../hooks/useNotificationSound";

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
  addProduct: (novoProduto: Product) => void

  addCategory: (novaCategoria: ProductCategory) => void
  onUpdateProduct: (produtoAtualizado: Product) => void
  removeProduct: (id: string) => void
  addAdditional: (novoAdicional: Additionals) => void
  addSize: (novoTamanho: Size) => void

  orderToPrint: Order | null;
setOrderToPrint: Dispatch<SetStateAction<Order | null>>;
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
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  //----------------Socket global para os pedidos--------------------------
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null);
  const { play: playNotificationSound } = useNotificationSound();

  useEffect(() => {
    if (!restaurant?.id) return;
    if (socketRef.current) return;

    const socket = createSocket(restaurant.id);
    socketRef.current = socket;

    socket.on("newOrder", (newOrder: Order) => {
      setOrders((prev) => {
        const exists = prev?.some((order) => order.id === newOrder.id);
        if (exists) return prev;
        return [newOrder, ...(prev ?? [])];
      });
      setOrderToPrint(newOrder);
      playNotificationSound();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [restaurant?.id]);
  
  
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
    if (!restaurant) return;

    setIsLoading(true);
    try {
      const response = await RestaurantService.restaurantOpen(restaurant?.id)

      if(!response?.data){
        setOrders([])
        // setHasFetched(true); // evita ficar re-checando toda hora
        return;
      }

      const data = await OrderService.listOrders();
      setOrders(data);
      setHasFetched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  function addProduct(novoProduto: Product) {
    setProducts((prev) => [...prev, novoProduto]);
  }
  function onUpdateProduct(produtoAtualizado: Product) {
    setProducts((prev) =>
      prev.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p))
    );
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addCategory(novaCategoria: ProductCategory) {
    setCategories((prev) => [...prev, novaCategoria]);
  }

  function addAdditional(novoAdicional: Additionals) {
    setAdditionals((prev) => [...prev, novoAdicional]);
  }

  function addSize(novoTamanho: Size) {
    setSizes((prev) => [...prev, novoTamanho]);
  }

  return(
  <RestaurantContext.Provider 
    value={{restaurant, orders, setOrders, fetchOrders, isLoading, 
    categories, setCategories, products, setProducts, additionals,
    neighborhoods, sizes, addProduct,onUpdateProduct, removeProduct,
    addCategory, addAdditional, addSize, orderToPrint, setOrderToPrint
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