import { Store, Web } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
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
    handleCloseToggleOpenDialog,
    handleConfirmToggleOpen,
    handleOpenToggleOpenDialog,
    isLoadingRestaurant,
    isTogglingRestaurant,
    isUpdatingReceived,
    modalPendingOrders,
    nextRestaurantIsOpen,
    pendingOrders,
    toggleOpenDialog,
    toggleRestaurantError,
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
          onClick={handleOpenToggleOpenDialog}
          disabled={isLoadingRestaurant || isTogglingRestaurant}
          sx={{ bgcolor: restaurantIsOpen ? "success.main" : "error.main", color: "#fff", textTransform: "none", width: { xs: '100%', sm: 'auto' } 
        }}>
          {isTogglingRestaurant
            ? "Atualizando..."
            : restaurantIsOpen
              ? "Aberto"
              : "Fechado"}
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

      <Dialog
        open={toggleOpenDialog}
        onClose={handleCloseToggleOpenDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {nextRestaurantIsOpen ? "Abrir restaurante agora?" : "Fechar restaurante agora?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {nextRestaurantIsOpen
              ? "O restaurante será aberto fora do horário programado. A abertura manual vale até o próximo fechamento da agenda ou até o fim do dia."
              : "O restaurante será fechado fora do horário programado. O fechamento manual vale até a próxima abertura da agenda."}
          </DialogContentText>

          {toggleRestaurantError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Não foi possível alterar o status do restaurante.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseToggleOpenDialog}
            disabled={isTogglingRestaurant}
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={nextRestaurantIsOpen ? "success" : "error"}
            onClick={() => void handleConfirmToggleOpen()}
            disabled={isTogglingRestaurant}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {isTogglingRestaurant
              ? "Atualizando..."
              : nextRestaurantIsOpen
                ? "Abrir agora"
                : "Fechar agora"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}