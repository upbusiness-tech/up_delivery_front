import { Avatar, Box, Container, Paper, Radio, Stack, Typography } from "@mui/material";
import { BackHeader } from "../BackHeader/BackHeader";
import { UsePaymentController } from "./UseSelectPaymentMethodControllerScreen";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";

interface PaymentScreenProps {
  total: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onCreateOrder: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function PaymentScreen({onBack, onNext, setPaymentMethod, paymentMethod, onCreateOrder}: PaymentScreenProps) {

  const c = UsePaymentController({ paymentMethod, setPaymentMethod });

  async function handleNext(){
    onCreateOrder()
    onNext()
  }

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
                onClick={() => setPaymentMethod(o.id)}
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
        <ScreenFooterActions
          onBack={onBack}
          onNext={handleNext}
          nextLabel="Continuar"
          nextDisabled={!c.paymentMethod}
        />
      </Container>
    </Box>
  );
}