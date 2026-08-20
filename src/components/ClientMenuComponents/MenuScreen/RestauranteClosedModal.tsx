import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface props {
  open: boolean;
  close: () => void;
}

export default function RestauranteClosedModal({ open, close }: props) {
  return (
    <Dialog open={open} onClose={close} maxWidth="sm">
    <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Restaurante fechado</Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="Fechar"
          onClick={close}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

    <DialogContent>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Stack sx={{ alignItems: "center", justifyContent: "center", textAlign: "center", py: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Opa!.. No momento não estamos disponiveis para novos pedidos!
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
  );
}