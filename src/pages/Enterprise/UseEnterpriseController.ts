import {
  useConnectMercadoPago,
  useRestaurantMe,
  useUpdateBusinessHours,
} from "../../hooks/queries/useRestaurantQueries";
import type { UpdateBusinessHoursPayload } from "../../types/Restaurant.type";

export default function UseEnterpriseController() {

  const {
    data: restaurantInfos,
    isPending,
    error,
    refetch,
  } = useRestaurantMe();
  const connectMercadoPagoMutation = useConnectMercadoPago();
  const updateBusinessHoursMutation = useUpdateBusinessHours();

  async function connectRestaurant() {
    try {
      const data = await connectMercadoPagoMutation.mutateAsync();
      window.location.href = data.authorizationUrl;
    } catch {
      return;
    }
  }

  async function updateBusinessHours(payload: UpdateBusinessHoursPayload) {
    return updateBusinessHoursMutation.mutateAsync(payload);
  }

  return {
    restaurantInfos,
    isLoading: isPending,
    error,
    refetch,
    connectRestaurant,
    isConnecting: connectMercadoPagoMutation.isPending,
    updateBusinessHours,
    isUpdatingBusinessHours: updateBusinessHoursMutation.isPending,
  }
}
