import { usePublicRestaurant } from "../context/PublicRestaurantContext";
import { useRestaurantOpenStatus } from "./useRestaurantOpenStatus";

/**
 * Status de funcionamento do restaurante público.
 *
 * O `businessHours` já vem no carregamento do restaurante e fica no contexto
 * público. O status é apenas uma conta de horário, então não precisa de
 * endpoint próprio nem de polling.
 */
export function usePublicRestaurantIsOpen() {
  const { restaurant } = usePublicRestaurant();

  return useRestaurantOpenStatus(restaurant);
}
