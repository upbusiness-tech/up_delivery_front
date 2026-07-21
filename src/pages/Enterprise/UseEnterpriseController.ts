import { useEffect, useState } from "react";
import type { BusinessHours } from "../../types/Restaurant.type";
import { useRestaurant } from "../../context/RestaurantContext";

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

  return {
    restaurant,
    loading,
    businessHours
  }
}