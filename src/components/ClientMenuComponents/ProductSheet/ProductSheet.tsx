import { Box, Button, Card, CardActionArea, Dialog, DialogContent, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add, Close, Remove, RadioButtonChecked, RadioButtonUnchecked, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import type { Additionals, Product } from "../../../types/Product.type";
import UseProductSheetController from "./UseProductSheetController";
import { moneyMask } from "../../../utils/masks/mask";
import { useCheckout } from "../../../checkout/CheckoutContext";
import { useEffect, useRef } from "react";
import type { OrderItemBag } from "../../../types/Order.type";
interface ProductSheetProps {
  item: Product | undefined;
  initialItem?: OrderItemBag;
  onClose: () => void;
}

export default function ProductSheet({ item, initialItem, onClose }: ProductSheetProps) {
  const {
    additionalsByType,
    checkedAdditionals,
    isDesktop,
    observation,
    qty,
    setObservation,
    setQty,
    toOrderItem,
    toggleAdditional
  } = UseProductSheetController(item, initialItem)

  const { addProduct, updateProduct } = useCheckout()

  const singles = additionalsByType('single');
  const multiples = additionalsByType('multiple');

  const renderAdditional = (additional: Additionals, isSingle: boolean) => {
    const isChecked = checkedAdditionals.some((a) => a.id === additional.id);
    const Icon = isSingle ? (isChecked ? RadioButtonChecked : RadioButtonUnchecked) : (isChecked ? CheckBox : CheckBoxOutlineBlank);
    return (
      <Card key={additional.id} variant="outlined" sx={{ borderRadius: 3, borderWidth: isChecked ? 2 : 1, borderColor: isChecked ? "success.main" : "divider", bgcolor: isChecked ? "success.50" : "background.paper", transition: "all 150ms ease" }}>
        <CardActionArea onClick={() => toggleAdditional(additional)} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
          <Icon sx={{ color: isChecked ? "success.main" : "grey.400", fontSize: 24, flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: isChecked ? "success.dark" : "text.primary" }}>{additional.additionalName}</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700, flexShrink: 0 }}>+ {moneyMask(additional.additionalPrice)}</Typography>
        </CardActionArea>
      </Card>
    );
  };

  const renderSection = (title: string, hint: string, list: Additionals[], isSingle: boolean) => list.length > 0 && (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{hint}</Typography>
      </Stack>
      <Stack spacing={1}>{list.map((a) => renderAdditional(a, isSingle))}</Stack>
    </Box>
  );

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!item) return;

    window.history.pushState(
      { ...window.history.state, productSheet: true },
      ""
    );

    const handlePopState = () => closeRef.current();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [item]);

  const closeSheet = () => {
    if (window.history.state?.productSheet) {
      window.history.back();
    } else {
      onClose();
    }
  };

  if (!item) {return null}

  const additionalsTotal = checkedAdditionals.reduce((sum, a) => sum + a.additionalPrice, 0);
  const basePrice = item.sizes[0].price;
  const price = (basePrice + additionalsTotal) * qty;

  const body = (
    <Box>
      <Box sx={{ position: "relative" }}>
        <img src={item.image}  alt={item.productName} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
        <IconButton
          onClick={closeSheet}
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
        >
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ p: 2, pb: 5}}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item?.productName}</Typography>
        <Typography variant="caption">{item?.productDescription}</Typography>
        <Typography variant="caption">{item?.productDescription}</Typography>
        {item.minQuantity > 1 && (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>A partir de 200g</Typography>
        )}
        <Typography variant="h6" color="success" sx={{ fontWeight: 700, mb: 2 }}>
          R$ {basePrice.toFixed(2)}
        </Typography>

        {renderSection("Variação", "Escolha 1", singles, true)}
        {renderSection("Complementos", "Escolha quantos quiser", multiples, false)}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Observações</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Ex: sem cebola, ponto da carne, etc.."
            value={observation}
            onChange={e => setObservation(e.target.value)}
          />
        </Box>
      </Box>

      <Box sx={{ position: "sticky", bottom: 0, bgcolor: "#fff", borderTop: "1px solid #E5E7EB", p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack direction="row" sx={{ border: "1px solid #E5E7EB", borderRadius: 2, alignItems: "center" }}>
            <IconButton size="small" onClick={() => setQty(q => Math.max(item.minQuantity ?? 1, q - 1))}><Remove fontSize="small" /></IconButton>
            <Typography sx={{ px: 1.5, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</Typography>
            <IconButton size="small" onClick={() => setQty(q => q + 1)}><Add fontSize="small" /></IconButton>
          </Stack>
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="success"
            sx={{ textTransform: "none", boxShadow: 0, fontWeight: 700 }}
            onClick={() => {
              const orderItem = toOrderItem(item);
              if (initialItem) {
                updateProduct(orderItem);
              } else {
                addProduct(orderItem);
              }
              closeSheet();
            }}
          >
            {initialItem ? "Salvar alterações" : "Adicionar"} · R$ {price.toFixed(2)}
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  if (isDesktop) {
    return (
      <Dialog open={!!item} onClose={closeSheet} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 0 }}>{body}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      anchor="bottom"
      open={!!item}
      onClose={closeSheet}
      slotProps={{ paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "92dvh" } } }}
    >
      {body}
    </Drawer>
  );
}