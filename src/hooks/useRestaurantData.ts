import { useQuery } from "@tanstack/react-query";


export enum QueryCacheName {
  RESTAURANT = "restaurant-infos",
  RESTAURANT_ISOPEN = "restaurant-open",
  SETTINGS = "restaurant-settings",
  ORDERS = "orders",
  PRODUCTS = "products",
  CATEGORIES = "categories",
  ADDITIONALS = "additionals",
  SIZES = "sizes"

}

export function useRestaurantData<T>(fecthFunction: () => Promise<T>, queryKey: QueryCacheName) {
  return useQuery<T>({
    queryFn: fecthFunction,
    queryKey: [queryKey],
    staleTime: 5 * 60 * 1000, //Os dados são considerados atualizados por 5 minutos.
    gcTime: 30 * 60 * 1000, //Os dados inativos permanecem no cache por até 30 minutos.
    refetchOnWindowFocus: false // Não busca novamente ao voltar para a aba
  });
}

