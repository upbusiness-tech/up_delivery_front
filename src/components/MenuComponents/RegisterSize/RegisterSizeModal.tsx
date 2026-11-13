import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterSizeModalController from "./UseRegisterSizeModalController";
import type { Size } from "../../../types/Product.type";

interface props {
  open: boolean;
  onClose: () => void;
  size?: Size | null;
}

export default function RegisterSizeModal({ open, onClose, size }: props) {
  const c = UseRegisterSizeModalController({ onClose, size });
  const isMobile = useMediaQuery("(max-width:599.95px)");

  return (
    <Dialog
      open={open}
      onClose={c.isSaving ? undefined : c.closeAndReset}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {c.isEditing ? "Editar tamanho" : "Cadastro de tamanho"}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          O preço de cada tamanho continua sendo definido no produto.
        </Typography>
        <IconButton
          aria-label="Fechar"
          onClick={c.closeAndReset}
          disabled={c.isSaving}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Nome do tamanho
            </Typography>
            <TextField
              value={c.name}
              onChange={(event) => c.setName(event.target.value)}
              size="small"
              fullWidth
              autoFocus
              placeholder="Ex: Pequeno, Médio, Grande"
              disabled={c.isSaving}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Limite de sabores
            </Typography>
            <TextField
              value={c.limitFlavors}
              onChange={(event) => c.setLimitFlavors(event.target.value)}
              size="small"
              fullWidth
              type="number"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">sabor(es)</InputAdornment>
                  ),
                },
                htmlInput: { min: 1, step: 1 },
              }}
              disabled={c.isSaving}
              helperText="Use 1 para tamanhos de sabor único. Para pizzas, use a quantidade máxima de sabores."
            />
          </Box>

          {c.formError && <Alert severity="error">{c.formError}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="inherit"
          onClick={c.closeAndReset}
          disabled={c.isSaving}
        >
          Cancelar
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="success"
          onClick={() => void c.saveSize()}
          disabled={c.isSaving || !c.name.trim() || !c.limitFlavors.trim()}
        >
          {c.isSaving ? "Salvando..." : c.isEditing ? "Salvar alterações" : "Salvar tamanho"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
