import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import UseOpenCloseRestaurantModalController from "./UseOpenCloseRestaurantModalController";
import type { Restaurant } from "../../../../types/Restaurant.type";

interface props {
  open: boolean;
  onClose: () => void;
  restaurant: Restaurant | undefined
}

export default function OpenCloseRestaurantModal({ open, onClose, restaurant }: props) {
  const c = UseOpenCloseRestaurantModalController({ restaurant });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="body1">Funcionamento</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row">
          <Typography>
            Tem certeza que deseja fechar o restaurante?
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" sx={{ pb: 1}} spacing={1}>
          <Button sx={{ textTransform: "none" }} variant="contained" color="inherit" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color={c.restaurantOpen ? "error" : "success"}
            disabled={c.loadingStatus || c.updatingStatus}
            onClick={c.toggleRestaurantStatus}
          >
            {c.updatingStatus ? (
              <CircularProgress size={20} color="inherit" />
            ) : c.restaurantOpen ? (
              "Fechar restaurante"
            ) : (
              "Abrir restaurante"
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}