import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Row from "../Row";
import type { Order } from "../../../types/Order.type";
import { capitalizeMask, moneyMask } from "../../../utils/masks/mask";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface DoneScreenProps {
  order: Order,
  onNext: () => void
}

export default function DoneScreen({ order, onNext }: DoneScreenProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
      <CheckCircle sx={{ fontSize: 96, color: "success.main" }} />
      <Typography variant="h5" sx={{ fontWeight: 800, mt: 2 }}>Pedido confirmado!</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Seu pedido <b>{order.code}</b> foi recebido pelo restaurante.
      </Typography>
      <Paper sx={{ p: 2, mt: 3, textAlign: "left" }}>
        <Row label="Número do pedido" value={order.code} />
        <Divider sx={{ my: 1 }} />
        <Row label="Forma de pagamento" value={capitalizeMask(order.paymentMethod)} />
        <Row label="Total pago" value={moneyMask(order.orderTotal)} bold />
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3 }}>
        Você receberá atualizações do pedido pelo WhatsApp informado.
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={onNext}
        endIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
        sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, bgcolor: "success.main", boxShadow: "none", "&:hover": { bgcolor: "success.dark", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" }, mt: 2 }}
      >
        WhatsApp
      </Button>
      <Button
        variant="contained"
        fullWidth
        onClick={onNext}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
        sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, bgcolor: "primary.main", boxShadow: "none", "&:hover": { bgcolor: "primary.dark", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" }, mt: 2 }}
      >
        Cardapio
      </Button>
    </Container>
  );
}