import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterAdditionalModalController from "./UseRegisterAdditionalModalController";

interface props {
  open: boolean;
  onClose: () => void;
}

export default function RegisterAdditionalModal({ open, onClose }: props) {
  const {
    CATEGORIES,
    additionalName,
    setAdditionalName,
    additionalPrice,
    setAdditionalPrice,
    categoryId,
    setCategoryId,
    additionalType,
    setAdditionalType,
    createAdditional,
    closeAndReset,
    isCreating,
    formError,
  } = UseRegisterAdditionalModalController({ onClose });

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
            <Typography variant="body1">Cadastro de Adicional</Typography>
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Categoria
              </Typography>
              <Select
                size="small"
                value={categoryId}
                displayEmpty
                disabled={isCreating || CATEGORIES.length === 0}
                onChange={(event) => setCategoryId(event.target.value)}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography sx={{ color: "#9ca3af" }}>
                        {CATEGORIES.length === 0
                          ? "Cadastre uma categoria primeiro"
                          : "Selecione uma categoria"}
                      </Typography>
                    );
                  }
                  const found = CATEGORIES.find((cat) => cat.id === selected);
                  return found?.categoryName;
                }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 7 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Nome
              </Typography>
              <TextField
                value={additionalName}
                onChange={(e) => setAdditionalName(e.target.value)}
                size="small"
                fullWidth
                autoFocus
                placeholder="Ex: Bacon extra, Cheddar"
                disabled={isCreating}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Preço
              </Typography>
              <TextField
                value={additionalPrice}
                onChange={(e) => setAdditionalPrice(e.target.value)}
                size="small"
                fullWidth
                inputMode="decimal"
                placeholder="R$ 0,00"
                disabled={isCreating}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Seleção
              </Typography>
              <Select
                size="small"
                value={additionalType}
                disabled={isCreating}
                onChange={(event) =>
                  setAdditionalType(event.target.value as "single" | "multiple")
                }
              >
                <MenuItem value="multiple">
                  Múltipla (o cliente pode escolher vários)
                </MenuItem>
                <MenuItem value="single">
                  Única (o cliente escolhe apenas um)
                </MenuItem>
              </Select>
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
            onClick={createAdditional}
            disabled={
              isCreating ||
              !additionalName.trim() ||
              !categoryId ||
              !additionalPrice.trim()
            }
          >
            {isCreating ? "Salvando..." : "Salvar Adicional"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
