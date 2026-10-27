import {
  useConnectMercadoPago,
  useRestaurantMe,
} from "../../hooks/queries/useRestaurantQueries";

export default function UseEnterpriseController() {

  const {
    data: restaurantInfos,
    isPending,
    error,
    refetch,
  } = useRestaurantMe();
  const connectMercadoPagoMutation = useConnectMercadoPago();

  async function connectRestaurant() {
    try {
      const data = await connectMercadoPagoMutation.mutateAsync();
      window.location.href = data.authorizationUrl;
    } catch {
      return;
    }
  }

  return {
    restaurantInfos,
    isLoading: isPending,
    error,
    refetch,
    connectRestaurant,
    isConnecting: connectMercadoPagoMutation.isPending,
  }
}
