import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  Radio,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import type { Additionals, Product, ProductCategory, Size } from "../../../types/Product.type";
import type { OrderItemBag } from "../../../types/Order.type";
import { UseProductBySizeScreenController } from "./UseProductBySizeScreenController";
import { UseProductSearch } from "../../../hooks/useProductSearch";
import { moneyMask } from "../../../utils/masks/mask";

interface ProductBySizeScreenProps {
  size: Size;
  products: Product[];
  category: ProductCategory;
  additionals: Additionals[];
  initialItem?: OrderItemBag;
  onBack: () => void;
  onFinish: () => void;
  saveProduct: (orderItem: OrderItemBag) => void;
}

/** Seleção dos sabores de um tamanho e, depois, adicionais e observação. */
export default function ProductBySizeScreen({
  size,
  products,
  category,
  additionals,
  initialItem,
  onBack,
  onFinish,
  saveProduct,
}: ProductBySizeScreenProps) {
  const c = UseProductBySizeScreenController(
    size,
    category,
    additionals,
    products,
    initialItem,
  );
  const { search, setSearch, filteredProducts } = UseProductSearch(products);

  const visibleFlavors = filteredProducts.filter(
    (product) => c.getPriceBySize(product, size.id) !== undefined,
  );

  useEffect(() => {
    setSearch("");
  }, [size.id, setSearch]);

  const singles = c.additionalsByType("single");
  const multiples = c.additionalsByType("multiple");

  const handleNext = () => {
    setSearch("");
    if (c.isLastFlavor) {
      c.setScreenStep("extras");
      return;
    }
    c.goToNextFlavor();
  };

  const handleFlavorTabChange = (index: number) => {
    setSearch("");
    c.goToFlavorTab(index);
  };

  const handleConfirm = () => {
    if (!c.allFlavorsSelected) return;
    saveProduct(c.toOrderItem());
    onFinish();
  };

  const renderAdditional = (additional: Additionals, isSingle: boolean) => {
    const isChecked = c.checkedAdditionals.some((item) => item.id === additional.id);
    const Control = isSingle ? Radio : Checkbox;

    return (
      <Card
        key={additional.id}
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: isChecked ? "success.main" : "divider",
          bgcolor: isChecked ? "rgba(46,125,50,0.08)" : "background.paper",
          transition: "border-color 120ms ease, background-color 120ms ease",
        }}
      >
        <CardActionArea
          onClick={() =>
            isSingle ? c.toggleSingle(additional) : c.toggleMultiple(additional)
          }
          sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
        >
          <Control color="success" checked={isChecked} sx={{ p: 0, pointerEvents: "none" }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {additional.additionalName}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700 }}>
            + {moneyMask(additional.additionalPrice)}
          </Typography>
        </CardActionArea>
      </Card>
    );
  };

  const renderSection = (
    title: string,
    hint: string,
    list: Additionals[],
    isSingle: boolean,
  ) =>
    list.length > 0 && (
      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        </Stack>
        <Stack spacing={1}>{list.map((additional) => renderAdditional(additional, isSingle))}</Stack>
      </Box>
    );

  if (c.screenStep === "extras") {
    return (
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 640,
          mx: "auto",
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <IconButton
              onClick={() => c.setScreenStep("flavors")}
              size="small"
              aria-label="Voltar"
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Últimos detalhes
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 1.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {category.categoryName} {size.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {c.selectedFlavorProducts.map((product) => product.productName).join(" + ")}
            </Typography>
            <Typography variant="body2" sx={{ color: "success.main", fontWeight: 700, mt: 0.5 }}>
              {moneyMask(c.unitPrice)}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Quer adicionar algo?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Adicionais são opcionais
          </Typography>

          {renderSection("Variação", "Escolha 1", singles, true)}
          {renderSection("Complementos", "Escolha quantos quiser", multiples, false)}

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Alguma observação?
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.5 }}>
            {c.OBSERVATION_SUGGESTIONS.map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                onClick={() => c.addSuggestion(suggestion)}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 999 }}
              />
            ))}
          </Stack>

          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Ex: sem cebola, cortar em 8 pedaços..."
            value={c.observation}
            onChange={(event) => c.setObservation(event.target.value)}
            sx={{ mb: 3 }}
          />
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "grey.200",
            p: 2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConfirm}
            sx={{
              textTransform: "none",
              borderRadius: 4,
              bgcolor: "success.main",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: "success.dark", boxShadow: "none" },
            }}
          >
            {initialItem ? "Salvar alterações" : "Adicionar"} · {moneyMask(c.totalPrice)}
          </Button>
        </Box>
      </Box>
    );
  }

  const title = c.flavorCount > 1 ? `Escolha o ${c.FLAVOR_LABELS[c.currentFlavorIndex]}` : "Escolha o sabor";

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 640,
        mx: "auto",
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <IconButton onClick={onBack} size="small" aria-label="Voltar">
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {category.categoryName} {size.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {c.flavorCount > 1 ? `Escolha ${c.flavorCount} sabores` : "Escolha o sabor"}
            </Typography>
          </Box>
        </Box>

        {c.flavorCount > 1 && (
          <Tabs
            value={c.currentFlavorIndex}
            onChange={(_, value) => handleFlavorTabChange(value)}
            variant="fullWidth"
            sx={{ mb: 2, minHeight: 0 }}
          >
            {Array.from({ length: c.flavorCount }).map((_, index) => (
              <Tab
                key={index}
                value={index}
                disabled={index > 0 && c.selectedFlavors[index - 1] === null}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textTransform: "none",
                    }}
                  >
                    <Typography component="span" variant="caption" sx={{ fontWeight: 700 }}>
                      {c.FLAVOR_LABELS[index]}
                    </Typography>
                    {c.selectedFlavors[index] && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="success.main"
                        noWrap
                        sx={{ maxWidth: 110, fontSize: 10 }}
                      >
                        {c.selectedFlavors[index]?.productName}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ minHeight: 0, py: 1 }}
              />
            ))}
          </Tabs>
        )}

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {title}
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar sabor..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Limpar busca"
                    onClick={() => setSearch("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />

        {visibleFlavors.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {search
                ? `Nenhum sabor encontrado para “${search}”.`
                : "Nenhum sabor disponível para este tamanho."}
            </Typography>
            {search && (
              <Button
                size="small"
                onClick={() => setSearch("")}
                sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
              >
                Limpar busca
              </Button>
            )}
          </Box>
        ) : (
          <Stack spacing={1}>
            {visibleFlavors.map((product) => {
              const price = c.getPriceBySize(product, size.id);
              if (price === undefined) return null;

              const isSelected = c.currentSelection?.id === product.id;
              const isAlreadySelected = c.isFlavorSelectedElsewhere(product.id);

              return (
                <Card
                  key={product.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: isSelected ? "success.main" : "divider",
                    bgcolor: isSelected ? "rgba(46,125,50,0.08)" : "background.paper",
                    opacity: isAlreadySelected ? 0.55 : 1,
                    transition: "border-color 120ms ease, background-color 120ms ease",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CardActionArea
                    disabled={isAlreadySelected}
                    onClick={() => c.selectFlavor(product)}
                    sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, flex: 1 }}
                  >
                    <Box
                      sx={{
                        width: { xs: 75, sm: 80 },
                        height: { xs: 75, sm: 80 },
                        flexShrink: 0,
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "grey.100",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.productName}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600 }}
                        noWrap
                        title={product.productName}
                      >
                        {product.productName}
                      </Typography>
                      <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                        {product.productDescription}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="success"
                        sx={{ mt: 0.5, fontWeight: 600 }}
                      >
                        {moneyMask(price)}
                      </Typography>
                      {isAlreadySelected && (
                        <Chip
                          label="Já escolhido"
                          size="small"
                          sx={{ mt: 0.5, height: 20, fontSize: 10 }}
                        />
                      )}
                    </Box>
                  </CardActionArea>
                  <Radio
                    color="success"
                    checked={isSelected}
                    disabled={isAlreadySelected}
                    onChange={() => c.selectFlavor(product)}
                    sx={{ mr: 1.5, flexShrink: 0 }}
                  />
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "grey.200",
          p: 2,
        }}
      >
        <Button
          color="success"
          fullWidth
          variant="contained"
          size="large"
          disabled={c.isLastFlavor ? !c.allFlavorsSelected : !c.currentSelection}
          onClick={handleNext}
          sx={{
            textTransform: "none",
            borderRadius: 4,
            bgcolor: "success.main",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": { bgcolor: "success.dark", boxShadow: "none" },
            "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" },
          }}
        >
          {c.isLastFlavor ? "Continuar" : "Próximo sabor"}
        </Button>
      </Box>
    </Box>
  );
}
