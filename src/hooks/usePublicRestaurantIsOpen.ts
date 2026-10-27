import { useQuery } from "@tanstack/react-query";
import { RestaurantService } from "../api/services/restaurant.service";
import { QueryCacheName } from "./useRestaurantData";

/** O status de funcionamento muda com frequência; não reuse por muito tempo. */
const PUBLIC_RESTAURANT_OPEN_STALE_TIME = 30_000;

/**
 * Status de funcionamento do restaurante público.
 *
 * Compartilha a mesma chave usada pelo cardápio, mas com um tempo de cache
 * menor para que o checkout seja bloqueado assim que o restaurante fechar.
 */
export function usePublicRestaurantIsOpen(slug: string) {
  return useQuery<boolean | undefined>({
    queryKey: [QueryCacheName.RESTAURANT_PUBLIC_ISOPEN, slug],
    queryFn: () => RestaurantService.restaurantIsopenSlug(slug),
    staleTime: PUBLIC_RESTAURANT_OPEN_STALE_TIME,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: Boolean(slug),
  });
}
