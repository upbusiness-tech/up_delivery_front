import { useEffect, useState } from "react";
import { RestaurantService } from "../../../api/services/restaurant.service";
import type { Restaurant } from "../../../types/Restaurant.type";

interface props {
  restaurant: Restaurant | undefined
}

export default function UseHeaderOrdersController({restaurant}: props){
  const [restaurantOpen, setRestaurantOpen] = useState<boolean>()
  const [modalStatusRestaurant, setModalStatusRestaurant] = useState(false);
  const handleOpenModalStatusRestaurant = () => setModalStatusRestaurant(true)
  const handleCloseModalStatusRestaurant = () => setModalStatusRestaurant(false)


  useEffect(() => {
    restaurantIsOpen()
  }, [restaurant?.id])

  async function restaurantIsOpen(){
    if(!restaurant) return;
    const restaurantIsOpen = await RestaurantService.restaurantOpen(restaurant.id)
    console.log(restaurantIsOpen)
    if(!restaurantIsOpen?.data){
      setRestaurantOpen(false)
      console.log('RESTAURANTE FECHADO AGORA')
      return
    }
    setRestaurantOpen(true)
  }

  return {
    restaurantOpen,
    modalStatusRestaurant,
    handleCloseModalStatusRestaurant,
    handleOpenModalStatusRestaurant
  }
}