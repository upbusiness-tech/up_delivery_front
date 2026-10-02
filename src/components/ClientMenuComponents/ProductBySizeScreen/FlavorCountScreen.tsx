import { Box, Card, CardActionArea, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Size } from "../../../types/Product.type";
import FlavorPizzaIcon from "./FlavorPizzaIcon";




interface FlavorCountScreenProps { size: Size; categoryName?: string; onBack: () => void; onChoose: (count: number) => void; }

const describe = (n: number) => n === 1 ? "Pizza inteira com um único sabor" : `Dividida em ${n} partes iguais, com um sabor em cada parte`;
const fraction = (n: number) => n === 1 ? "Inteira" : Array(n).fill(`1/${n}`).join(" + ");

export default function FlavorCountScreen({ size, categoryName, onBack, onChoose }: FlavorCountScreenProps) {
  const options = Array.from({ length: size.limitFlavors }, (_, i) => i + 1);
  const title = `${categoryName ?? ""} ${size.name}`.trim();

  return (
    <Box sx={{ minHeight: "100dvh", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={onBack} size="small" aria-label="Voltar"><ArrowBackIcon fontSize="small" /></IconButton>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Como você quer sua pizza?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Escolha quantos sabores quer na mesma pizza. Na próxima tela você seleciona cada sabor.</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      <Stack spacing={1.5}>
        {options.map((n) => (
          <Card key={n} variant="outlined" sx={{ borderRadius: 3, borderColor: "divider" }}>
            <CardActionArea onClick={() => onChoose(n)} sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 2 }}>
              <FlavorPizzaIcon count={n} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{n} {n === 1 ? "sabor" : "sabores"}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>{describe(n)}</Typography>
                <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700 }}>{fraction(n)}</Typography>
              </Box>
              <ChevronRightIcon color="action" />
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}