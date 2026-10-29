import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterCategory from "./UseRegisterCategorytModalController";

interface props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterCategorytModal({ open, onClose }: props) {
  const {
    categoryName,
    setCategoryName,
    createCategory,
    closeAndReset,
    isCreating,
    formError,
  } = UseRegisterCategory({ onClose });

  return (
    <Dialog
      open={open}
      onClose={isCreating ? undefined : closeAndReset}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Cadastro de Categoria</Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="Fechar"
          onClick={closeAndReset}
          disabled={isCreating}
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
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Nome
              </Typography>
              <TextField
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                size="small"
                fullWidth
                autoFocus
                placeholder="Ex: Pizzas, Bebidas, Sobremesas"
                disabled={isCreating}
              />
            </Box>
          </Grid>
        </Grid>
        {formError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={1}>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color="inherit"
            size="medium"
            onClick={closeAndReset}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color="success"
            size="medium"
            onClick={createCategory}
            disabled={isCreating || !categoryName.trim()}
          >
            {isCreating ? "Salvando..." : "Salvar Categoria"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
