import { LocationOn, Storefront } from "@mui/icons-material";
import {Button, Container, Stack, TextField, ToggleButton } from "@mui/material";
// import { AccessTime, LocationOn, Storefront } from "@mui/icons-material";
// import { useRestaurant } from "../../../context/RestaurantContext";

interface AddressScreenProps {
  mode?: "delivery";
  // mode?: "delivery" | "pickup";
  // setMode?: (m: "delivery" | "pickup") => void;
  street?: string;
  // setStreet?: (v: string) => void;
  number?: string;
  // setNumber?: (v: string) => void;
  complement?: string;
  city?: string;
  // setComplement?: (v: string) => void;
  // reference: string;
  // setReference?: (v: string) => void;
  neighborhood?: string;
  // setNeighborhood?: (v: string) => void;
  // fee: number;
  onBack: () => void;
  onNext: () => void;
}

export default function AddressScreen({ onBack, onNext }: AddressScreenProps) {
  
  // const { restaurant } = useRestaurant();

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* <ToggleButtonGroup exclusive value={mode}  fullWidth sx={{ mb: 3 }}> */}
        <ToggleButton value="delivery" sx={{ py: 1.5 }}><LocationOn sx={{ mr: 1 }} fontSize="small" /> Entrega</ToggleButton>
        <ToggleButton value="pickup" sx={{ py: 1.5 }}><Storefront sx={{ mr: 1 }} fontSize="small" /> Retirada</ToggleButton>
      {/* </ToggleButtonGroup> */}

      {/* {mode === "pickup" ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Retire seu pedido em:</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5 }}>{restaurant?.restaurantName}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">{restaurant?.restaurantName}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">Pronto em aproximadamente 25 min</Typography>
          </Stack>
        </Paper>
      ) : ( */}
        <Stack spacing={2}>
          <TextField
            // select
            label="Bairro"
            fullWidth
            value={"bf359221-7e85-43c1-80d0-a951d439fc07"}
            // onChange={e => setNeighborhood(e.target.value)}
            // helperText={`Taxa de entrega: ${fee}`}
          >
            {/* {NEIGHBORHOODS.map(n => (
              <MenuItem key={n.name} value={n.name}>
                <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
                  <span>{n.name}</span>
                  <Typography variant="caption" color="text.secondary">{n.fee}</Typography>
                </Stack>
              </MenuItem>
            ))} */}
          </TextField>
          <TextField label="Cidade" fullWidth value={"Quixadá"} />
          <TextField label="Rua" fullWidth value={"Jose de queiroz pessoa"} />
          <Stack direction="row" spacing={2}>
            <TextField label="Número" sx={{ flex: 1 }} value={"2003"}/>
          </Stack>
        </Stack>

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
            onClick={onNext}
          >
            Continuar
          </Button>
        </Stack>
      {/* )} */}
    </Container>
  );
}