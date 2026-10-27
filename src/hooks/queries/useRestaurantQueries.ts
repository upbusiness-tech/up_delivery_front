import { useMutation, useQuery } from "@tanstack/react-query";
import { RestaurantService } from "../../api/services/restaurant.service";
import { queryKeys } from "./queryKeys";

const RESTAURANT_STALE_TIME = 5 * 60 * 1000;

export function useRestaurantMe() {
  return useQuery({
    queryKey: queryKeys.restaurant.me(),
    queryFn: () => RestaurantService.getMe(),
    staleTime: RESTAURANT_STALE_TIME,
  });
}

export function useRestaurantIsOpen() {
  return useQuery({
    queryKey: queryKeys.restaurant.isOpen(),
    queryFn: () => RestaurantService.restaurantIsopen(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useConnectMercadoPago() {
  return useMutation({
    mutationFn: () => RestaurantService.restaurantConnectMp(),
  });
}
