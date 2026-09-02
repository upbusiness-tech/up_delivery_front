import { useEffect, useState } from "react";
import type { Restaurant } from "../../../../types/Restaurant.type";
import { RestaurantService } from "../../../../api/services/restaurant.service";

interface props {
  restaurant: Restaurant | undefined;
}

export default function UseOpenCloseRestaurantModalController({ restaurant }: props) {
  const [restaurantOpen, setRestaurantOpen] = useState<boolean>();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchRestaurantStatus();
  }, [restaurant?.id]);

  async function fetchRestaurantStatus() {
    if (!restaurant) return;
    setLoadingStatus(true);
    const response = await RestaurantService.restaurantOpen(restaurant.id);
    setLoadingStatus(false);

    if (!response?.data) {
      setRestaurantOpen(false);
      return;
    }
    setRestaurantOpen(true);
  }

  // TODO: substituir pelos endpoints reais (ex: RestaurantService.closeRestaurant / openRestaurant)
  async function toggleRestaurantStatus() {
    if (!restaurant) return;
    setUpdatingStatus(true);

  }

  return {
    restaurantOpen,
    loadingStatus,
    updatingStatus,
    toggleRestaurantStatus,
  };
}