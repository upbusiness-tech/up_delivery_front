import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Product } from "../../../../types/Product.type";
import imagemGenerica from "../../../../assets/imgNull.png";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import UseProductDetailModalController from "./UseProductDetailModalController";
import RegisterProductSizetModal from "../RegisterProductSize.tsx/RegisterProductSizeModal";
import ProductsSizesTable from "../SizesTable/ProductsSizesTable";

interface props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: props) {
  if (!product) {
    return null;
  }

  return (
    <ProductDetailContent
      key={product.id}
      product={product}
      onClose={onClose}
    />
  );
}

function ProductDetailContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const c = UseProductDetailModalController({ product, onClose });

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Informações do produto
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Consulte e edite os dados do produto.
        </Typography>
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
        <Stack spacing={2.5}>
          {c.error && (
            <Alert severity="error">
              Não foi possível concluir a operação. Tente novamente.
            </Alert>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box
              component="img"
              src={product.image || imagemGenerica}
              alt={product.productName}
              sx={{
                width: { xs: "100%", sm: 150 },
                height: { xs: 180, sm: 150 },
                borderRadius: 2,
                objectFit: "cover",
                flexShrink: 0,
                bgcolor: "#f3f4f6",
              }}
            />
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Nome
                </Typography>
                <TextField
                  value={c.productName}
                  onChange={(e) => c.setProductName(e.target.value)}
                  size="small"
                  fullWidth
                  disabled={c.isBusy}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Descrição
                </Typography>
                <TextField
                  value={c.productDescription}
                  onChange={(e) => c.setProductDescription(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  minRows={3}
                  disabled={c.isBusy}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Categoria
              </Typography>
              <Typography variant="body1">
                {product.productCategory.categoryName}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  size="small"
                  label={product.productActive ? "Ativo" : "Inativo"}
                  color={product.productActive ? "success" : "default"}
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Criado em
              </Typography>
              <Typography variant="body1">{c.formattedDate}</Typography>
            </Box>
          </Stack>

          <Divider />

          <Box>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2">
                  Tamanhos e preços
                </Typography>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Edite os preços ou adicione novas opções.
                </Typography>
              </Box>
              <Button
                startIcon={<AddIcon />}
                sx={{ textTransform: "none" }}
                variant="contained"
                color="primary"
                size="small"
                onClick={c.handleOpenNewOptionProductSize}
                disabled={c.isBusy}
              >
                Nova opção
              </Button>
            </Stack>
            <ProductsSizesTable
              sizes={product.sizes}
              product={product}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button
          sx={{ textTransform: "none" }}
          variant="outlined"
          color="error"
          size="medium"
          onClick={() => void c.deleteProduct()}
          disabled={c.isBusy}
        >
          {c.isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
        <Stack direction="row" spacing={1}>
          <Button
            sx={{ textTransform: "none" }}
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={c.handleCancel}
            disabled={c.isBusy}
          >
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            color="success"
            size="medium"
            disabled={!c.isDirty || c.isBusy}
            onClick={() => void c.handleSaveChanges()}
          >
            {c.isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </Stack>
      </DialogActions>

      <RegisterProductSizetModal
        onClose={c.handleCloseNewOptionProductSize}
        open={c.openNewOptionProductSize}
        product={product}
      />
    </Dialog>
  );
}
