import { Box, Container, Typography, Tabs, Tab } from "@mui/material";
import { UseMenuScreenController } from "./UseMenuScreenController";
import RestaurantInfo from "../RestaurantInfo/RestaurantInfo";
import ProductCard from "../ProductCard/ProductCard";
import { InputAdornment, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { UseProductSearch } from "../../../hooks/useProductSearch";
import ProductSheet from "../ProductSheet/ProductSheet";
import { CartBar } from "../CartBar/CartBar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

export default function MenuScreen() {

  const {
    activeTab,
    handleTabClick,
    produtosComuns,
    sectionRefs,
    tamanhosDaCategoria,
    visibleCategories,
    PRODUCTS,
    onSelectProduct,
    productSelected,
    handleCloseProductSheet
  } = UseMenuScreenController();

  const { search, setSearch } = UseProductSearch(PRODUCTS);
  const { products } = useCart()
  const navigate = useNavigate();

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
            value={activeTab}
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
        {visibleCategories.map((cat, index) => {
          const produtos = produtosComuns(cat.id);
          const tamanhos = tamanhosDaCategoria(cat.id);
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
                      if (!product.productActive) return; 
                      onSelectProduct(product); 
                    }} />
                ))}
                {/* APROVEITAR ESSE SIZE QUE TA SENDO PASSADO AQUI */}
                {/* {tamanhos.map((size) => (
                  <SizeCard key={size.id} size={size} cat={cat.categoryName} onClick={onSelectSize} selectCategory={() => onSelectCategory(cat)} />
                ))} */}
              </Box>
            </Box>
          );
        })}
      </Container>
      <ProductSheet item={productSelected} onClose={handleCloseProductSheet}/>
      <CartBar itemCount={products.length}  onClick={() => navigate("/cart")}/>
    </Box>
  );
}