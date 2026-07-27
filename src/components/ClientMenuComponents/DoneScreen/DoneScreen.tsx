import { Container, Divider, Paper, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Row from "../Row";

interface DoneScreenProps {
  code: string;
  total: number;
  mode: "delivery" | "pickup";
}

export default function DoneScreen({ code, total, mode }: DoneScreenProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
      <CheckCircle sx={{ fontSize: 96, color: "success.main" }} />
      <Typography variant="h5" sx={{ fontWeight: 800, mt: 2 }}>Pedido confirmado!</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Seu pedido <b>{code}</b> foi recebido pelo restaurante.
      </Typography>
      <Paper sx={{ p: 2, mt: 3, textAlign: "left" }}>
        <Row label="Número do pedido" value={code} />
        <Row label={mode === "pickup" ? "Pronto em" : "Tempo estimado"} value={mode === "pickup" ? "~25 min" : "~40 min"} />
        <Divider sx={{ my: 1 }} />
        <Row label="Total pago" value={String(total)} bold />
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3 }}>
        Você receberá atualizações do pedido pelo WhatsApp informado.
      </Typography>
    </Container>
  );
}