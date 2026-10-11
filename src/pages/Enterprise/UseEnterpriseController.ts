import { RestaurantService } from "../../api/services/restaurant.service";
import { QueryCacheName, useRestaurantData } from "../../hooks/useRestaurantData";

export default function UseEnterpriseController() {

  const { data: restaurantInfos, isLoading } = useRestaurantData(RestaurantService.getMe, QueryCacheName.RESTAURANT)

  async function connectRestaurant() {
    try{
      const response = await RestaurantService.restaurantConnectMp()
      if(response){
        const link = response.data.authorizationUrl;
        console.log(link)
        window.location.href = link;
      }
    }catch(err){
      console.log(err)
    }
  }

  return {
    restaurantInfos,
    isLoading,
    connectRestaurant
  }
}