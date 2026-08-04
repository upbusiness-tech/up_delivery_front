import { Avatar, Box, Button, Container, Paper, Radio, Stack, Typography } from "@mui/material";
import { BackHeader } from "../BackHeader/BackHeader";
import { UsePaymentController } from "./UsePaymentControllerScreen";

interface PaymentScreenProps {
  total: number;
  setPaymentMethod: (method: string) => void;
  onCreateOrder: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function PaymentScreen({onBack, onNext, setPaymentMethod, onCreateOrder}: PaymentScreenProps) {

  const c = UsePaymentController()

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Voltar" />
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Como você quer pagar?</Typography>

        <Stack spacing={1}>
          {c.opts.map((o) => {
            const active = c.paymentMethod === o.id;
            return (
              <Paper
                key={o.id}
                onClick={() => c.setPaymentMethod(o.id)}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  border: 2,
                  borderColor: active ? "success.main" : "transparent",
                  bgcolor: active ? "success.50" : "#fff",
                  transition: "border-color 120ms ease, background-color 120ms ease",
                }}
              >
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: active ? "success.main" : "grey.100", color: active ? "#fff" : "text.primary" }}>
                    <o.Icon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>{o.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{o.desc}</Typography>
                  </Box>
                  <Radio checked={active} color="success"  />
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: "auto", py: 1 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600, borderColor: "grey.300", color: "text.primary", px: 3, "&:hover": { borderColor: "grey.400", bgcolor: "grey.50" } }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="success"
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700, bgcolor: "success.main", boxShadow: "none", "&:hover": { bgcolor: "success.dark", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "grey.200", color: "grey.500" } }}
            onClick={() => {
              setPaymentMethod(c.paymentMethod)
              onCreateOrder()
              onNext()
            }}
          >
            Continuar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}