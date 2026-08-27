import { Box, Button, Card, CardActionArea, Dialog, DialogContent, Drawer, IconButton, Stack, TextField, Typography, Chip } from "@mui/material";
import { Add, Close, Remove, CheckCircle } from "@mui/icons-material";
import type { Additionals, Product, ProductCategory } from "../../../types/Product.type";
import UseProductSheetController from "./UseProductSheetController";
import type { OrderItemBag } from "../../../types/Order.type";
import { moneyMask } from "../../../utils/masks/mask";


interface ProductSheetProps {
  item: Product | undefined;
  addProduct: (item: OrderItemBag) => void,
  category: ProductCategory,
  additionals: Additionals[],
  onClose: () => void
}

export default function ProductSheet({ item, onClose, addProduct, category, additionals }: ProductSheetProps) {
  const c = UseProductSheetController(category, additionals)

  if (!item) {return null}

  const additionalsList = c.additionalsByCategory();
  const additionalsTotal = c.checkedAdditionals.reduce((sum, a) => sum + a.additionalPrice, 0);
  const basePrice = item.sizes[0].price;
  const price = (basePrice + additionalsTotal) * c.qty;

  const body = (
    <Box>
      <Box sx={{ position: "relative" }}>
        <img src={item.image}  alt={item.productName} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
        >
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ p: 2, pb: 5}}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item?.productName}</Typography>
        <Typography variant="caption">{item?.productDescription}</Typography>
        <Typography variant="h6" color="success" sx={{ fontWeight: 700, mb: 2 }}>
          R$ {basePrice.toFixed(2)}
        </Typography>

        {additionalsList.length > 0 && (
          <>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Adicionais
              </Typography>
              {c.checkedAdditionals.length > 0 && (
                <Chip
                  label={`${c.checkedAdditionals.length} selecionado${c.checkedAdditionals.length > 1 ? "s" : ""}`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Stack>

            <Stack spacing={1} sx={{ mb: 3 }}>
              {additionalsList.map((additional) => {
                const isChecked = c.checkedAdditionals.includes(additional);
                return (
                  <Card
                    key={additional.id}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderWidth: isChecked ? 2 : 1,
                      borderColor: isChecked ? "success.main" : "divider",
                      bgcolor: isChecked ? "success.50" : "background.paper",
                      transition: "all 150ms ease",
                    }}
                  >
                    <CardActionArea
                      onClick={() => c.toggleAdditional(additional)}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
                    >
                      {isChecked ? (
                        <CheckCircle sx={{ color: "success.main", fontSize: 24, flexShrink: 0 }} />
                      ) : (
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid", borderColor: "grey.300", flexShrink: 0 }} />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: isChecked ? "success.dark" : "text.primary" }}>
                          {additional.additionalName}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700, flexShrink: 0 }}>
                        + {moneyMask(additional.additionalPrice)}
                      </Typography>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Stack>
          </>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Observações</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Ex: sem cebola, ponto da carne, etc."
            value={c.observation}
            onChange={e => c.setObservation(e.target.value)}
          />
        </Box>
      </Box>

      <Box sx={{ position: "sticky", bottom: 0, bgcolor: "#fff", borderTop: "1px solid #E5E7EB", p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack direction="row" sx={{ border: "1px solid #E5E7EB", borderRadius: 2, alignItems: "center" }}>
            <IconButton size="small" onClick={() => c.setQty(q => Math.max(1, q - 1))}><Remove fontSize="small" /></IconButton>
            <Typography sx={{ px: 1.5, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{c.qty}</Typography>
            <IconButton size="small" onClick={() => c.setQty(q => q + 1)}><Add fontSize="small" /></IconButton>
          </Stack>
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="success"
            sx={{ textTransform: "none", boxShadow: 0, fontWeight: 700 }}
            onClick={() => {
              addProduct(c.toOrderItem(item));
              onClose();
            }}
          >
            Adicionar · R$ {price.toFixed(2)}
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  if (c.isDesktop) {
    return (
      <Dialog open={!!item} onClose={onClose}  maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 0 }}>{body}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      anchor="bottom"
      open={!!item}
      onClose={onClose}
      slotProps={{ paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "92dvh" } } }}
    >
      {body}
    </Drawer>
  );
}