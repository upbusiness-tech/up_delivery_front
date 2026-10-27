import { Store, Web } from "@mui/icons-material";
import { Badge, Box, Button, Stack, Typography } from "@mui/material";
import UseHeaderOrdersController from "./UseHeaderOrdersController";
import type { Order } from "../../../types/Order.type";
import PendingOrdersModal from "./PendingOrdersModal/PendingOrdersModal";
interface props {
  orders: Order[]
}

export function HeaderOrders({orders}: props) {

  const { 
    restaurantIsOpen,
    restaurantInfos,
    handleOpenModalPendingOrders,
    handleCloseModalPendingOrders,
    handleReceiveOrder,
    isUpdatingReceived,
    modalPendingOrders,
    pendingOrders
  } = UseHeaderOrdersController({orders})


  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={1.5} 
      sx={{ width: '100%', alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' 
    }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={1} 
        sx={{ width: { xs: '100%', sm: 'auto' }
      }}>
        <Button 
          variant="contained" 
          endIcon={<Store />}
          sx={{ bgcolor: restaurantIsOpen ? "success.main" : "error.main", color: "#fff", textTransform: "none", width: { xs: '100%', sm: 'auto' } 
        }}>
          {restaurantIsOpen ? "Aberto" : "Fechado"}
        </Button>

        <Button 
          variant="outlined" 
          endIcon={<Web />} 
          onClick={() => window.open(`${import.meta.env.VITE_MENU_BASE_URL}/r/${restaurantInfos?.slug}`, "_blank")} 
          sx={{ textTransform: "none", width: { xs: '100%', sm: 'auto' } 
        }}>
          Cardápio
        </Button>

        <Badge color="error" badgeContent={pendingOrders?.length} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="outlined"
            onClick={handleOpenModalPendingOrders} 
            sx={{ textTransform: "none", width: '100%' }}>
            Pedidos
          </Button>
        </Badge>
      </Stack>

      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {orders.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          pedido{orders.length === 1 ? '' : 's'} hoje
        </Typography>
      </Stack>

      <PendingOrdersModal
        orders={pendingOrders ?? []}
        open={modalPendingOrders}
        onClose={handleCloseModalPendingOrders}
        onReceive={handleReceiveOrder}
        isReceiving={isUpdatingReceived}
      />
    </Stack>
  );
}