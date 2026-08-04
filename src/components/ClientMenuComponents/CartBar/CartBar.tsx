import { Box, Paper, Typography, Button } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { moneyMask } from "../../../utils/masks/mask";

interface Props {
  itemCount: number;
  total: number;
  onClick?: () => void;
}

export function CartBar({ itemCount, total, onClick }: Props) {
  if (itemCount === 0) return null;

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{ position: "fixed", left: 16, right: 16, bottom: 16, maxWidth: 640, mx: "auto", zIndex: 20, display: "flex", alignItems: "center", gap: 1.5, py: 1.25, px: 1.5, borderRadius: 3, bgcolor: "#1F1F1F", cursor: "pointer"}}
    >
      <ShoppingBagOutlinedIcon sx={{ color: "success.light", fontSize: 22 }} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "grey.400", fontWeight: 500, lineHeight: 1.2, display: "block" }}>
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 700, lineHeight: 1.2 }}>
          {moneyMask(total)}
        </Typography>
      </Box>

      <Button
        variant="text"
        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
        sx={{ color: "white", textTransform: "none", fontWeight: 600, minWidth: 0, px: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
      >
        Ver sacola
      </Button>
    </Paper>
  );
}