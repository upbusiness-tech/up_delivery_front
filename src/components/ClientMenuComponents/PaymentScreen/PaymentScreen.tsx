import { useState } from "react";
import { Avatar, Box, Button, Container, Paper, Radio, Stack, TextField, Typography } from "@mui/material";
import { AttachMoney, ContentCopy, CreditCard, Pix as PixIcon } from "@mui/icons-material";

interface PaymentScreenProps {
  payment: "pix" | "card" | "cash";
  setPayment?: (p: "pix" | "card" | "cash") => void;
  changeFor: string;
  setChangeFor?: (v: string) => void;
  total: number;
  onBack: () => void;
  onNext: () => void;
  relaizarPedido: () => void
}

const opts = [
  { id: "pix" as const, label: "Pix", desc: "Aprovação imediata", Icon: PixIcon },
  { id: "card" as const, label: "Cartão de crédito", desc: "Na entrega (maquininha)", Icon: CreditCard },
  { id: "cash" as const, label: "Dinheiro", desc: "Pagar na entrega", Icon: AttachMoney },
];

const PIX_CODE = "00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913UpDelivery6009SaoPaulo62070503***6304ABCD";

export default function PaymentScreen({ payment, setPayment, changeFor, setChangeFor, total, onBack, onNext, relaizarPedido}: PaymentScreenProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Como você quer pagar?</Typography>
      <Stack spacing={1.5}>
        {opts.map(o => {
          const active = payment === o.id;
          return (
            <Paper
              key={o.id}
              // onClick={() => setPayment(o.id)}
              sx={{
                p: 2, cursor: "pointer", border: 2, borderColor: active ? "primary.main" : "transparent",
                bgcolor: active ? "rgba(229,57,53,0.04)" : "#fff",
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: active ? "primary.main" : "grey.100", color: active ? "#fff" : "text.primary" }}>
                  <o.Icon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{o.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{o.desc}</Typography>
                </Box>
                <Radio checked={active} />
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {payment === "cash" && (
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="Troco para quanto?"
          placeholder="Ex: 100,00"
          value={changeFor}
          // onChange={e => setChangeFor(e.target.value)}
          helperText="Deixe em branco se não precisar de troco"
        />
      )}

      {payment === "pix" && (
        <Paper sx={{ mt: 2, p: 2, textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Pague com Pix</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Escaneie o QR code ou copie o código abaixo
          </Typography>
          <Box
            sx={{
              width: 200, height: 200, mx: "auto", bgcolor: "#fff", border: "1px solid #E5E7EB",
              display: "grid", placeItems: "center", backgroundImage:
                "repeating-linear-gradient(0deg, #111 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, #111 0 6px, transparent 6px 12px)",
              backgroundBlendMode: "multiply",
            }}
          />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mt: 2 }}>{total}</Typography>
          <Paper variant="outlined" sx={{ mt: 2, p: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ flex: 1, textAlign: "left", wordBreak: "break-all", fontFamily: "monospace" }}>
              {PIX_CODE.slice(0, 40)}…
            </Typography>
            <Button
              size="small"
              startIcon={<ContentCopy fontSize="small" />}
              onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            >
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </Paper>
        </Paper>
      )}
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
          onClick={() => {
            relaizarPedido();
            onNext();
          }}
        >
          Realizar pedido
        </Button>
      </Stack>
    </Container>
  );
}