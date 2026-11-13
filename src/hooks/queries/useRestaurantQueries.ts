import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RestaurantService } from "../../api/services/restaurant.service";
import type { UpdateBusinessHoursPayload } from "../../types/Restaurant.type";
import { useRestaurantOpenStatus } from "../useRestaurantOpenStatus";
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

export function useRestaurantOpenToggle() {
  const queryClient = useQueryClient();
  const { data: restaurant, isPending } = useRestaurantMe();
  const isOpen = useRestaurantOpenStatus(restaurant);

  const mutation = useMutation({
    mutationFn: (nextIsOpen: boolean) =>
      RestaurantService.setRestaurantOpen(nextIsOpen),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.restaurant.me(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.restaurant.publicAll,
      });
    },
  });

  async function toggle(nextIsOpen?: boolean) {
    return mutation.mutateAsync(nextIsOpen ?? !isOpen);
  }

  return {
    isOpen,
    isLoading: isPending,
    isToggling: mutation.isPending,
    error: mutation.error,
    toggle,
  };
}

export function useUpdateBusinessHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBusinessHoursPayload) =>
      RestaurantService.updateBusinessHours(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.restaurant.me(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.restaurant.isOpen(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.restaurant.publicAll,
      });
    },
  });
}

export function useConnectMercadoPago() {
  return useMutation({
    mutationFn: () => RestaurantService.restaurantConnectMp(),
  });
}
