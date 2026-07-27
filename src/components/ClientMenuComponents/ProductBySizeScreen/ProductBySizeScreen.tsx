import { Box, Button, Card, CardActionArea, CardMedia, Radio, Stack, Tabs, Tab, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Product, Size } from "../../../types/Product.type";
import { UseProductBySizeScreenController } from "./UseProductBySizeScreenController";
import { moneyMask } from "../../../utils/masks/mask";
import genericImage from "../../../assets/capa.avif"
import type { OrderItemBag } from "../../../types/Order.type";

interface ProductsBySizeScreenProps {
  size: Size,
  products: Product[];
  categoryName: string;
  onBack: () => void;
  addProduct: (orderItem: OrderItemBag) => void;
}

const FLAVOR_LABELS = ["1º sabor", "2º sabor", "3º sabor", "4º sabor"];

export default function ProductsBySizeScreen({size, products, categoryName, onBack, addProduct}: ProductsBySizeScreenProps) {

  const c = UseProductBySizeScreenController(size, categoryName);

  const handleNext = () => {
    if (c.isLastFlavor) {
      const orderItem = c.toOrderItem();
      console.log(c.selectedFlavors)
      console.log("Item montado:", orderItem);
      addProduct(orderItem);
      onBack()
    } else {
      c.goToNextFlavor();
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={onBack} size="small" aria-label="Voltar">
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          Tamanho {size.name}
        </Typography>
      </Box>

      {size.limitFlavors > 1 && (
        <Tabs
          value={c.currentFlavorIndex}
          onChange={(_, value) => c.goToFlavorTab(value)}
          variant="fullWidth"
          sx={{ mb: 2, minHeight: 0 }}
        >
          {Array.from({ length: size.limitFlavors }).map((_, index) => {
            const isFilled = c.selectedFlavors[index] !== null;
            return (
              <Tab
                key={index}
                value={index}
                disabled={index > 0 && c.selectedFlavors[index - 1] === null}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {FLAVOR_LABELS[index] ?? `${index + 1}º sabor`}
                    {isFilled && (
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "success.main" }} />
                    )}
                  </Box>
                }
                sx={{ minHeight: 0, py: 1 }}
              />
            );
          })}
        </Tabs>
      )}

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Escolha o {FLAVOR_LABELS[c.currentFlavorIndex]?.toLowerCase() ?? "sabor"}
      </Typography>

      <Stack spacing={1}>
        {products.map((product) => {
          const price = c.getPriceBySize(product, size.id);
          if (!price) return null;

          const isSelected = c.currentSelection?.id === product.id;

          return (
            <Card
              key={product.id}
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: isSelected ? "primary.main" : "divider",
                bgcolor: isSelected ? "primary.50" : "background.paper",
                transition: "border-color 120ms ease, background-color 120ms ease",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardActionArea
                onClick={() => c.selectFlavor(product)}
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, flex: 1 }}
              >
                <Box sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, flexShrink: 0, borderRadius: 2, overflow: "hidden", bgcolor: "grey.100" }}>
                  <CardMedia component="img" image={genericImage} alt={size.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap title={product.productName}>
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {moneyMask(price)}
                  </Typography>
                </Box>
              </CardActionArea>

              <Radio
                checked={isSelected}
                onChange={() => c.selectFlavor(product)}
                sx={{ mr: 1.5, flexShrink: 0 }}
              />
            </Card>
          );
        })}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={!c.currentSelection}
        onClick={handleNext}
        sx={{ mt: 3, textTransform: 'none' }}
      >
        {c.isLastFlavor ? "Confirmar" : "Próximo sabor"}
      </Button>
    </>
  );
}