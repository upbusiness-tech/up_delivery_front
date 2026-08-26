import { LocationOn, Storefront, AccessTime } from "@mui/icons-material";
import { Box, Container, InputAdornment, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ScreenFooterActions } from "../ScreenFooterActions/ScreenFooterActions";
import type { Address, OrderMode } from "../../../types/Order.type";
import { moneyMask } from "../../../utils/masks/mask";
import type { Neighborhood, Restaurant } from "../../../types/Restaurant.type";
import { BackHeader } from "../BackHeader/BackHeader";
import { useAddressValidation } from "../../../hooks/useInfoScreenValidation";

interface AddressScreenProps {
  type: OrderMode;
  setType: (v: OrderMode) => void;
  address: Address;
  setAddress: (v: Address) => void;
  neighborhood: Neighborhood | undefined;
  setNeighborhood: (v: Neighborhood) => void;
  neighborhoods: Neighborhood[];
  restaurant: Restaurant | undefined;
  onBack: () => void;
  onNext: () => void;
}

export default function AddressScreen({ type, setType, address, setAddress, neighborhood, setNeighborhood, neighborhoods, restaurant, onBack, onNext }: AddressScreenProps) {
  const { errors, isValid } = useAddressValidation(type, address, neighborhood);

  const updateField = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [field]: e.target.value });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Voltar"/>
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {type === "delivery" ? "Onde vamos entregar?" : "Como você quer receber?"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {type === "delivery" ? "Confirme seu endereço para calcularmos a entrega." : "Escolha retirar seu pedido no local."}
        </Typography>

        <ToggleButtonGroup
          value={type}
          exclusive
          fullWidth
          onChange={(_, value: OrderMode | null) => value && setType(value)}
          sx={{ mb: 3, gap: 1 }}
        >
          <ToggleButton value="delivery" sx={{ py: 1.25, borderRadius: 3, textTransform: "none", fontWeight: 600, "&.Mui-selected": { bgcolor: "success.50", color: "success.dark", borderColor: "success.main" } }}>
            <LocationOn sx={{ mr: 1 }} fontSize="small" /> Entrega
          </ToggleButton>
          <ToggleButton value="pickup" sx={{ py: 1.25, borderRadius: 3, textTransform: "none", fontWeight: 600, "&.Mui-selected": { bgcolor: "success.50", color: "success.dark", borderColor: "success.main" } }}>
            <Storefront sx={{ mr: 1 }} fontSize="small" /> Retirada
          </ToggleButton>
        </ToggleButtonGroup>

        {type === "pickup" ? (
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "grey.200" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Retire seu pedido em:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5 }}>
              {restaurant?.restaurantName}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: "center" }}>
              <LocationOn fontSize="small" sx={{ color: "grey.400" }} />
              <Typography variant="body2" color="text.secondary">
                {restaurant?.restaurantAddress ?? "Endereço não cadastrado"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
              <AccessTime fontSize="small" sx={{ color: "grey.400" }} />
              <Typography variant="body2" color="text.secondary">
                Pronto em aproximadamente 25 min
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
              error={!!neighborhood && !!errors.neighborhoodError}
              helperText={!neighborhoods || neighborhoods.length === 0 ? "Carregando bairros..." : errors.neighborhoodError}
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
              onChange={updateField("city")}
              error={!!address.city && !!errors.cityError}
              helperText={!!address.city && errors.cityError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              label="Rua"
              fullWidth
              value={address.streetName}
              onChange={updateField("streetName")}
              error={!!address.streetName && !!errors.streetNameError}
              helperText={!!address.streetName && errors.streetNameError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Número"
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                value={address.number}
                onChange={updateField("number")}
                inputMode="numeric"
                error={!!address.number && !!errors.numberError}
                helperText={!!address.number && errors.numberError}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                  },
                }}
              />
            </Stack>
          </Stack>
        )}
      </Container>

      <Container maxWidth="sm">
        <ScreenFooterActions onBack={onBack} onNext={onNext} nextDisabled={!isValid} />
      </Container>
    </Box>
  );
}