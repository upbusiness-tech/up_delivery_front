import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
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
import STATUS_COLOR from "../../../utils/colors/colors";
import { STATUS, STATUS_LABEL } from "../../../utils/texts/status.enum";
import { moneyMask } from "../../../utils/masks/mask";

interface OrderDetailProps {
  order: Order | null;
  onClose: () => void;
  updateStatusOrder: (status: string, orderId: string) => void;
}


export default function OrderDetail({ 
  order, 
  onClose,
  updateStatusOrder
  }: OrderDetailProps) {

  const {open, openModalOrderCancel, handleOpenModalOrderCancel, handleCloseModalOrderCancel, cancelOrder, getItemFlavorLines} = useOrderDetailController({ order, onClose });

  if (!order) return null;

  const isDelivery = order.type === "delivery";
  const deliveryFee = isDelivery ? Number(order.neighborhood?.deliveryFee ?? 0) : 0;

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
              <Typography variant="subtitle1" gutterBottom>
                Itens do pedido:
              </Typography>
              <Stack spacing={1.25} sx={{}}>
                {order?.items?.map((item, i) => (
                  <Paper elevation={0} key={i} sx={{ p: 1 }}>
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
                        {item.additionals && item.additionals.length > 0 && (
                          <Typography variant="body2" color="success" sx={{ ml: 2 }}>
                            + {item.additionals.map((e) => e.additionalName).join(", ")}
                          </Typography>
                        )}
                      </Box>

                      <Typography sx={{ fontWeight: 700 }}>
                        {moneyMask(item.price * item.quantity)}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
              <Typography variant="subtitle1" gutterBottom>
                Observações:
              </Typography>
                  <Paper elevation={0}>
                    <Typography variant="subtitle2" gutterBottom>
                      {order.observation || "Nenhuma observação"}
                    </Typography>
                  </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="subtitle1" gutterBottom>
                Dados:
              </Typography>
              <Stack spacing={2}>
                <Paper elevation={0} sx={{ p: 1 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Cliente
                  </Typography>
                  <Typography>{order.costumerName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.costumerPhone}
                  </Typography>
                  <Divider sx={{ my: 1 }} />

                  {isDelivery ? (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Endereço
                      </Typography>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Bairro:</strong> {order.neighborhood?.neighborhoodName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Rua:</strong> {order.costumerAddress?.streetName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Número:</strong> {order.costumerAddress?.number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cidade:</strong> {order.costumerAddress?.city}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Modalidade
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <StorefrontIcon fontSize="small" sx={{ color: "grey.500" }} />
                        <Typography variant="body2" color="text.secondary">
                          Retirada no local
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Paper>
                <Divider sx={{ my: 1 }} />
                <Paper elevation={0} sx={{ p: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Pagamento
                  </Typography>
                  <Typography color="success" sx={{fontWeight: '600'}}>{order.paymentMethod.toLocaleUpperCase()}</Typography>
                </Paper>
                <Divider sx={{ my: 1 }} />
              <Paper elevation={0} sx={{ p: 1 }}>
                {isDelivery && (
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="subtitle1">Taxa entrega</Typography>
                    <Typography variant="subtitle1" sx={{fontWeight: '600'}}>{moneyMask(deliveryFee)}</Typography>
                  </Stack>
                )}
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">Subtotal</Typography>
                  <Typography variant="h6" sx={{fontWeight: '600'}}>{moneyMask(order.orderTotal)}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="h6" sx={{fontWeight: '600'}}>{moneyMask(Number(order.orderTotal) + deliveryFee)}</Typography>
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
                color: 'black',
                backgroundColor: STATUS_COLOR(order.status),
                '& .MuiSelect-icon': {
                  color: 'black',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
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