import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { Product } from "../../../../types/Product.type";
import imagemGenerica from "../../../../assets/imgNull.png";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import UseProductDetailModalController from "./UseProductDetailModalController";
import RegisterProductSizetModal from "../RegisterProductSize.tsx/RegisterProductSizeModal";
import ProductsSizesTable from "../SizesTable/ProductsSizesTable";
import { moneyMask } from "../../../../utils/masks/mask";

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
  const isMobile = useMediaQuery("(max-width:599.95px)");
  const categoryAdditionals = c.additionals.filter(
    (additional) => additional.category?.id === product.productCategory.id,
  );

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
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

          {c.additionalsError && (
            <Alert severity="warning">
              Não foi possível carregar os adicionais cadastrados.
            </Alert>
          )}

          {c.imageError && <Alert severity="error">{c.imageError}</Alert>}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Stack spacing={1} sx={{ width: { xs: "100%", sm: 150 }, flexShrink: 0 }}>
              <Box
                component="img"
                src={c.imagePreview || product.image || imagemGenerica}
                alt={product.productName}
                sx={{
                  width: "100%",
                  height: { xs: 180, sm: 150 },
                  borderRadius: 2,
                  objectFit: "cover",
                  bgcolor: "#f3f4f6",
                }}
              />
              <input
                ref={c.fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={c.handleImageChange}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={c.handleImageClick}
                disabled={c.isBusy}
                sx={{ textTransform: "none" }}
              >
                Alterar imagem
              </Button>
              <Typography variant="caption" sx={{ color: "#6b7280", textAlign: "center" }}>
                JPG ou PNG
              </Typography>
            </Stack>
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
              direction={{ xs: "column", sm: "row" }}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
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

          <Divider />

          <Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box>
                <Typography variant="subtitle2">Adicionais do produto</Typography>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Por padrão, o produto usa todos os adicionais da categoria{" "}
                  {product.productCategory.categoryName}.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={c.useCategoryAdditionals}
                    onChange={(event) =>
                      c.handleUseCategoryAdditionalsChange(event.target.checked)
                    }
                    disabled={c.isBusy || c.additionalsLoading}
                  />
                }
                label="Usar adicionais da categoria"
                sx={{ m: 0 }}
              />
            </Stack>

            {c.useCategoryAdditionals ? (
              <Paper
                elevation={0}
                sx={{ p: 1.5, border: "1px solid #E5E7EB", borderRadius: 2 }}
              >
                {categoryAdditionals.length === 0 ? (
                  <Typography sx={{ color: "#64748B", fontSize: "0.9rem" }}>
                    A categoria ainda não possui adicionais cadastrados.
                  </Typography>
                ) : (
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                    {categoryAdditionals.map((additional) => (
                      <Chip
                        key={additional.id}
                        label={`${additional.additionalName} · ${moneyMask(Number(additional.additionalPrice))}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                )}
                <Typography
                  variant="caption"
                  sx={{ color: "#6b7280", mt: 1, display: "block" }}
                >
                  Para escolher uma lista específica, desative a opção acima.
                </Typography>
              </Paper>
            ) : c.additionals.length === 0 ? (
              <Paper
                elevation={0}
                sx={{ p: 1.5, border: "1px solid #E5E7EB", borderRadius: 2 }}
              >
                <Typography sx={{ color: "#64748B", fontSize: "0.9rem" }}>
                  Nenhum adicional cadastrado. Cadastre os adicionais na aba Adicionais.
                </Typography>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  border: "1px solid #E5E7EB",
                  borderRadius: 2,
                  maxHeight: 260,
                  overflowY: "auto",
                }}
              >
                <Stack spacing={0.5}>
                  {c.additionals.map((additional) => (
                    <FormControlLabel
                      key={additional.id}
                      control={
                        <Checkbox
                          checked={c.selectedAdditionalIds.includes(additional.id)}
                          onChange={() => c.toggleAdditional(additional.id)}
                          disabled={c.isBusy}
                        />
                      }
                      label={
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={{ xs: 0, sm: 1 }}
                          sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {additional.additionalName}
                          </Typography>
                          <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                            {additional.category?.categoryName ?? "Sem categoria"}
                          </Typography>
                          <Typography sx={{ color: "success.main", fontSize: "0.8rem", fontWeight: 700 }}>
                            {moneyMask(Number(additional.additionalPrice))}
                          </Typography>
                        </Stack>
                      }
                      sx={{ mx: 0, width: "100%" }}
                    />
                  ))}
                </Stack>
              </Paper>
            )}

            {!c.useCategoryAdditionals && (
              <Typography variant="caption" sx={{ color: "#6b7280", mt: 1, display: "block" }}>
                {c.selectedAdditionalIds.length} adicional(is) selecionado(s).
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
          variant="outlined"
          color="error"
          size="medium"
          onClick={() => void c.deleteProduct()}
          disabled={c.isBusy}
        >
          {c.isDeleting ? "Excluindo..." : "Excluir"}
        </Button>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={c.handleCancel}
            disabled={c.isBusy}
          >
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
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
