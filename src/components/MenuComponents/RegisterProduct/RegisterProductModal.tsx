import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Select, Stack, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import imagemGenerica from '../../../assets/imgNull.png'
import UseModalRegisterProduct from "./UseModalRegisterProduct";


interface props {
  open: boolean;
  onClose: () => void;
}


export default function RegisterProductModal({open, onClose }: props) {

  const {
    fileInputRef,
    imagePreview,
    manySizes,
    sizesData,
    categories,
    handleSetManySizes,
    handleImageClick,
    handleImageChange,
    productName,
    setProductName,
    productCategory,
    setProductCategory,
    setProductDescription,
    productDescription,
    createProduct,
    handleSetSizePrice,
    commonPrice,
    setCommonPrice,
    sizePrices,
    isCreating,
    createError,
    formError,
    closeAndReset,
  } = UseModalRegisterProduct({ onClose })
  const isMobile = useMediaQuery("(max-width:599.95px)");

  return (
    <Dialog
      open={open}
      onClose={isCreating ? undefined : closeAndReset}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body1">Informações do produto</Typography>
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
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Box
                component="img"
                src={imagePreview || imagemGenerica}
                onClick={handleImageClick}
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
                onClick={handleImageClick}
                sx={{ color: "#6b7280", cursor: "pointer" }}
              >
                Selecione uma imagem
              </Typography>
            </Box>
            </Box>
            <Stack spacing={1} sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Nome
                </Typography>
                <TextField
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
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
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
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
                  fullWidth
                  value={productCategory ?? ""}
                  displayEmpty
                  onChange={(event) => setProductCategory(event.target.value)}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: "#9ca3af" }}>Selecione uma categoria</Typography>;
                    }
                    const found = categories.find((cat) => cat.id === selected);
                    return found?.categoryName;
                  }}
                  >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>
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
                <Switch checked={manySizes} onChange={handleSetManySizes}/>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ flex: { xs: 1, sm: '0 0 160px' }, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>Tamanho</Typography>
                </Box>
                <Box sx={{ flex: { xs: 1, sm: '0 0 120px' }, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>Preço</Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, width: 120 }}>
                </Box>
              </Stack>
                
              {!manySizes && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
                  <TextField
                    value="COMUM"
                    size="small"
                    sx={{ flex: { xs: 1, sm: '0 0 160px' }, minWidth: 0 }}
                    disabled
                  />
                  <TextField
                    value={commonPrice}
                    onChange={(e) => setCommonPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="R$ 0,00"
                    size="small"
                    type="number"
                    sx={{ flex: { xs: 1, sm: '0 0 120px' }, minWidth: 0 }}
                    slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                  />
                </Stack>
              )}

              {manySizes && (
                <Stack spacing={1} sx={{mt: 1}}>
                  {sizesData.filter((s) => s.name !== "COMUM").map((s, index) => (
                    <Stack key={index} direction="row" spacing={1} sx={{alignItems: 'center'}}>
                      <TextField
                        value={s.name}
                        size="small"
                        sx={{ flex: { xs: 1, sm: '0 0 160px' }, minWidth: 0 }}
                        disabled
                      />
                      <TextField
                        placeholder="R$ 0,00"
                        size="small"
                        type="number"
                        sx={{ flex: { xs: 1, sm: '0 0 120px' }, minWidth: 0 }}
                        value={sizePrices[s.id] ?? ""}
                        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                        onChange={(e) =>
                          handleSetSizePrice(
                            s.id,
                            e.target.value === "" ? undefined : Number(e.target.value)
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
        {(formError || createError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {formError ?? "Não foi possível salvar o produto. Tente novamente."}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
            variant="contained"
            color="inherit"
            size="medium"
            onClick={closeAndReset}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
            variant="contained"
            color="success"
            size="medium"
            onClick={createProduct}
            disabled={isCreating || !productName.trim() || !productCategory}
          >
            {isCreating ? "Salvando..." : "Salvar Produto"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}