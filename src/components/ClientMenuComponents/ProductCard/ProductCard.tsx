import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import type {Product } from "../../../types/Product.type";

interface props {
  product: Product;
  onClick?: () => void
  unavailable?: boolean;
}

export default function ProductCard({ product, onClick, unavailable }: props) {
  const dim = unavailable ? { opacity: 0.55, filter: "grayscale(1)" } : {};

  return (
    <Card onClick={unavailable ? undefined : onClick} 
      sx={{ 
        display: "flex", 
        cursor: unavailable ? "not-allowed" : "pointer", 
        overflow: "hidden", 
        boxShadow: 0, 
        borderRadius: 3, 
        border: "1px solid", 
        borderColor: "grey.200", 
      }}>
        <CardContent sx={{ flex: 1, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, ...dim }}>{product.productName}</Typography>
          <Typography variant="subtitle1" color="primary" sx={{ mt: 0, fontWeight: 700, ...dim }}>
              <Typography component="span" color="success" sx={{ mr: 0.5, fontWeight: 600 }}>
                R${(product.sizes[0].price || 0).toFixed(2)}
              </Typography>
          </Typography>
          {unavailable && <Typography variant="caption" sx={{ display: "block", color: "#c90303", fontWeight: 700 }}>Esgotado por hoje!</Typography>}
          <Typography variant="caption" sx={{ lineHeight: 1.2, ...dim }}>{product.productDescription}</Typography>
        </CardContent>
        <Box sx={{ position: "relative", width: { xs: 110, sm: 140 }, flexShrink: 0 }}>
          <CardMedia component="img" image={product.image} alt={product.productName} sx={{ height: "100%", objectFit: "cover", ...dim }} />
          {!unavailable && (
            <IconButton size="small" sx={{ position: "absolute", right: 6, bottom: 6, bgcolor: "primary.main", color: "#fff", "&:hover": { bgcolor: "primary.dark" }, boxShadow: 2 }}>
              <Add fontSize="small" />
            </IconButton>
          )}
        </Box>
    </Card>
  );
}