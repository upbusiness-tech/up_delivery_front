import { useEffect, useState } from "react";
import type { BusinessHours } from "../../types/Restaurant.type";
import { useRestaurant } from "../../context/RestaurantContext";
import { RestaurantService } from "../../api/services/restaurant.service";

export default function UseEnterpriseController() {
  //Recebendo os dados do restaurante via contexto
  const {restaurant} = useRestaurant()
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (restaurant) {setBusinessHours(restaurant.businessHours || {})
      setLoading(false);
    }
  }, []);

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
    restaurant,
    loading,
    businessHours,
    connectRestaurant
  }
}