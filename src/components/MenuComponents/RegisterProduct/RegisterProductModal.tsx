import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import imagemGenerica from '../../../assets/capa.avif'
import UseModalRegisterProduct from "./UseModalRegisterProduct";


interface props {
  open: boolean;
  onClose: () => void;
}


export default function RegisterProductModal({open, onClose }: props) {

  const c = UseModalRegisterProduct()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="file"
                accept="image/*"
                ref={c.fileInputRef}
                onChange={c.handleImageChange}
                style={{ display: "none" }}
              />
              <Box
                component="img"
                src={c.imagePreview || imagemGenerica}
                onClick={c.handleImageClick}
                sx={{
                  width: 137,
                  height: 137,
                  borderRadius: 2,
                  objectFit: "cover",
                  flexShrink: 0,
                  bgcolor: "#f3f4f6",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
              <Typography
                variant="caption"
                onClick={c.handleImageClick}
                sx={{ color: "#6b7280", cursor: "pointer" }}
              >
                Selecione uma imagem
              </Typography>
            </Box>
            </Box>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Nome
                </Typography>
                <TextField
                  value={c.productName}
                  onChange={(e) => c.setProductName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Ex: X-Burguer Especial"
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
                  placeholder="Ex: Pão brioche, hambúrguer 180g, queijo e molho especial"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Categoria
                </Typography>
               <Select
                  size="small"
                  value={c.productCategory ?? ""}
                  displayEmpty
                  onChange={(event) => c.setProductCategory(event.target.value)}
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
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
           <Stack sx={{py: 1}}>
              <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="subtitle2" gutterBottom>
                  Tamanhos e preços
                </Typography>
              </Stack>

              <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="subtitle2" gutterBottom>
                  Esse produto vai aceitar mais de um tamanho?
                </Typography>
                <Switch checked={c.manySizes} onChange={c.handleSetManySizes}/>
              </Stack>

              <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                <Box sx={{width: 160}}>
                  <Typography variant="caption" sx={{color: '#6b7280'}}>Tamanho</Typography>
                </Box>
                <Box sx={{width: 120}}>
                  <Typography variant="caption" sx={{color: '#6b7280'}}>Preço</Typography>
                </Box>
                <Box sx={{width: 120}}>
                </Box>
              </Stack>
                
              {!c.manySizes && (
                <Stack direction="row" spacing={1} sx={{mt: 1, alignItems: 'center'}}>
                  <TextField value="COMUM" size="small" sx={{width: 160}} disabled />
                  <TextField value={c.commonPrice} onChange={(e) => c.setCommonPrice(Number(e.target.value))} placeholder="R$ 0,00" size="small" sx={{width: 120}}
                  />
                </Stack>
              )}

              {c.manySizes && (
                <Stack spacing={1} sx={{mt: 1}}>
                  {c.SIZES.filter((s) => s.name !== "COMUM").map((s, index) => (
                    <Stack key={index} direction="row" spacing={1} sx={{alignItems: 'center'}}>
                      <TextField value={s.name} size="small" sx={{width: 160}} disabled />
                      <TextField placeholder="R$ 0,00" size="small" sx={{width: 120}}
                        value={c.sizePrices[s.id] ?? ""}
                        onChange={(e) => 
                          c.handleSetSizePrice(
                            s.id,
                            Number(e.target.value)
                          )
                        } 
                      />
                    </Stack>
                  ))}
                </Stack>
              )}
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
            onClick={c.createProduct}
          >
            Salvar Produto
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}