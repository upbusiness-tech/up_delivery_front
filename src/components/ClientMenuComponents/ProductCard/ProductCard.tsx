import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import type {Product } from "../../../types/Product.type";
import genericImage from "../../../assets/capa.avif"

interface props {
  product: Product;
  onClick?: () => void
}

export default function ProductCard({ product, onClick }: props) {

  return (
    <Card onClick={onClick} 
    sx={{ 
      display: "flex", cursor: "pointer", 
      overflow: "hidden",  boxShadow: 0, 
      borderRadius: 3, border: "1px solid",
      borderColor: "grey.200",
    }}>
      <CardContent sx={{ flex: 1, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{product.productName}</Typography>
        <Typography variant="subtitle1" color="primary" sx={{ mt: 1, fontWeight: 700 }}>
            <Typography component="span" color="success" sx={{ mr: 0.5, fontWeight: 600 }}>
              R${(product.sizes[0].price || 0).toFixed(2)}
            </Typography>
        </Typography>
        <Typography variant="caption" sx={{ lineHeight: 1.2 }}>{product.productDescription}</Typography>
      </CardContent>
      <Box sx={{ position: "relative", width: { xs: 110, sm: 140 }, flexShrink: 0 }}>
        <CardMedia component="img" image={genericImage} alt={product.productName} sx={{ height: "100%", objectFit: "cover" }} />
        <IconButton
          size="small"
          sx={{
            position: "absolute", right: 6, bottom: 6, bgcolor: "primary.main", color: "#fff",
            "&:hover": { bgcolor: "primary.dark" }, boxShadow: 2,
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}