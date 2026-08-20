import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterAdditionalModalController from "./UseRegisterAdditionalModalController";

interface props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterAdditionalModal({open, onClose }: props) {

  const c = UseRegisterAdditionalModalController()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Cadastro de Adicional</Typography>
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
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                 Categoria
                </Typography>
                <Select
                  size="small"
                  value={c.categoryId ?? ""}
                  displayEmpty
                  onChange={(event) => c.setCategoryId(event.target.value)}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: "#9ca3af" }}>Selecione uma categoria</Typography>;
                    }
                    const found = c.CATEGORIES.find((cat) => cat.id === selected);
                    return found?.categoryName;
                  }}
                  >
                  {c.CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 2 }}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Nome
                </Typography>
                <TextField
                  value={c.additionalName}
                  onChange={(e) => c.setAdditionalName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Nome do adicional"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Preço
                </Typography>
                <TextField
                  value={c.additionalPrice}
                  onChange={(e) => c.setAdditionalPrice(Number(e.target.value))}
                  size="small"
                  fullWidth
                  placeholder="R$"
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
            onClick={c.createAdditional}
          >
            Salvar Adicional
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}