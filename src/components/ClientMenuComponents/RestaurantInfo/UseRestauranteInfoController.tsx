import { RestaurantService } from "../../../api/services/restaurant.service";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { usePublicRestaurantIsOpen } from "../../../hooks/usePublicRestaurantIsOpen";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";

export default function UseRestauranteInfoController(){
  const { slug } = usePublicRestaurant();

  const {data: restaurantIsOpen } = usePublicRestaurantIsOpen(slug)
  const {data: restaurantInfos } = useRestaurantData(() => RestaurantService.getPublicRestaurantInfos(slug), QueryCacheName.RESTAURANT_PUBLIC_INFOS, slug)


  return {
    restaurantIsOpen,
    restaurantInfos
  }
} 