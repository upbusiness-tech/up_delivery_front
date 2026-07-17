import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { STATUS_LABELS, type Order, type OrderStatus } from "../../../types/Order.type";

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, nextStatus: OrderStatus) => Promise<void> | void;
  onPrint?: (order: Order) => void;
}

export default function OrderDetail({ order, onClose, onUpdateStatus, onPrint }: OrderDetailProps) {
  const {
    open,
    nextStatus,
    changeDue,
    isUpdating,
    error,
    handleUpdateStatus,
    handlePrint,
    handleClose,
  } = useOrderDetailController({ order, onClose, onUpdateStatus, onPrint });

  if (!order) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6">Pedido {order.code}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.type} · {order.createdAt}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} aria-label="Fechar" disabled={isUpdating}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="subtitle2" gutterBottom>
              Itens
            </Typography>
            <Stack spacing={1.25}>
              {order.items.map((it, i) => (
                <Paper key={i} sx={{ p: 1.5 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {it.qty}x {it.name}{" "}
                        {it.size && <Chip size="small" label={it.size} sx={{ ml: 0.5 }} />}
                      </Typography>
                      {it.flavors && (
                        <Typography variant="body2" color="text.secondary">
                          Sabores: {it.flavors.join(", ")}
                        </Typography>
                      )}
                      {it.addons && (
                        <Typography variant="body2" color="text.secondary">
                          Adicionais: {it.addons.join(", ")}
                        </Typography>
                      )}
                      {it.notes && (
                        <Typography variant="body2" color="warning.main">
                          Obs: {it.notes}
                        </Typography>
                      )}
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>{brl(it.price * it.qty)}</Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              <Paper sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Cliente
                </Typography>
                <Typography>{order.customer}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.phone}
                </Typography>
                {order.address && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Endereço
                    </Typography>
                    <Typography variant="body2">{order.address}</Typography>
                  </>
                )}
              </Paper>

              <Paper sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Pagamento
                </Typography>
                <Typography>{order.payment}</Typography>
                {order.changeFor != null && changeDue != null && (
                  <Typography variant="body2" color="text.secondary">
                    Troco para {brl(order.changeFor)} ({brl(changeDue)})
                  </Typography>
                )}
              </Paper>

              <Paper sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <Chip label={STATUS_LABELS[order.status]} color="primary" size="small" />
                {order.courier && (
                  <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    Entregador: {order.courier}
                  </Typography>
                )}
              </Paper>

              <Paper sx={{ p: 1.5, bgcolor: "primary.main", color: "#fff", borderColor: "primary.main" }}>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="h6">{brl(order.total)}</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isUpdating}>
          Fechar
        </Button>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
          Imprimir
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateStatus}
          disabled={!nextStatus || isUpdating}
          startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {nextStatus ? `Marcar como ${STATUS_LABELS[nextStatus]}` : "Status final"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}