import { Button, Stack } from "@mui/material";
import WebIcon from '@mui/icons-material/Web';
import UseHeaderOrdersController from "./UseHeaderOrdersController";
import type { Restaurant } from "../../../types/Restaurant.type";
import StorefrontIcon from '@mui/icons-material/Storefront';
import OpenCloseRestaurantModal from "./OpenCloseRestaurantModal";

interface props {
  restaurant: Restaurant | undefined
}

export function HeadarOrders({restaurant}: props) {

  const c = UseHeaderOrdersController({restaurant})
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button onClick={() => window.open(`${import.meta.env.VITE_MENU_BASE_URL}/${restaurant?.slug}`, '_blank')} endIcon={<WebIcon />} variant="contained" sx={{ textTransform: 'none' }}>
          Cardápio
        </Button>
        <Button
          sx={{bgcolor: c.restaurantOpen ? "success.main" : "error.main", color:  "#fff",  textTransform: 'none' }}
          endIcon={<StorefrontIcon/>}
          onClick={c.handleOpenModalStatusRestaurant}
        >
        {c.restaurantOpen ? "Aberto" : "Fechado"}
        </Button>
      </Stack>
      <OpenCloseRestaurantModal restaurant={restaurant} open={c.modalStatusRestaurant} onClose={c.handleCloseModalStatusRestaurant}/>
    </Stack>
  );
}