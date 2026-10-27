import { Box, Card, CardActionArea, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Size } from "../../../types/Product.type";
import FlavorPizzaIcon from "./FlavorPizzaIcon";

interface FlavorCountScreenProps {
  size: Size;
  categoryName?: string;
  onBack: () => void;
  onChoose: (count: number) => void;
}

const describe = (count: number) =>
  count === 1 ? "Um único sabor" : `Dividida em ${count} partes iguais, com um sabor em cada parte`;

const fraction = (count: number) =>
  count === 1 ? "Inteira" : Array(count).fill(`1/${count}`).join(" + ");

/** Escolha de quantos sabores o cliente quer em um tamanho com múltiplos sabores. */
export default function FlavorCountScreen({ size, categoryName, onBack, onChoose }: FlavorCountScreenProps) {
  const maxFlavors = Math.max(1, size.limitFlavors);
  const options = Array.from({ length: maxFlavors }, (_, index) => index + 1);
  const title = `${categoryName ?? ""} ${size.name}`.trim();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 640,
        mx: "auto",
      }}
    >
      <Box sx={{ flex: 1, p: 2, pb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <IconButton onClick={onBack} size="small" aria-label="Voltar">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Quantos sabores?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Escolha até {maxFlavors} sabores para {title}. Na próxima tela você seleciona cada um.
        </Typography>

        <Stack spacing={1.5}>
          {options.map((count) => (
            <Card key={count} variant="outlined" sx={{ borderRadius: 3, borderColor: "divider" }}>
              <CardActionArea
                onClick={() => onChoose(count)}
                sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 2 }}
              >
                <FlavorPizzaIcon count={count} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {count} {count === 1 ? "sabor" : "sabores"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                    {describe(count)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700 }}>
                    {fraction(count)}
                  </Typography>
                </Box>
                <ChevronRightIcon color="action" />
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
