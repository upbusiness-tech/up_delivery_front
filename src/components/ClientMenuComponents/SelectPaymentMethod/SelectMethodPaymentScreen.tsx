import { Avatar, Box, Container, Paper, Radio, Stack, Typography } from "@mui/material";
import { BackHeader } from "../BackHeader/BackHeader";
import { UsePaymentController } from "./UseSelectPaymentMethodControllerScreen";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";
import type { Restaurant } from "../../../types/Restaurant.type";
import { useRestaurantSettings } from "../../../hooks/useRestaurantSettings";

interface PaymentScreenProps {
  total: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onCreateOrder: () => void | Promise<void>;
  restaurant: Restaurant | undefined;
  step?: number;
  totalSteps?: number;
  onBack: () => void;
  loading?: boolean;
}

export default function PaymentScreen({onBack, setPaymentMethod, paymentMethod, onCreateOrder, restaurant, step, totalSteps, loading = false}: PaymentScreenProps) {

  const { allowPixPayment, allowCardPayment } = useRestaurantSettings(restaurant?.id ?? "");
  const c = UsePaymentController({ setPaymentMethod, allowPixPayment, allowCardPayment });

  if(!restaurant) return null;
  
  function handleNext(){
    if (loading) return;
    void onCreateOrder();
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Pagamento" step={step} totalSteps={totalSteps} />
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Como você quer pagar?</Typography>

        <Stack spacing={1}>
          {c.opts.map((o) => {
            const active = paymentMethod === o.id;
            return (
              <Paper
                key={o.id}
                onClick={() => !loading && setPaymentMethod(o.id)}
                aria-disabled={loading}
                sx={{
                  p: 2,
                  cursor: loading ? "default" : "pointer",
                  border: 2,
                  borderColor: active ? "success.main" : "transparent",
                  bgcolor: active ? "success.50" : "#fff",
                  opacity: loading ? 0.6 : 1,
                  pointerEvents: loading ? "none" : "auto",
                  transition: "border-color 120ms ease, background-color 120ms ease, opacity 120ms ease",
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
          nextLabel={loading ? "Carregando..." : "Continuar"}
          nextDisabled={!paymentMethod}
          loading={loading}
        />
      </Container>
    </Box>
  );
}