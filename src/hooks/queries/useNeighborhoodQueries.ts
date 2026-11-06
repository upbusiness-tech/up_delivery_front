import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { RestaurantService } from "../../api/services/restaurant.service";
import type { NeighborhoodDTO } from "../../types/Restaurant.type";
import { QueryCacheName } from "../useRestaurantData";
import { queryKeys } from "./queryKeys";

const NEIGHBORHOODS_STALE_TIME = 5 * 60 * 1000;

function invalidateNeighborhoodCaches(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.neighborhoods.all });
  void queryClient.invalidateQueries({
    queryKey: [QueryCacheName.NEIGHBORHOODS_PUBLIC],
  });
}

export function useNeighborhoods() {
  return useQuery({
    queryKey: queryKeys.neighborhoods.list(),
    queryFn: () => RestaurantService.restaurantNeighborhoods(),
    staleTime: NEIGHBORHOODS_STALE_TIME,
  });
}

export function useCreateNeighborhood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: NeighborhoodDTO) =>
      RestaurantService.createNeighborhood(body),
    onSuccess: () => invalidateNeighborhoodCaches(queryClient),
  });
}

type UpdateNeighborhoodVariables = {
  neighborhoodId: string;
  body: Partial<NeighborhoodDTO>;
};

export function useUpdateNeighborhood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ neighborhoodId, body }: UpdateNeighborhoodVariables) =>
      RestaurantService.updateNeighborhood(neighborhoodId, body),
    onSuccess: () => invalidateNeighborhoodCaches(queryClient),
  });
}

export function useDeleteNeighborhood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (neighborhoodId: string) =>
      RestaurantService.deleteNeighborhood(neighborhoodId),
    onSuccess: () => invalidateNeighborhoodCaches(queryClient),
  });
}
