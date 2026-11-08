import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseRegisterProductSizeModalController from "./UseRegisterProductSizeModalController";
import type { Product } from "../../../../types/Product.type";

interface props {
  open: boolean;
  onClose: () => void;
  product: Product
}

export default function RegisterProductSizetModal({ open, onClose, product }: props) {

  const c = UseRegisterProductSizeModalController({ product, onClose })
  const isMobile = useMediaQuery("(max-width:599.95px)")

  return (
    <Dialog open={open} onClose={c.handleClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Novo tamanho
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Informe o preço dos tamanhos que deseja adicionar.
        </Typography>
        <IconButton
          aria-label="Fechar"
          onClick={c.handleClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {c.error && (
            <Alert severity="error">
              Não foi possível adicionar os tamanhos. Tente novamente.
            </Alert>
          )}

          {c.isLoadingSizes ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : c.availableSizes.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#6b7280", py: 2 }}>
              Todos os tamanhos disponíveis já foram adicionados a este produto.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {c.availableSizes.map((size) => (
                <Stack key={size.id} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <TextField
                    value={size.name}
                    size="small"
                    sx={{ flex: 1, minWidth: 0 }}
                    disabled
                  />
                  <TextField
                    type="number"
                    placeholder="R$ 0,00"
                    size="small"
                    sx={{ flex: 1, minWidth: 0 }}
                    value={c.sizePrices[size.id] || ""}
                    onChange={(event) =>
                      c.handleSetSizePrice(size.id, Number(event.target.value))
                    }
                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={c.handleClose}
            disabled={c.isSaving}
          >
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
            variant="contained"
            color="success"
            size="medium"
            onClick={() => void c.addProductSize()}
            disabled={!c.canSubmit || c.isSaving}
          >
            {c.isSaving ? "Salvando..." : `Salvar${c.selectedCount > 1 ? ` (${c.selectedCount})` : ""}`}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
