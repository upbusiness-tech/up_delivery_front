import { Box, Container, Paper, Typography } from "@mui/material";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";
import { BackHeader } from "../BackHeader/BackHeader";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { CartItem } from "./CartScreenComponents/CartItem";
import Row from "../Row";
import { moneyMask } from "../../../utils/masks/mask";

export function CartScreen() {

  const { products, removeProduct, subtotal } = useCart()
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader title="Cardápio" onBack={() => navigate(-1)}/>
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
          <ScreenFooterActions nextPage={() => navigate(-1)} />
        </Container>
      ) : (
        <>
          <Box sx={{ flex: 1, overflowY: "auto", py: 1.5 }}>
            <Container maxWidth="sm">
              <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600 }}>
                Itens do pedido:
              </Typography>
              {products.map((it) => (
                <CartItem
                  key={it.id}
                  item={it}
                  remove={() => removeProduct(it.id)}
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
              <ScreenFooterActions nextPageLabel="Próximo" viewNextPage={true}  nextPage={() =>navigate('/address')}  />
            </Container>
          </Box>
        </>
      )}
    </Box>
  );
}