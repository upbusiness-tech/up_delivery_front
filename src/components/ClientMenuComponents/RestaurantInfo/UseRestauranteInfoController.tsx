import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { usePublicRestaurantIsOpen } from "../../../hooks/usePublicRestaurantIsOpen";

export default function UseRestauranteInfoController(){
  const { restaurant } = usePublicRestaurant();
  const restaurantIsOpen = usePublicRestaurantIsOpen();

  return {
    restaurantIsOpen,
    restaurantInfos: restaurant,
  }
}
