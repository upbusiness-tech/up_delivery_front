import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import { CheckCircleRounded, WhatsApp } from "@mui/icons-material";
import Row from "../Row";
import type { Order } from "../../../types/Order.type";
import { moneyMask, paymentMethodMask } from "../../../utils/masks/mask";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface DoneScreenProps {
  order: Order,
  onNext: () => void
}

export default function DoneScreen({ order, onNext }: DoneScreenProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
      <Box sx={{ animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", "@keyframes scaleIn": { "0%": { transform: "scale(0.6)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } } }}>
        <CheckCircleRounded sx={{ fontSize: 88, color: "success.main" }} />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, mt: 2, color: "#0F172A" }}>Pedido confirmado!</Typography>
      <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>O restaurante já recebeu seu pedido</Typography>

      <Paper elevation={0} sx={{ mt: 4, border: "1px solid #E5E7EB", borderRadius: 3, overflow: "hidden", textAlign: "left" }}>
        <Box sx={{ px: 3, py: 2.5, textAlign: "center", borderBottom: "1px dashed #E2E8F0" }}>
          <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pedido</Typography>
          <Typography sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1.6rem", color: "#0F172A", mt: 0.5 }}>#{order.code}</Typography>
        </Box>

        <Box sx={{ px: 3, py: 2.5 }}>
          <Row label="Pagamento" value={paymentMethodMask(order.paymentMethod)} />
          <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />
          <Row label="Total pago" value={moneyMask(order.orderTotal)} bold />
        </Box>

        <Box sx={{ px: 3, py: 2, backgroundColor: "#F0FDF4", display: "flex", alignItems: "center", gap: 1.5 }}>
          <WhatsApp sx={{ fontSize: 22, color: "#16A34A" }} />
          <Typography sx={{ fontSize: "0.82rem", color: "#166534", textAlign: "left" }}>Você vai receber as atualizações do pedido pelo WhatsApp</Typography>
        </Box>
      </Paper>

      <Button
        variant="contained"
        fullWidth
        onClick={onNext}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
        sx={{ borderRadius: 3, textTransform: "none", fontWeight: 700, bgcolor: "primary.main", boxShadow: "none", "&:hover": { bgcolor: "primary.dark", boxShadow: "none" }, mt: 4 }}
      >
        Ver cardápio
      </Button>
    </Container>
  );
}