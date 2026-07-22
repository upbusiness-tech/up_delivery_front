import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useOrderDetailController } from "./UseOrderDetailController";
import { type Order } from "../../../types/Order.type";
import STATUS_COLOR, { STATUS, STATUS_LABEL } from "../../../utils/status.enum";
import UseOrdersController from "../../../pages/Orders/UseOrdersController";

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  const {open, getItemFlavorLines, openModalOrderCancel, handleOpenModalOrderCancel, handleCloseModalOrderCancel, cancelOrder} = useOrderDetailController({ order, onClose });
  const {  updateStatusOrder } = UseOrdersController()

  if (!order) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1">Pedido {order.code}</Typography>
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
          <Button sx={{textTransform: "none" }} variant="contained" color="error" size="medium"
            onClick={() => handleOpenModalOrderCancel()}
          >
            Cancelar
          </Button>

          <Stack direction="row" spacing={1}>
            <Button sx={{textTransform: "none" }} variant="contained" color="success" size="medium" startIcon={<WhatsAppIcon />}>
              WhatsApp
            </Button>
            <Button sx={{textTransform: "none" }} variant="contained" color="primary" size="medium" startIcon={<PrintIcon />}>
              Imprimir
            </Button>
            <Select
              value={order.status}
              size="small"
              onChange={(e) => updateStatusOrder(e.target.value, order.id)}
              onClick={(e) => e.stopPropagation()}
              sx={{
                backgroundColor: STATUS_COLOR(order.status),
                '& .MuiSelect-icon': {
                  color: '#000000',
                },
              }}
            >
              {Object.values(STATUS)
              .filter((status) => status !== STATUS.CANCELADO)
              .map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalOrderCancel} onClose={handleCloseModalOrderCancel}>
        <DialogTitle>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1">Cancelar pedido</Typography>
            </Box>
          </Stack>
          <IconButton
            aria-label="Fechar"
            onClick={handleCloseModalOrderCancel}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="subtitle2" gutterBottom>
                Essa ação não poderá ser desfeita!
              </Typography>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1}>
            <Button sx={{textTransform: "none" }} disableElevation variant="contained" color="inherit" size="medium" 
              onClick={() => handleCloseModalOrderCancel()}
            >
              Voltar
            </Button>
            <Button sx={{textTransform: "none" }} variant="contained" color="error" size="medium"
              onClick={() => cancelOrder()}
            >
              Cancelar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}