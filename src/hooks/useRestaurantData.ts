import { useQuery } from "@tanstack/react-query";


export enum QueryCacheName {
  RESTAURANT = "restaurant_infos",
  RESTAURANT_ISOPEN = "restaurant_open",
  SETTINGS = "restaurant_settings",
  ORDERS = "orders",
  PRODUCTS = "products",
  CATEGORIES = "categories",
  ADDITIONALS = "additionals",
  SIZES = "sizes",
  
  RESTAURANT_PUBLIC_INFOS = "restaurant_public_infos",
  PRODUCTS_PUBLIC = "products_public",
  ADDITIONALS_PUBLIC = "additionals_public",
  SIZES_PUBLIC = "sizes_public",
  NEIGHBORHOODS_PUBLIC = "neighborhoods_public"
  
}

/**
 * @param scope valor que diferencia o cache (ex.: `slug` do restaurante).
 * Sem ele, dois restaurantes diferentes compartilhariam o mesmo cache.
 */
export function useRestaurantData<T>(fecthFunction: () => Promise<T>, queryKey: QueryCacheName, scope?: string) {
  return useQuery<T>({
    queryFn: fecthFunction,
    queryKey: scope ? [queryKey, scope] : [queryKey],
    staleTime: 5 * 60 * 1000, //Os dados são considerados atualizados por 5 minutos.
    gcTime: 30 * 60 * 1000, //Os dados inativos permanecem no cache por até 30 minutos.
    refetchOnWindowFocus: false // Não busca novamente ao voltar para a aba
  });
}

