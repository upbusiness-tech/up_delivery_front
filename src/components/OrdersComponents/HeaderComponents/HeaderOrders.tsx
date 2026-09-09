import { Badge, Box, Button, Stack, Typography } from "@mui/material";
import WebIcon from '@mui/icons-material/Web';
import UseHeaderOrdersController from "./UseHeaderOrdersController";
import type { Restaurant } from "../../../types/Restaurant.type";
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PendingOrdersModal from "./PendingOrdersModal/PendingOrdersModal";
import OpenCloseRestaurantModal from "./OpenCloseRestaurantModal/OpenCloseRestaurantModal";
import { useRestaurant } from "../../../context/RestaurantContext";

interface props {
  restaurant: Restaurant | undefined
}

export function HeadarOrders({restaurant}: props) {
  const c = UseHeaderOrdersController({restaurant})
  const { orders } = useRestaurant()

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%', alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Button variant="contained" endIcon={<StorefrontIcon />} onClick={c.handleOpenModalStatusRestaurant} sx={{ bgcolor: c.restaurantOpen ? "success.main" : "error.main", color: "#fff", textTransform: "none", width: { xs: '100%', sm: 'auto' } }}>
          {c.restaurantOpen ? "Aberto" : "Fechado"}
        </Button>

        <Button variant="outlined" endIcon={<WebIcon />} onClick={() => window.open(`${import.meta.env.VITE_MENU_BASE_URL}/${restaurant?.slug}`, "_blank")} sx={{ textTransform: "none", width: { xs: '100%', sm: 'auto' } }}>
          Cardápio
        </Button>

        <Badge color="error" badgeContent={c.pendingOrders.length} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="outlined" endIcon={<LocalOfferIcon />} onClick={c.handleOpenModalPendingOrders} sx={{ textTransform: "none", width: '100%' }}>
            Pedidos
          </Button>
        </Badge>
      </Stack>

      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {orders?.length ?? 0}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          pedido{orders?.length === 1 ? '' : 's'} hoje
        </Typography>
      </Stack>

      <OpenCloseRestaurantModal restaurant={restaurant} open={c.modalStatusRestaurant} onClose={c.handleCloseModalStatusRestaurant} />
      <PendingOrdersModal orders={c.pendingOrders} open={c.modalPendingOrders} onClose={c.handleCloseModalPendingOrders} onReceive={c.handleReceiveOrder} />
    </Stack>
  );
}