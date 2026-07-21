import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useOrderDetailController } from "./UseOrderDetailController";
import { type Order } from "../../../types/Order.type";

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  const {open, getItemFlavorLines} = useOrderDetailController({ order, onClose });

  console.log(order)

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">Pedido {order.code}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.type} 
            </Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="subtitle2" gutterBottom>
              Itens do pedido:
            </Typography>
            <Stack spacing={1.25}>
            {order?.items?.map((item, i) => (
              <Paper key={i} sx={{ p: 1.5 }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "black" }}>
                      {item.quantity}x {item.name}
                    </Typography>

                    {getItemFlavorLines(item).map((line, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {line}
                      </Typography>
                    ))}
                  </Box>

                  <Typography sx={{ fontWeight: 700 }}>
                    {brl(item.price * item.quantity)}
                  </Typography>
                </Stack>
              </Paper>
            ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Dados:
            </Typography>
            <Stack spacing={2}>
              <Paper sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Cliente
                </Typography>
                <Typography>{order.costumerName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.costumerPhone}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Endereço
                </Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Bairro:</strong> {order.neighborhood.neighborhoodName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Rua:</strong> {order.costumerAddress.streetName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Número:</strong> {order.costumerAddress.number}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Cidade:</strong> {order.costumerAddress.city}
                  </Typography>
                </Box>
              </Paper>
              <Paper sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Pagamento
                </Typography>
                <Typography color="success" sx={{fontWeight: '600'}}>{order.paymentMethod.toLocaleUpperCase()}</Typography>
              </Paper>

             <Paper sx={{ p: 1.5, bgcolor: "#e3bc37", color: "#fff", borderColor: "primary.main" }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="subtitle1">Taxa entrega</Typography>
                <Typography variant="subtitle1" sx={{fontWeight: '600'}}>R$ {order.neighborhood.deliveryFee}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="subtitle1">Subtotal</Typography>
                <Typography variant="h6" sx={{fontWeight: '600'}}>R$ {order.orderTotal}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h6" sx={{fontWeight: '600'}}>R$ {(Number(order.orderTotal) + Number(order.neighborhood.deliveryFee)).toFixed(2)}</Typography>
              </Stack>
            </Paper>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button variant="contained" color="error" size="medium" startIcon={<DoDisturbIcon />}>
          Cancelar pedido
        </Button>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="success" size="medium" startIcon={<WhatsAppIcon />}>
            WhatsApp
          </Button>
          <Button variant="contained" color="primary" size="medium" startIcon={<PrintIcon />}>
            Imprimir
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}