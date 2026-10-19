import { LocationOn, Storefront, AccessTime } from "@mui/icons-material";
import {  Box, Container, InputAdornment, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { OrderDeliveryMode } from "../../../types/Order.type";
import { moneyMask } from "../../../utils/masks/mask";
import { BackHeader } from "../BackHeader/BackHeader";
import { useNavigate } from "react-router-dom";
import { useAddressController } from "./useAddressController";
import { useCart } from "../../../context/CartContext";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";

const toggleButtonSx = { py: 1.25, borderRadius: 3, textTransform: "none", fontWeight: 600, "&.Mui-selected": { bgcolor: "success.50", color: "success.dark", borderColor: "success.main" } };

export default function AddressScreen() {

  const navigate = useNavigate();
  const {
    type,
    setType,
    restaurantInfo,
    allowDelivery,
    allowPickup,
    neighborhoods
  } = useAddressController()

  const { neighborhood, setNeighborhood, address, setAddress} = useCart();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={() => navigate(-1)} title="Voltar" />
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {type === OrderDeliveryMode.DELIVERY ? "Onde vamos entregar?" : "Retire seu pedido no local"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {type === OrderDeliveryMode.DELIVERY ? "Confirme seu endereço para calcularmos a entrega." : "O restaurante enviará uma mensagem quando o seu pedido estiver pronto."}
        </Typography>

        {allowDelivery && allowPickup && (
          <ToggleButtonGroup value={type} exclusive fullWidth onChange={(_, value: OrderDeliveryMode | null) => value && setType(value)} sx={{ mb: 3, gap: 1 }}>
            <ToggleButton value= {OrderDeliveryMode.DELIVERY} sx={toggleButtonSx}>
              <LocationOn sx={{ mr: 1 }} fontSize="small" /> Entrega
            </ToggleButton>
            <ToggleButton value= {OrderDeliveryMode.PICKUP} sx={toggleButtonSx}>
              <Storefront sx={{ mr: 1 }} fontSize="small" /> Retirada
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        {type === "pickup" ? (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "grey.200" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Retire seu pedido em:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5 }}>
              {restaurantInfo?.restaurantName}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: "center" }}>
              <LocationOn fontSize="small" sx={{ color: "grey.400" }} />
              <Typography variant="body2" color="text.secondary">
                {restaurantInfo?.restaurantAddress ?? "Endereço não cadastrado"}
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
              onChange={(e) => {
                const selected = neighborhoods?.find((n) => n.id === e.target.value);
                if (selected) setNeighborhood(selected);
              }}
              disabled={!neighborhoods || neighborhoods.length === 0}
              // error={!!neighborhood && !!errors.neighborhoodError}
              // helperText={!neighborhoods || neighborhoods.length === 0 ? "Carregando bairros..." : errors.neighborhoodError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              <MenuItem value="" disabled>
                Selecione um bairro
              </MenuItem>
              {neighborhoods?.map((n) => (
                <MenuItem key={n.id} value={n.id}>
                  <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                    <span>{n.neighborhoodName}</span>
                    <Typography variant="caption" color="text.secondary">
                      {moneyMask(n.deliveryFee)}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cidade"
              fullWidth
              value={address.city}
              disabled
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              label="Rua"
              fullWidth
              value={address.streetName}
              onChange={(e) => setAddress({
                ...address,
                streetName: e.target.value 
              })}
              // error={!!address.streetName && !!errors.streetNameError}
              // helperText={!!address.streetName && errors.streetNameError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />


            <Stack direction="row" spacing={2}>
              <TextField
                label="Número"
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                value={address.number}
                onChange={(e) => setAddress({
                  ...address,
                  number: Number(e.target.value)
                })}
                inputMode="numeric"
                // error={!!address.number && !!errors.numberError}
                // helperText={!!address.number && errors.numberError}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">#</InputAdornment> } }}
              />
            </Stack>

            <TextField
              label="Complemento (opcional)"
              fullWidth
              value={address.complement}
              onChange={(e) => setAddress({
                  ...address,
                  complement: e.target.value
              })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            /> 
          </Stack>
        )}
      </Container>

      <Container maxWidth="sm">
        <ScreenFooterActions nextPage={() => navigate('..paymentMethod')} nextPageLabel="Pagamento" viewNextPage={true} />
      </Container>
    </Box>
  );
}