import { Box, Container, Paper, Typography } from "@mui/material";
import { CartItem } from "./CartScreenComponents/CartItem";
import type { OrderItemBag } from "../../../types/Order.type";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";
import Row from "../Row";
import { moneyMask } from "../../../utils/masks/mask";
import { BackHeader } from "../BackHeader/BackHeader";

interface props {
  items: OrderItemBag[];
  onBack: () => void;
  onNext: () => void;
  removeItem: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  increaseQuantity: (id: string) => void;
  total: number
}

export function CartScreen({items, total, onBack, onNext, removeItem, decreaseQuantity, increaseQuantity}: props) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Cardápio"/>
      {items.length === 0 ? (
        <Container maxWidth="sm" sx={{ py: 2, flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ textAlign: "center", py: 8, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Sua sacola está vazia
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Adicione itens do cardápio para continuar.
            </Typography>
          </Box>
          <ScreenFooterActions onBack={onBack} onNext={onNext} nextDisabled={items.length === 0} />
        </Container>
      ) : (
        <>
          <Box sx={{ flex: 1, overflowY: "auto", py: 1.5 }}>
            <Container maxWidth="sm">
              <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600 }}>
                Itens do pedido:
              </Typography>
              {items.map((it) => (
                <CartItem
                  key={it.id}
                  item={it}
                  removeItem={() => removeItem(it.id)}
                  increaseQuantity={() => increaseQuantity(it.id)}
                  decreaseQuantity={() => decreaseQuantity(it.id)}
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
                <Row label="Subtotal" value={moneyMask(total)} bold color="#008000" />
              </Paper>
              <ScreenFooterActions onBack={onBack} onNext={onNext} />
            </Container>
          </Box>
        </>
      )}
    </Box>
  );
}