import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { UseMenuScreenController } from "./UseMenuScreenController";
import RestaurantInfo from "../RestaurantInfo/RestaurantInfo";
import ProductCard from "../ProductCard/ProductCard";
import { InputAdornment, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ProductSheet from "../ProductSheet/ProductSheet";
import SizeCard from "../SizeCard/SizeCard";
import { CartBar } from "../CartBar/CartBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckout } from "../../../checkout/CheckoutContext";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { usePublicRestaurantIsOpen } from "../../../hooks/usePublicRestaurantIsOpen";
import { publicPaths } from "../../../routes/paths";

export default function MenuScreen() {

  const {
    activeTab,
    handleTabClick,
    produtosComuns,
    sectionRefs,
    sizesByCategory,
    visibleCategories,
    PRODUCTS,
    onSelectProduct,
    productSelected,
    handleCloseProductSheet,
    search,
    setSearch
  } = UseMenuScreenController();

  const { slug } = usePublicRestaurant();
  const { products, subtotal } = useCheckout()
  const navigate = useNavigate();
  const location = useLocation();
  const { data: restaurantIsOpen } = usePublicRestaurantIsOpen(slug);

  const redirectedBecauseClosed = Boolean(
    (location.state as { restaurantClosed?: boolean } | null)?.restaurantClosed,
  );
  const [closedDialogOpen, setClosedDialogOpen] = useState(redirectedBecauseClosed);

  useEffect(() => {
    if (redirectedBecauseClosed) setClosedDialogOpen(true);
  }, [redirectedBecauseClosed]);

  const openClosedDialog = () => setClosedDialogOpen(true);

  const closeClosedDialog = () => {
    setClosedDialogOpen(false);
    if (redirectedBecauseClosed) {
      navigate(location.pathname, { replace: true, state: null });
    }
  };

  const navigateOrWarnClosed = (to: string) => {
    if (restaurantIsOpen === false) {
      openClosedDialog();
      return;
    }
    navigate(to);
  };

  const handleProductClick = (product: (typeof PRODUCTS)[number]) => {
    if (!product.productActive) return;
    if (restaurantIsOpen === false) {
      openClosedDialog();
      return;
    }
    onSelectProduct(product);
  };

  return (
    <Box sx={{minHeight: "100vh" }}>
      
      <RestaurantInfo />

      <Box sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "grey.200", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
        <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 }, pt: 1 }}>
          <TextField fullWidth size="small" placeholder="Buscar no cardápio..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>, endAdornment: search && <InputAdornment position="end"><IconButton size="small" aria-label="Limpar busca" onClick={() => setSearch("")}><CloseIcon fontSize="small" /></IconButton></InputAdornment> } }} />
        </Container>
        <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
          <Tabs
            value={activeTab || false}
            onChange={(_, value) => handleTabClick(value)}
            variant="scrollable"
            scrollButtons={false}
            slotProps={{ indicator: { sx: { height: 3, borderRadius: 999, bgcolor: "success.main" } } }}
          >
            {visibleCategories.map((cat) => (
              <Tab key={cat.id} value={cat.id} label={cat.categoryName} sx={{ textTransform: "none", fontWeight: 600, minHeight: 48, "&.Mui-selected": { color: "success.main" } }} />
            ))}
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        {visibleCategories.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {search.trim() ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {search.trim() ? "Tente buscar por outro nome." : "O cardápio ainda não possui produtos."}
            </Typography>
          </Box>
        )}
        {visibleCategories.map((cat, index) => {
          const produtos = produtosComuns(cat.id);
          const tamanhos = sizesByCategory(cat.id);
          const totalItens = produtos.length + tamanhos.length;
          const isLast = index === visibleCategories.length - 1;

          return (
            <Box key={cat.id} id={cat.id} ref={(el: HTMLDivElement | null) => { sectionRefs.current[cat.id] = el; }} sx={{ mb: 3, pb: 3, scrollMarginTop: 64, borderBottom: isLast ? "none" : "1px dashed", borderColor: "grey.200" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 4, height: 22, borderRadius: 999, bgcolor: "success.main", flexShrink: 0 }} />
                <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {cat.categoryName}
                </Typography>
                <Typography variant="caption" sx={{ color: "white", fontWeight: 600, bgcolor: "#c90303", borderRadius: 999, px: 1, py: 0.25 }}>
                  {totalItens}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                {produtos.map((product) => (
                  // So vai ser usado para produtos com 1 flavor
                  // Clica no ProductCard -> Abre o ProductSheet -> 
                  // Se o usuario confirmar -> Tranforma o Product em um OrderItemBag ->
                  // Adicona o produto como OrderItemBag no array de itens para requisição
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    unavailable={!product.productActive} 
                    onClick={() => {
                      handleProductClick(product);
                    }} />
                ))}

                {tamanhos.map(({ size, priceFrom, image }) => (
                  <SizeCard
                    key={size.id}
                    size={size}
                    categoryName={cat.categoryName}
                    priceFrom={priceFrom}
                    image={image}
                    onClick={() => navigateOrWarnClosed(publicPaths.size(slug, cat.id, size.id))}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Container>
      <ProductSheet item={productSelected} onClose={handleCloseProductSheet}/>
      <CartBar itemCount={products.length} subtotal={subtotal} onClick={() => navigateOrWarnClosed(publicPaths.cart(slug))} />

      <Dialog open={closedDialogOpen} onClose={closeClosedDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Restaurante fechado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O restaurante está fechado neste momento. Você pode consultar o cardápio,
            mas não é possível fazer pedidos agora.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeClosedDialog}
            variant="contained"
            color="success"
            sx={{ textTransform: "none", borderRadius: 999, fontWeight: 700 }}
          >
            Entendi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}