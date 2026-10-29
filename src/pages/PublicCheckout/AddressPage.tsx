import { useEffect } from "react";
import { AccessTime, LocationOn, Storefront } from "@mui/icons-material";
import {
  Alert,
  Box,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RestaurantService } from "../../api/services/restaurant.service";
import { BackHeader } from "../../components/ClientMenuComponents/BackHeader/BackHeader";
import { ScreenFooterActions } from "../../components/ClientMenuComponents/ScreenFooterActions/ScreenFooterActions";
import { CHECKOUT_TOTAL_STEPS, useCheckout } from "../../checkout/CheckoutContext";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../../hooks/useRestaurantData";
import { useAddressValidation } from "../../hooks/useInfoScreenValidation";
import { useRestaurantSettings } from "../../hooks/useRestaurantSettings";
import { publicPaths } from "../../routes/paths";
import type { OrderMode } from "../../types/Order.type";
import { moneyMask } from "../../utils/masks/mask";

const toggleButtonSx = {
  py: 1.25,
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 600,
  "&.Mui-selected": { bgcolor: "success.50", color: "success.dark", borderColor: "success.main" },
};

/** Passo 3 do checkout: endereço de entrega ou retirada no local. */
export default function AddressPage() {
  const navigate = useNavigate();
  const { slug, restaurant } = usePublicRestaurant();
  const { mode, setMode, address, updateAddress, neighborhood, setNeighborhood, hasAddress } = useCheckout();
  const { allowDelivery, allowPickup, loading: settingsLoading } = useRestaurantSettings(restaurant.id);

  const { data: neighborhoods = [] } = useRestaurantData(
    () => RestaurantService.restaurantNeighborhoodsPublic(slug),
    QueryCacheName.NEIGHBORHOODS_PUBLIC,
    slug,
  );

  const { errors } = useAddressValidation(mode, address, neighborhood);

  const noModesAvailable = !settingsLoading && !allowDelivery && !allowPickup;
  const modeNotice = noModesAvailable
    ? "Este restaurante não está aceitando entregas nem retiradas no momento. Não é possível concluir o pedido."
    : !allowDelivery
      ? "Este restaurante não está aceitando entregas no momento. Seu pedido será para retirada no local."
      : "Este restaurante não está aceitando retiradas no momento. Seu pedido será para entrega.";

  // Se o restaurante só permite um modo, seleciona automaticamente.
  useEffect(() => {
    if (!allowDelivery && allowPickup && mode !== "pickup") setMode("pickup");
    if (allowDelivery && !allowPickup && mode !== "delivery") setMode("delivery");
  }, [allowDelivery, allowPickup, mode, setMode]);

  // O bairro salvo no localStorage pode ter mudado de taxa ou ter sido removido.
  useEffect(() => {
    if (!neighborhood || neighborhoods.length === 0) return;

    const current = neighborhoods.find((item) => item.id === neighborhood.id);

    if (!current) {
      setNeighborhood(undefined);
      return;
    }

    if (current.deliveryFee !== neighborhood.deliveryFee || current.neighborhoodName !== neighborhood.neighborhoodName) {
      setNeighborhood(current);
    }
  }, [neighborhood, neighborhoods, setNeighborhood]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader title="Endereço" step={3} totalSteps={CHECKOUT_TOTAL_STEPS} onBack={() => navigate(publicPaths.customer(slug))} />

      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        {!settingsLoading && (!allowDelivery || !allowPickup) && (
          <Alert severity={noModesAvailable ? "warning" : "info"} sx={{ mb: 2, borderRadius: 2 }}>
            {modeNotice}
          </Alert>
        )}

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {noModesAvailable
            ? "Pedidos indisponíveis no momento"
            : mode === "delivery"
              ? "Onde vamos entregar?"
              : "Retire seu pedido no local"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {noModesAvailable
            ? "O restaurante não está aceitando entregas nem retiradas."
            : mode === "delivery"
              ? "Confirme seu endereço para calcularmos a entrega."
              : "O restaurante enviará uma mensagem quando o seu pedido estiver pronto."}
        </Typography>

        {allowDelivery && allowPickup && (
          <ToggleButtonGroup
            value={mode}
            exclusive
            fullWidth
            onChange={(_, value: OrderMode | null) => value && setMode(value)}
            sx={{ mb: 3, gap: 1 }}
          >
            <ToggleButton value="delivery" sx={toggleButtonSx}>
              <LocationOn sx={{ mr: 1 }} fontSize="small" /> Entrega
            </ToggleButton>
            <ToggleButton value="pickup" sx={toggleButtonSx}>
              <Storefront sx={{ mr: 1 }} fontSize="small" /> Retirada
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        {!noModesAvailable && (mode === "pickup" ? (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "grey.200" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Retire seu pedido em:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5 }}>
              {restaurant.restaurantName}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: "center" }}>
              <LocationOn fontSize="small" sx={{ color: "grey.400" }} />
              <Typography variant="body2" color="text.secondary">
                {restaurant.restaurantAddress || "Endereço não cadastrado"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
              <AccessTime fontSize="small" sx={{ color: "grey.400" }} />
              <Typography variant="body2" color="text.secondary">
                Pronto em aproximadamente 40 min
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={2}>
            <TextField
              select
              label="Bairro"
              fullWidth
              value={neighborhood?.id ?? ""}
              onChange={(event) => {
                const selected = neighborhoods.find((item) => item.id === event.target.value);
                setNeighborhood(selected);
              }}
              disabled={neighborhoods.length === 0}
              error={!!neighborhood && !!errors.neighborhoodError}
              helperText={neighborhoods.length === 0 ? "Carregando bairros..." : errors.neighborhoodError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              <MenuItem value="" disabled>
                Selecione um bairro
              </MenuItem>
              {neighborhoods.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                    <span>{item.neighborhoodName}</span>
                    <Typography variant="caption" color="text.secondary">
                      {moneyMask(item.deliveryFee)}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Cidade"
              fullWidth
              value={address.city}
              onChange={(event) => updateAddress({ city: event.target.value })}
              error={!!address.city && !!errors.cityError}
              helperText={!!address.city && errors.cityError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              label="Rua"
              fullWidth
              value={address.streetName}
              onChange={(event) => updateAddress({ streetName: event.target.value })}
              error={!!address.streetName && !!errors.streetNameError}
              helperText={!!address.streetName && errors.streetNameError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Número"
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                value={address.number || ""}
                onChange={(event) => updateAddress({ number: Number(event.target.value.replace(/\D/g, "")) })}
                error={!!address.number && !!errors.numberError}
                helperText={!!address.number && errors.numberError}
                inputMode="numeric"
                slotProps={{ input: { startAdornment: <InputAdornment position="start">#</InputAdornment> } }}
              />
            </Stack>

            <TextField
              label="Complemento (opcional)"
              fullWidth
              value={address.complement}
              onChange={(event) => updateAddress({ complement: event.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Stack>
        ))}
      </Container>

      <Container maxWidth="sm">
        <ScreenFooterActions
          onBack={() => navigate(publicPaths.customer(slug))}
          onNext={() => navigate(publicPaths.payment(slug))}
          nextLabel={noModesAvailable ? "Indisponível" : "Pagamento"}
          nextDisabled={!hasAddress || settingsLoading || noModesAvailable}
        />
      </Container>
    </Box>
  );
}
