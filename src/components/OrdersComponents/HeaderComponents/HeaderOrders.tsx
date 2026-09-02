import { Badge, Button, Stack } from "@mui/material";
import WebIcon from '@mui/icons-material/Web';
import UseHeaderOrdersController from "./UseHeaderOrdersController";
import type { Restaurant } from "../../../types/Restaurant.type";
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PendingOrdersModal from "./PendingOrdersModal/PendingOrdersModal";
import OpenCloseRestaurantModal from "./OpenCloseRestaurantModal/OpenCloseRestaurantModal";
// import PendingOrdersModal from "./PendingOrdersModal";

interface props {
  restaurant: Restaurant | undefined
}

export function HeadarOrders({restaurant}: props) {

  const c = UseHeaderOrdersController({restaurant})
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button
          sx={{bgcolor: c.restaurantOpen ? "success.main" : "error.main", color:  "#fff",  textTransform: 'none' }}
          endIcon={<StorefrontIcon/>}
          onClick={c.handleOpenModalStatusRestaurant}
        >
        {c.restaurantOpen ? "Aberto" : "Fechado"}
        </Button>

        <Button onClick={() => window.open(`${import.meta.env.VITE_MENU_BASE_URL}/${restaurant?.slug}`, '_blank')} endIcon={<WebIcon />} variant="contained" sx={{ textTransform: 'none' }}>
          Cardápio
        </Button>

        <Badge
          color="error"
          badgeContent={c.pendingOrders.length}
        >
          <Button
            sx={{textTransform: 'none' }}
            variant="outlined"
            endIcon={<LocalOfferIcon/>}
            onClick={c.handleOpenModalPendingOrders}
            >
            Pedidos
          </Button>
        </Badge>
      </Stack>
      <OpenCloseRestaurantModal
        restaurant={restaurant}
        open={c.modalStatusRestaurant}
        onClose={c.handleCloseModalStatusRestaurant}
      />

      <PendingOrdersModal
        orders={c.pendingOrders}
        open={c.modalPendingOrders}
        onClose={c.handleCloseModalPendingOrders}
        onReceive={c.handleReceiveOrder}
      />
    </Stack>
  );
}