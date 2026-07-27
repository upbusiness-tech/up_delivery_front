import { Box, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import Row from "./Row";
import SectionCard from "./SectionCard";
import type { CartItem, Step } from "../../types/MenuClient.type";

interface ReviewScreenProps {
  cart?: CartItem[];
  name?: string;
  phone?: string;
  mode?: "delivery" | "pickup";
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  // subtotal: number;
  // deliveryFee: number;
  discount?: number;
  total?: number;
  onEdit: (step: Step) => void;
}

export default function ReviewScreen(props: ReviewScreenProps) {
  const {
    cart, name, phone, mode, street, number, complement, neighborhood,
     discount, total, onEdit,
  } = props;

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <SectionCard title="Itens do pedido" onEdit={() => onEdit("cart")}>
        <Stack spacing={1}>
          {cart?.map(i => (
            <Stack key={i.uid} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{i.qty}× {i.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {/* {i.size.label}{i.addons.length > 0 && ` • ${i.addons.map(a => a.name).join(", ")}`} */}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{i.unit * i.qty}</Typography>
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Seus dados" onEdit={() => onEdit("info")}>
        <Typography variant="body2">{name || "—"}</Typography>
        <Typography variant="body2" color="text.secondary">{phone || "—"}</Typography>
      </SectionCard>

      <SectionCard title={mode === "pickup" ? "Retirada no local" : "Endereço de entrega"} onEdit={() => onEdit("address")}>
        {mode === "pickup" ? (
          <Typography variant="body2">Retirada no restaurante</Typography>
        ) : (
          <>
            <Typography variant="body2">{street}, {number}{complement && ` — ${complement}`}</Typography>
            <Typography variant="body2" color="text.secondary">{neighborhood}</Typography>
          </>
        )}
      </SectionCard>

      <Paper sx={{ p: 2, mt: 2 }}>
        {/* <Row label="Subtotal" /> */}
        <Row label={mode === "pickup" ? "Retirada" : "Taxa de entrega"} value={mode === "pickup" ? "Grátis" : ""} />
        {/* {discount > 0 && <Row label="Desconto" value={`- ${discount}`} color="success.main" />} */}
        <Divider sx={{ my: 1 }} />
        <Row label="Total" value={String(total)} bold />
      </Paper>
    </Container>
  );
}