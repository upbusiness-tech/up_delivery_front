import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import type { Product } from "../../../../types/Product.type";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import imagemGenerica from '../../../../assets/capa.avif'
import UseProductDetailModalController from "./UseProductDetailModalController";
import LoadingModal from "../../../LoadingModal/GenericModal";
import RegisterProductSizetModal from "../RegisterProductSize.tsx/RegisterProductSizeModal";
import ProductsSizesTable from "../TableProducts/ProductsSizesTable";

interface props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: props) {
  if (!product) {
    return null;
  }

  const c = UseProductDetailModalController({product})

  return (
    <Dialog open={!!product} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Informações do produto</Typography>
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
            <Box
              component="img"
              src={imagemGenerica}
              alt={product.productName}
              sx={{
                width: 140,
                height: 140,
                borderRadius: 2,
                objectFit: "cover",
                flexShrink: 0,
                bgcolor: "#f3f4f6",
              }}
            />
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Nome
                </Typography>
                <TextField value={product.productName} size="small" fullWidth sx={{ fontWeight: 600 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Descrição
                </Typography>
                <TextField value={product.productDescription} size="small" fullWidth sx={{ fontWeight: 600 }} />
              </Box>
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 2 }}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Categoria
              </Typography>
              <Typography variant="body1">{product.productCategory.categoryName}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Status
              </Typography>
                <Typography variant="body1" sx={{ color: product.productActive ? "success.main" : "#6b7280" }}>
                  {product.productActive ? "Ativo" : "Inativo"}
                </Typography>
            </Grid>


            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Criado em
              </Typography>
              <Typography variant="body1">{c.formattedDate}</Typography>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Stack  sx={{py: 1}}>
              <Stack direction={"row"} sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="subtitle2" gutterBottom>
                  Tamanhos e preços
                </Typography>
                <Button endIcon={<AddIcon/>} sx={{ textTransform: "none" }} variant="contained" color="primary" size="small"
                  onClick={c.handleOpenNewOptionProductSize}
                >
                  Nova opção
                </Button>
              </Stack>
            </Stack>
            <ProductsSizesTable
              sizes={product.sizes}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" sx={{ justifyContent: 'space-between', width: '100%', px: 2}} spacing={1}>
          <Button sx={{ textTransform: "none" }} variant="contained" color="error" size="medium" onClick={c.deleteProduct}>Excluir</Button>
          <Stack direction="row" spacing={1}>
            <Button sx={{ textTransform: "none" }} variant="contained" color="inherit" size="medium" onClick={onClose}>Cancelar</Button>
            <Button sx={{ textTransform: "none" }} variant="contained" color="success" size="medium">Salvar alterações</Button>
          </Stack>
        </Stack>
      </DialogActions>

      <LoadingModal title="Apagando produto" open={c.openLoading} />
      <RegisterProductSizetModal onClose={c.handleCloseNewOptionProductSize} open={c.openNewOptionProductSize} product={product}/>

    </Dialog>
  );
}