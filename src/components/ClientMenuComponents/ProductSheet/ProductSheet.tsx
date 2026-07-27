import { Box, Button, Dialog, DialogContent, Drawer, IconButton, Stack, TextField, Typography} from "@mui/material";
import { Add, Close, Remove } from "@mui/icons-material";
import type { Product } from "../../../types/Product.type";
import genericImage from "../../../assets/capa.avif"
import UseProductSheetController from "./UseProductSheetController";
import type { OrderItemBag } from "../../../types/Order.type";


interface ProductSheetProps {
  item: Product | undefined;
  addProduct: (item: OrderItemBag) => void,
  onClose: () => void
}

export default function ProductSheet({ item, onClose, addProduct }: ProductSheetProps) {
  const c = UseProductSheetController()

  if (!item) {return null}

  const price = item.sizes[0].price * c.qty

  const body = (
    <Box>
      <Box sx={{ position: "relative" }}>
        <img src={genericImage}  alt={item.productName} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.5)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
        >
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ p: 2, pb: 5}}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{item?.productName}</Typography>
        <Typography variant="h6" color="success" sx={{ fontWeight: 700 }}>R$ {(price).toFixed(2)}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Observações</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Ex: sem cebola, ponto da carne, etc."
            value={c.notes}
            onChange={e => c.setNotes(e.target.value)}
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
            size="medium"
            sx={{textTransform: 'none', backgroundColor: '#e3bc37', boxShadow: 0}}
            onClick={() => {
              addProduct(c.toOrderItem(item));
              onClose();
            }}
          >
            Adicionar
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
