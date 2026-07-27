import { Box, Card, CardActionArea, CardMedia, Stack, Typography } from "@mui/material";
import genericImage from "../../../assets/capa.avif"
import type { Size } from "../../../types/Product.type";

interface SizeCardProps {
  size: Size;
  cat: string;
  onClick: (size: Size) => void;
}

export default function SizeCard({ size, cat, onClick }: SizeCardProps) {
  return (
    <Card onClick={() => onClick(size)} sx={{ display: "flex", cursor: "pointer", overflow: "hidden", boxShadow: 0, mb: 1}}>
      <CardActionArea sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} sx={{flexWrap: "wrap", gap: 1, alignItems: "center" }}>
          <Stack sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{cat}{' '}{size.name}</Typography>
            <Typography variant="body2">0{size.limitFlavors} opções de sabores</Typography>
          </Stack>
        </Stack>
      </CardActionArea>
      <Box sx={{ position: "relative", width: { xs: 110, sm: 140 }, flexShrink: 0 }}>
        <CardMedia component="img" image={genericImage} alt={size.name} sx={{ height: "100%", objectFit: "cover" }} />
      </Box>
    </Card>
  );
}