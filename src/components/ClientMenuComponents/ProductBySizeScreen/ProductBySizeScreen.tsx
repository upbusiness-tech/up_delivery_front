import { Box, Button, Card, CardActionArea, CardMedia, Radio, Stack, Tabs, Tab, Typography, IconButton, Checkbox, TextField, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Additionals, Product, ProductCategory, Size } from "../../../types/Product.type";
import { UseProductBySizeScreenController } from "./UseProductBySizeScreenController";
import { moneyMask } from "../../../utils/masks/mask";
import type { OrderItemBag } from "../../../types/Order.type";

interface ProductsBySizeScreenProps {
  size: Size,
  products: Product[];
  category: ProductCategory;
  additionals: Additionals[];
  onBack: () => void;
  onFinish: () => void;
  addProduct: (orderItem: OrderItemBag) => void;
}

export default function ProductsBySizeScreen({size, products, category, additionals, onBack, onFinish, addProduct}: ProductsBySizeScreenProps) {
  const c = UseProductBySizeScreenController(size, category, additionals);

  const singles = c.additionalsByType('single');
  const multiples = c.additionalsByType('multiple');

  const handleNext = () => {
    if (c.isLastFlavor) {
      c.setScreenStep("extras");
    } else {
      c.goToNextFlavor();
    }
  };

  const handleConfirm = () => {
    const orderItem = c.toOrderItem();
    addProduct(orderItem);
    onFinish();
  };

  const renderAdditional = (additional: Additionals, isSingle: boolean) => {
    const isChecked = c.checkedAdditionals.some((a) => a.id === additional.id);
    const Control = isSingle ? Radio : Checkbox;
    return (
      <Card key={additional.id} variant="outlined" sx={{ borderRadius: 3, borderColor: isChecked ? "success.main" : "divider", bgcolor: isChecked ? "success.50" : "background.paper", transition: "border-color 120ms ease, background-color 120ms ease" }}>
        <CardActionArea onClick={() => (isSingle ? c.toggleSingle(additional) : c.toggleMultiple(additional))} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
          <Control color="success" checked={isChecked} sx={{ p: 0, pointerEvents: "none" }} />
          <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{additional.additionalName}</Typography></Box>
          <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700 }}>+ {moneyMask(additional.additionalPrice)}</Typography>
        </CardActionArea>
      </Card>
    );
  };

  const renderSection = (title: string, hint: string, list: Additionals[], isSingle: boolean) => list.length > 0 && (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{hint}</Typography>
      </Stack>
      <Stack spacing={1}>{list.map((a) => renderAdditional(a, isSingle))}</Stack>
    </Box>
  );

  if (c.screenStep === "extras") {
    return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <IconButton onClick={() => c.setScreenStep("flavors")} size="small" aria-label="Voltar">
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">Últimos detalhes</Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Quer adicionar algo?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Adicionais são opcionais</Typography>

          {renderSection("Variação", "Escolha 1", singles, true)}
          {renderSection("Complementos", "Escolha quantos quiser", multiples, false)}

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Alguma observação?</Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.5}}>
            {c.OBSERVATION_SUGGESTIONS.map((suggestion) => (
              <Chip key={suggestion} label={suggestion} onClick={() => c.addSuggestion(suggestion)} variant="outlined" size="small" sx={{ borderRadius: 999 }} />
            ))}
          </Stack>

          <TextField fullWidth multiline minRows={2} placeholder="Ex: sem cebola, bem passado..." value={c.observation} onChange={(e) => c.setObservation(e.target.value)} sx={{ mb: 3 }} />
        </Box>

        <Box sx={{ bgcolor: "background.default", borderTop: "1px solid", borderColor: "grey.200", p: 2 }}>
          <Button fullWidth variant="contained" size="large" onClick={handleConfirm} sx={{ textTransform: "none", borderRadius: 4, bgcolor: "success.main" }}>
            Adicionar à sacola
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <IconButton onClick={onBack} size="small" aria-label="Voltar">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">Tamanho {size.name}</Typography>
        </Box>

        {size.limitFlavors > 1 && (
          <Tabs value={c.currentFlavorIndex} onChange={(_, value) => c.goToFlavorTab(value)} variant="fullWidth" sx={{ mb: 2, minHeight: 0 }}>
            {Array.from({ length: size.limitFlavors }).map((_, index) => (
              <Tab
                key={index}
                value={index}
                disabled={index > 0 && c.selectedFlavors[index - 1] === null}
                label={<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, textTransform: 'none' }}>{c.FLAVOR_LABELS[index] ?? `${index + 1}º sabor`}</Box>}
                sx={{ minHeight: 0, py: 1 }}
              />
            ))}
          </Tabs>
        )}

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Escolha o {c.FLAVOR_LABELS[c.currentFlavorIndex] ?? "sabor"}
        </Typography>

        <Stack spacing={1}>
          {products.map((product) => {
            const price = c.getPriceBySize(product, size.id);
            if (!price) return null;

            const isSelected = c.currentSelection?.id === product.id;

            return (
              <Card key={product.id} variant="outlined" sx={{ borderRadius: 3, borderColor: isSelected ? "success.main" : "divider", bgcolor: isSelected ? "primary.50" : "background.paper", transition: "border-color 120ms ease, background-color 120ms ease", display: "flex", alignItems: "center" }}>
                <CardActionArea onClick={() => c.selectFlavor(product)} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, flex: 1 }}>
                  <Box sx={{ width: { xs: 75, sm: 80 }, height: { xs: 75, sm: 80 }, flexShrink: 0, borderRadius: 2, overflow: "hidden", bgcolor: "grey.100" }}>
                    <CardMedia component="img" image={product.image} alt={size.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap title={product.productName}>{product.productName}</Typography>
                    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>{product.productDescription}</Typography>
                    <Typography variant="body1" color="success" sx={{mt: 0.5, fontWeight: 600}}>{moneyMask(price)}</Typography>
                  </Box>
                </CardActionArea>
                <Radio color="success" checked={isSelected} onChange={() => c.selectFlavor(product)} sx={{ mr: 1.5, flexShrink: 0 }} />
              </Card>
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ position: "sticky", bottom: 0, bgcolor: "background.default", borderTop: "1px solid", borderColor: "grey.200", p: 2 }}>
        <Button color="success" fullWidth variant="contained" size="large" disabled={!c.currentSelection} onClick={handleNext} sx={{ textTransform: "none", borderRadius: 4, bgcolor: c.isLastFlavor ? "success.main" : "primary.main" }}>
          {c.isLastFlavor ? "Continuar" : "Próximo sabor"}
        </Button>
      </Box>
    </Box>
  );
}