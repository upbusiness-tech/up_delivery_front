import { Box, Paper, Typography, Button } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

interface Props {
  itemCount: number;
  total?: number;
  onClick?: () => void;
}

export function CartBar({ itemCount, total, onClick }: Props) {
  return (
    <Paper
      elevation={8}
      onClick={onClick}
      sx={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        p: 1.5,
        pl: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "#e3bc37",
        borderRadius: 3,
        cursor: "pointer",
        zIndex: 20,
        maxWidth: 640,
        mx: "auto",
      }}
    >
      <ShoppingBagIcon />
      <Box sx={{ flex: 1 }}>
        <Typography color="black" variant="body2" sx={{ opacity: 0.9 }}>
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </Typography>
        <Typography variant="subtitle1" sx={{ lineHeight: 1 }}>
          R$ {total?.toFixed(2).replace(".", ",")}
        </Typography>
      </Box>
      <Button
        variant="text"
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          color: 'black'
        }}
      >
        Ver sacola
      </Button>
    </Paper>
  );
}
