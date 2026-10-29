import { Avatar, Box, Chip, Container, Paper, Radio, Stack, Typography } from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { BackHeader } from "../BackHeader/BackHeader";
import { CheckoutBottomBar } from "../CheckoutBottomBar";
import { UsePaymentController } from "./UseSelectPaymentMethodControllerScreen";
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

  const { allowPixPayment, allowCardPayment, loading: settingsLoading } = useRestaurantSettings(restaurant?.id ?? "");
  const c = UsePaymentController({ setPaymentMethod, allowPixPayment, allowCardPayment });

  if(!restaurant) return null;
  
  function handleNext(){
    if (loading) return;
    void onCreateOrder();
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <BackHeader onBack={onBack} title="Pagamento" step={step} totalSteps={totalSteps} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Container maxWidth="sm" sx={{ py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Como você quer pagar?</Typography>

          <Stack spacing={1}>
            {c.opts.map((o) => {
              const active = paymentMethod === o.id;
              const highlighted = Boolean(o.highlight);
              return (
                <Paper
                  key={o.id}
                  onClick={() => !loading && setPaymentMethod(o.id)}
                  aria-disabled={loading}
                  sx={{
                    p: 1.75,
                    cursor: loading ? "default" : "pointer",
                    border: 2,
                    borderColor: active ? "success.main" : highlighted ? "success.light" : "transparent",
                    bgcolor: active ? "success.50" : highlighted ? "rgba(46,125,50,0.035)" : "#fff",
                    opacity: loading ? 0.6 : 1,
                    pointerEvents: loading ? "none" : "auto",
                    transition: "border-color 120ms ease, background-color 120ms ease, opacity 120ms ease",
                    "&:hover": {
                      borderColor: active ? "success.main" : highlighted ? "success.main" : "grey.300",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: active ? "success.main" : highlighted ? "success.50" : "grey.100",
                        color: active ? "#fff" : highlighted ? "success.dark" : "text.primary",
                      }}
                    >
                      <o.Icon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                        <Typography sx={{ fontWeight: 700 }}>{o.label}</Typography>
                        {o.tag && (
                          <Chip
                            label={o.tag}
                            size="small"
                            color="success"
                            sx={{
                              height: 20,
                              fontSize: 10.5,
                              fontWeight: 800,
                              "& .MuiChip-label": { px: 0.75 },
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{o.desc}</Typography>
                      {o.badge && (
                        <Chip
                          icon={<VerifiedUserOutlinedIcon />}
                          label={o.badge}
                          size="small"
                          sx={{
                            mt: 0.5,
                            height: 21,
                            borderRadius: 1.5,
                            bgcolor: "rgba(25,118,210,0.07)",
                            color: "info.dark",
                            fontWeight: 600,
                            "& .MuiChip-label": { px: 0.75, fontSize: 10.5 },
                            "& .MuiChip-icon": { fontSize: 13, ml: 0.75, mr: -0.25, color: "info.main" },
                          }}
                        />
                      )}
                    </Box>
                    <Radio checked={active} color="success" />
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Container>
      </Box>

      <CheckoutBottomBar
        onBack={onBack}
        onNext={handleNext}
        nextLabel={loading || settingsLoading ? "Carregando..." : "Continuar"}
        nextDisabled={!paymentMethod || settingsLoading}
        loading={loading}
      />
    </Box>
  );
}