import { useState } from "react";
import { Alert, Box, Container, Paper, Snackbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CHECKOUT_TOTAL_STEPS, useCheckout } from "../../../checkout/CheckoutContext";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { publicPaths } from "../../../routes/paths";
import { moneyMask } from "../../../utils/masks/mask";
import { RestaurantService } from "../../../api/services/restaurant.service";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";
import type { OrderItemBag } from "../../../types/Order.type";
import { BackHeader } from "../BackHeader/BackHeader";
import ProductSheet from "../ProductSheet/ProductSheet";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";
import { CartItem } from "./CartScreenComponents/CartItem";
import Row from "../Row";

/** Passo 1 do checkout: revisão do carrinho. */
export function CartScreen() {
  const { products, removeProduct, subtotal } = useCheckout();
  const { slug } = usePublicRestaurant();
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState<OrderItemBag | null>(null);
  const [editError, setEditError] = useState(false);

  const { data: menuProducts = [] } = useRestaurantData(
    () => RestaurantService.restaurantProductsPublic(slug),
    QueryCacheName.PRODUCTS_PUBLIC,
    slug,
  );

  const editingProduct = editingItem
    ? menuProducts.find((product) => product.id === editingItem.id)
    : undefined;

  const goToMenu = () => navigate(publicPaths.menu(slug));

  const handleEdit = (item: OrderItemBag) => {
    // Produto simples: o ProductSheet consegue reabrir com as escolhas atuais.
    const product = menuProducts.find((menuProduct) => menuProduct.id === item.id);

    if (product) {
      setEditingItem(item);
      return;
    }

    // Item montado por tamanho (pizza): reabre a tela de sabores/adicionais.
    const flavorProduct = menuProducts.find((menuProduct) =>
      menuProduct.sizes.some((productSize) => item.flavors.includes(productSize.id)),
    );
    const flavorProductSize = flavorProduct?.sizes.find((productSize) =>
      item.flavors.includes(productSize.id),
    );
    const categoryId = item.categoryId ?? flavorProduct?.productCategory.id;
    const sizeId = item.sizeId ?? flavorProductSize?.size.id;

    if (!categoryId || !sizeId || item.flavors.length === 0) {
      setEditError(true);
      return;
    }

    navigate(publicPaths.sizeFlavors(slug, categoryId, sizeId, item.flavors.length), {
      state: { editingItemId: item.id },
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader title="Sua sacola" step={1} totalSteps={CHECKOUT_TOTAL_STEPS} onBack={goToMenu} />
      {products.length === 0 ? (
        <Container maxWidth="sm" sx={{ py: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ textAlign: "center", py: 8, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Sua sacola está vazia
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Adicione itens do cardápio para continuar.
            </Typography>
          </Box>
          <ScreenFooterActions onBack={goToMenu} />
        </Container>
      ) : (
        <>
          <Box sx={{ flex: 1, overflowY: "auto", py: 1.5 }}>
            <Container maxWidth="sm">
              <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600 }}>
                Itens do pedido:
              </Typography>
              {products.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  remove={() => removeProduct(item.id)}
                  onEdit={() => handleEdit(item)}
                />
              ))}
            </Container>
          </Box>

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.default",
            }}
          >
            <Container maxWidth="sm">
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 4,
                  mb: 1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  border: "1px solid",
                  borderColor: "grey.200",
                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                }}
              >
                <Row label="Subtotal" value={moneyMask(subtotal)} bold color="#008000" />
              </Paper>
              <ScreenFooterActions
                onBack={goToMenu}
                onNext={() => navigate(publicPaths.customer(slug))}
                nextLabel="Continuar"
              />
            </Container>
          </Box>
        </>
      )}

      <ProductSheet
        item={editingProduct}
        initialItem={editingItem ?? undefined}
        onClose={() => setEditingItem(null)}
      />

      <Snackbar
        open={editError}
        autoHideDuration={3000}
        onClose={() => setEditError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setEditError(false)}>
          Não foi possível editar este item.
        </Alert>
      </Snackbar>
    </Box>
  );
}
