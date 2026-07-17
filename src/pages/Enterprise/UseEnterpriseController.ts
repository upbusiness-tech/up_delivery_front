import { useEffect, useState } from "react";
import type { BusinessHours, Restaurant } from "../../types/Restaurant.type";
import { RestaurantService } from "../../api/services/restaurant.service";

export default function UseEnterpriseController() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurant() {
      setLoading(true);
      const data = await RestaurantService.getMe();
      if (data) {
        setRestaurant(data);
        setBusinessHours(data.businessHours || {});
      }
      setLoading(false);
    }
    loadRestaurant();
  }, []);

  return {
    restaurant,
    loading,
    businessHours
  }
}