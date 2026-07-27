import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { CartItem } from "./CartScreenComponents/CartItem";
import type { OrderItemBag } from "../../../types/Order.type";

interface props {
  items: OrderItemBag[];
  onBack: () => void;
  onNext: () => void;
  removeItem: (id: string) => void;

}

export function CartScreen({items, onBack, onNext, removeItem}: props) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {items.length == 0 ? (
        <Container maxWidth="sm" sx={{ py: 2, flex: 1 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" gutterBottom>
              Sua sacola está vazia
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Adicione itens do cardápio para continuar.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{backgroundColor: '#e3bc37', boxShadow: 0}}
              onClick={onBack}
            >
              Cardápio
            </Button>
          </Stack>
        </Container>
      ) : (
        <Container maxWidth="sm" sx={{ py: 2, flex: 1, display: "flex", flexDirection: 'column'}}>
          <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600 }}>
            Itens
          </Typography>
          {items.map((it) => (
            <CartItem
              key={it.id}
              item={it}
              removeItem={() => removeItem(it.id)}
            />
          ))}
          <Typography variant="subtitle1" sx={{ mb: 1.5, mt: 3, fontWeight: 600 }}>
            Resumo
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onBack}
            >
              Voltar
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={onNext}
            >
              Continuar
            </Button>
          </Stack>
        </Container>
      )
    }
    </Box>
  );
}
