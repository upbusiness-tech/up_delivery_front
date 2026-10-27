import { Box, Card, CardActionArea, CardMedia, Chip, Stack, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import genericImage from "../../../assets/capa.jpg";
import type { Size } from "../../../types/Product.type";
import { moneyMask } from "../../../utils/masks/mask";

interface SizeCardProps {
  size: Size;
  categoryName: string;
  priceFrom: number;
  image?: string;
  onClick: () => void;
}

/**
 * Card de um tamanho dentro de uma categoria (ex.: "Pizza P · 2 sabores").
 * Ao clicar, o cliente escolhe quantos sabores e monta o produto.
 */
export default function SizeCard({ size, categoryName, priceFrom, image, onClick }: SizeCardProps) {
  const flavorCount = Math.max(1, size.limitFlavors);

  return (
    <Card sx={{ overflow: "hidden", boxShadow: 0, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
      <CardActionArea
        onClick={onClick}
        sx={{ display: "flex", alignItems: "stretch", justifyContent: "space-between" }}
      >
        <Box sx={{ p: 2, flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {categoryName} {size.name}
            </Typography>
            <Chip
              label={flavorCount === 1 ? "1 sabor" : `${flavorCount} sabores`}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                bgcolor: "rgba(46,125,50,0.12)",
                color: "success.dark",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Monte do seu jeito
          </Typography>

          <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700 }}>
            A partir de {moneyMask(priceFrom)}
          </Typography>
        </Box>

        <Box sx={{ position: "relative", width: { xs: 110, sm: 140 }, flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={image || genericImage}
            alt={`${categoryName} ${size.name}`}
            sx={{ height: "100%", minHeight: 112, objectFit: "cover" }}
          />
          <ChevronRightIcon
            sx={{
              position: "absolute",
              right: 8,
              bottom: 8,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.45)",
              borderRadius: "50%",
              p: 0.25,
            }}
          />
        </Box>
      </CardActionArea>
    </Card>
  );
}
