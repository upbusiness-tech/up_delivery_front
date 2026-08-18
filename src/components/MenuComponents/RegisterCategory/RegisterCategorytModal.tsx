import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterCategory from "./UseRegisterCategorytModalController";

interface props {
  open: boolean;
  onClose: () => void;
}


export default function RegisterCategorytModal({open, onClose }: props) {

  const c = UseRegisterCategory()
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Cadastro de Categoria</Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 2 }}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Nome
                </Typography>
                <TextField
                  value={c.categoryName}
                  onChange={(e) => c.setCategoryName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Nome da categoria"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button sx={{ textTransform: "none" }} variant="contained" color="inherit" size="medium" onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ textTransform: "none" }} variant="contained" color="success" size="medium"
            onClick={c.createCategory}
          >
            Salvar Categoria
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}