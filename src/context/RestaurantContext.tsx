
import { createContext, useContext, useEffect, useState, useRef, type Dispatch, type ReactNode, type SetStateAction } from "react";
import type { Neighborhood, Restaurant } from "../types/Restaurant.type";
import { RestaurantService } from "../api/services/restaurant.service";
import { OrderService } from "../api/services/order.service";
import type { Order } from "../types/Order.type";
import type { Additionals, Product, ProductCategory, Size } from "../types/Product.type";
import { useAuth } from "./AuthContext";
import { createSocket } from "../api/services/socket";
import { useNotificationSound } from "../hooks/useNotificationSound";

interface RestaurantContextValue {
  restaurant: Restaurant | undefined;
  orders: Order[] | undefined;
  isLoading: boolean;
  setOrders: Dispatch<SetStateAction<Order[] | undefined>>;
  fetchOrders: () => Promise<void>;
  categories: ProductCategory[] | undefined;
  setCategories: Dispatch<SetStateAction<ProductCategory[]>>;
  products: Product[] | undefined;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  additionals: Additionals[] | undefined;
  neighborhoods: Neighborhood[] | undefined;
  sizes: Size[] | undefined;
  addProduct: (novoProduto: Product) => void;
  addCategory: (novaCategoria: ProductCategory) => void;
  onUpdateProduct: (produtoAtualizado: Product) => void;
  removeProduct: (id: string) => void;
  addAdditional: (novoAdicional: Additionals) => void;
  addSize: (novoTamanho: Size) => void;
  orderToPrint: Order | null;
  dequeuePrint: () => Promise<void>;
}

export const RestaurantContext = createContext<RestaurantContextValue | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined);
  const [orders, setOrders] = useState<Order[] | undefined>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [additionals, setAdditionals] = useState<Additionals[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  // Evita recarregar a página durante uma impressão.
  // useEffect(() => {
  //   const id = setInterval(() => window.location.reload(), 5 * 60 * 1000);
  //   return () => clearInterval(id);
  // }, []);

  // Fila de impressão
  const printedIds = useRef(new Set<string>());
  const isFetchingPending = useRef(false);
  const isDequeueing = useRef(false);
  const [printQueue, setPrintQueue] = useState<Order[]>([]);
  const orderToPrint = printQueue[0] ?? null;

  // Busca os pedidos pendentes e sincroniza a fila e o painel.
  const fetchPendingPrintOrders = async () => {
    if (isFetchingPending.current) return;

    isFetchingPending.current = true;

    try {
      const pending = await OrderService.getFullPendingOrders();

      setOrders((prev) => {
        const map = new Map((prev ?? []).map((order) => [order.id, order]));

        pending.forEach((order) => map.set(order.id, order));

        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      });

      setPrintQueue((prev) => {
        const map = new Map(prev.map((order) => [order.id, order]));

        pending.forEach((order) => {
          if (!printedIds.current.has(order.id)) {
            map.set(order.id, order);
          }
        });

        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      });
    } catch (error) {
      console.error("Erro ao buscar pedidos pendentes:", error);
    } finally {
      isFetchingPending.current = false;
    }
  };

  // Chamado quando o pop-up da impressão atual termina.
  const dequeuePrint = async () => {
    if (!orderToPrint || isDequeueing.current) return;

    isDequeueing.current = true;
    const printedOrder = orderToPrint;

    try {
      // Primeiro confirma no backend que o pedido foi impresso.
      await OrderService.updatePrinted(printedOrder.id);
      printedIds.current.add(printedOrder.id);

      // Remove o pedido atual da fila.
      setPrintQueue((prev) =>
        prev.filter((order) => order.id !== printedOrder.id)
      );

      // Busca pedidos pendentes para recuperar eventos perdidos pelo socket.
      await fetchPendingPrintOrders();
    } catch (error) {
      console.error("Erro ao processar impressão:", error);
    } finally {
      isDequeueing.current = false;
    }
  };

  // Socket global de pedidos
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null);
  const { play: playNotificationSound } = useNotificationSound();

  useEffect(() => {
    if (!restaurant?.id || socketRef.current) return;

    const socket = createSocket(restaurant.id);
    socketRef.current = socket;

    socket.on("newOrder", (newOrder: Order) => {
      setOrders((prev) => {
        if (prev?.some((order) => order.id === newOrder.id)) return prev;
        return [newOrder, ...(prev ?? [])];
      });

      setPrintQueue((prev) => {
        if (
          printedIds.current.has(newOrder.id) ||
          prev.some((order) => order.id === newOrder.id)
        ) {
          return prev;
        }

        return [...prev, newOrder].sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      });

      playNotificationSound();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [restaurant?.id]);

  useEffect(() => {
    if (authLoading || !user) return;
    loadRestaurant();
  }, [authLoading, user]);

  const loadRestaurant = async () => {
    const restaurantData = await RestaurantService.getMe();
    setRestaurant(restaurantData);

    const productsData = await RestaurantService.restaurantProducts();
    if (productsData) setProducts(productsData);

    const categoriesData = await RestaurantService.restaurantCategories(restaurantData.id);
    if (categoriesData) setCategories(categoriesData);

    const additionalsData = await RestaurantService.restaurantAdditionals();
    if (additionalsData) setAdditionals(additionalsData);

    const neighborhoodsData = await RestaurantService.restaurantNeighborhoods();
    if (neighborhoodsData) setNeighborhoods(neighborhoodsData);

    const sizesData = await RestaurantService.restaurantSizes();
    if (sizesData) setSizes(sizesData);
  };

  async function fetchOrders() {
    if (hasFetched || !restaurant) return;

    setIsLoading(true);

    try {
      const response = await RestaurantService.restaurantOpen(restaurant.id);

      if (!response?.data) {
        setOrders([]);
        return;
      }

      const data = await OrderService.listOrders();
      setOrders(data);
      setHasFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function addProduct(novoProduto: Product) {
    setProducts((prev) => [...prev, novoProduto]);
  }

  function onUpdateProduct(produtoAtualizado: Product) {
    setProducts((prev) =>
      prev.map((p) => p.id === produtoAtualizado.id ? produtoAtualizado : p)
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

  return (
    <RestaurantContext.Provider
      value={{
        restaurant, orders, setOrders, fetchOrders, isLoading,
        categories, setCategories, products, setProducts, additionals,
        neighborhoods, sizes, addProduct, onUpdateProduct, removeProduct,
        addCategory, addAdditional, addSize, orderToPrint, dequeuePrint
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);

  if (!ctx) {
    throw new Error("useRestaurant deve ser usado dentro de <RestaurantProvider>");
  }

  return ctx;
}
