import { Box, IconButton, Typography, Card, Button, Chip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { OrderItemBag } from "../../../../types/Order.type";
import { moneyMask } from "../../../../utils/masks/mask";

interface Props {
  item: OrderItemBag;
  removeItem: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
}

export function CartItem({ item, removeItem, increaseQuantity, decreaseQuantity }: Props) {
  const hasAdditionals = item.additionals && item.additionals.length > 0;
  const additionalsSum = hasAdditionals ? item.additionals?.reduce((sum, ad) => sum + ad.additionalPrice, 0) : 0;
  const subtotal = item.price + (additionalsSum || 0);
  const total = subtotal * item.quantity;
  return (
    <Card sx={{ p: 1.5, mb: 1, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid", borderColor: "grey.200", transition: "box-shadow 0.2s ease, border-color 0.2s ease", "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.08)", borderColor: "grey.300" } }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Box component="img" src={item.image} alt={item.name} sx={{ width: 84, height: 84, borderRadius: 3, objectFit: "cover", display: "block" }} />
          <Box sx={{ position: "absolute", top: -8, right: -8, minWidth: 22, height: 22, px: 0.5, borderRadius: "999px", bgcolor: "success.main", color: "success.contrastText", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, boxShadow: "0 0 0 1px #fff" }}>
            {item.quantity}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>
            {item.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {moneyMask(item.price)} cada
          </Typography>

          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "success.main", lineHeight: 1.2 }}>
            {moneyMask(total)}
          </Typography>
        </Box>
      </Box>

      {hasAdditionals && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed", borderColor: "grey.200" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.75 }}>
            Adicionais
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {item.additionals?.map((additional) => (
              <Chip
                key={additional.id}
                label={`${additional.additionalName} · +${moneyMask(additional.additionalPrice)}`}
                size="small"
                sx={{ bgcolor: "success.50", color: "success.dark", fontWeight: 600, borderRadius: 999, "& .MuiChip-label": { px: 1.25 } }}
              />
            ))}
          </Box>
        </Box>
      )}

      {item.observation && (
        <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary", fontStyle: "italic" }}>
          Obs: {item.observation}
        </Typography>
      )}

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5, pt: 1, borderTop: "1px dashed", borderColor: "grey.500", flexWrap: "wrap" }}>
        <Button size="small" onClick={removeItem} startIcon={<DeleteOutlineIcon fontSize="small" />} sx={{ color: "#910404", textTransform: "none" }} />

        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "grey.100", borderRadius: 999, p: 0.5, gap: 0.5 }}>
          <IconButton size="small" onClick={decreaseQuantity} sx={{ bgcolor: "background.paper", width: 30, height: 30, boxShadow: "0 1px 2px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "grey.200" } }}>
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography sx={{ width: 26, textAlign: "center", fontWeight: 700, fontSize: 14 }}>
            {item.quantity}
          </Typography>

          <IconButton size="small" onClick={increaseQuantity} sx={{ bgcolor: "success.main", color: "success.contrastText", width: 30, height: 30, "&:hover": { bgcolor: "success.dark" }, "&.Mui-disabled": { bgcolor: "grey.300", color: "grey.500" } }}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}