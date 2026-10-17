import { RestaurantService } from "../../../api/services/restaurant.service";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";

export default function UseRestauranteInfoController(){
  const { slug } = usePublicRestaurant();

  const {data: restaurantIsOpen } = useRestaurantData(() => RestaurantService.restaurantIsopenSlug(slug!), QueryCacheName.RESTAURANT_PUBLIC_ISOPEN)
  const {data: restaurantInfos } = useRestaurantData(() => RestaurantService.getPublicRestaurantInfos(slug!), QueryCacheName.RESTAURANT_PUBLIC_INFOS)


  return {
    restaurantIsOpen,
    restaurantInfos
  }
} 