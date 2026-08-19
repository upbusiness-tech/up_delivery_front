import { Box, Button, Chip, CircularProgress, Divider, IconButton, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { capitalizeMask, moneyMask, phoneMask } from "../../../utils/masks/mask";
import { STATUS, STATUS_LABEL } from "../../../utils/texts/status.enum";
import type { Order } from "../../../types/Order.type";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import STATUS_COLOR from "../../../utils/colors/colors";
import TagIcon from '@mui/icons-material/Tag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import InfoIcon from '@mui/icons-material/Info';

interface props {
  orders: Order[] | undefined;
  loading: boolean;
  isDesktop:  boolean;
  openOrderDetail: (order: Order) => void;
  deliveryFee: (order: Order) => number;
  updateStatusOrder: (status: string, orderId: string) => Promise<void>

}

export function OrderTable({orders, loading, isDesktop, updateStatusOrder, deliveryFee, openOrderDetail}: props){
  return(
    <>
       {loading ? (
        <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", py: 6 }}>
          <CircularProgress />
        </Stack>
      ) : orders?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Nenhum pedido encontrado.</Typography>
        </Paper>
      ) : isDesktop ? (
        <Paper elevation={1} sx={{ overflow: "hidden", p: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table
              size="medium"
              sx={{
                "& th": { fontWeight: 700, blackSpace: "nowrap", color: "text.secondary" },
                "& td, & th": { verticalAlign: "middle" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell width={90}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PrintIcon fontSize="small" />Imprimir</Box></TableCell>
                  <TableCell width={90}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><TagIcon fontSize="small" />Código</Box></TableCell>
                  <TableCell width={110}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LocalShippingIcon fontSize="small" />Tipo</Box></TableCell>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PersonIcon fontSize="small" />Cliente</Box></TableCell>
                  <TableCell width={150}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PhoneIcon fontSize="small" />Telefone</Box></TableCell>
                  <TableCell align="right" width={110}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}><AttachMoneyIcon fontSize="small" />Total</Box></TableCell>
                  <TableCell width={130}><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PaymentIcon fontSize="small" />Pagamento</Box></TableCell>
                  <TableCell align="right" width={100}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}><CurrencyExchangeIcon fontSize="small" />Troco</Box></TableCell>
                  <TableCell align="right" width={100}><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}><InfoIcon fontSize="small" />Status</Box></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow
                    key={order.id}
                    onClick={() => openOrderDetail(order)}
                    sx={{ cursor: "pointer", backgroundColor: order.status == STATUS.CANCELADO ? "#ffabab" : '#f0f9ff'}}
                  >
                    <TableCell align="center">
                      <IconButton size="small">
                        <PrintIcon sx={{color: 'black', fontSize: '1.5rem'}} fontSize="small" />
                      </IconButton>
                    </TableCell>

                    <TableCell sx={{color: 'black', fontSize: '1rem'}}>#{order.code}</TableCell>
                    <TableCell sx={{ color: 'black', fontSize: '1rem', fontWeight: 600 }}>{order.type === 'pickup' ? 'Retirada' : capitalizeMask(order.type)}</TableCell>
                    <TableCell sx={{color: 'black', fontSize: '1rem'}}>{order.costumerName}</TableCell>
                    <TableCell sx={{color: 'black', fontSize: '1rem'}}>{phoneMask(order.costumerPhone)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'black', fontSize: '1rem' }}>
                      {moneyMask(Number(order.orderTotal) + deliveryFee(order))}
                    </TableCell>
                    <TableCell sx={{color: 'black'}}>{order.paymentMethod}</TableCell>
                    <TableCell align="right" sx={{ color: 'black', fontSize: '1rem' }}>
                      {order.changeFor != null && order.changeFor > 0
                        ? moneyMask(order.changeFor - order.orderTotal)
                        : "—"}
                    </TableCell>
                    {order.status == STATUS.CANCELADO ? (
                      <TableCell align="right"/>
                    ) : (
                      <TableCell align="right">
                        <Stack direction={'row'} spacing={1}>

                          <Button 
                            endIcon={<WhatsAppIcon />} 
                            sx={{ textTransform: 'none' }} 
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `whatsapp://send?phone=55${order.costumerPhone}&text=${encodeURIComponent(`Olá, ${order.costumerName}, Recebemos seu pedido!`)}`
                            }}
                          >  
                          Recebido
                          </Button>
                          
                          <Select
                            value={order.status}
                            size="small"
                            onChange={(e) => updateStatusOrder(e.target.value, order.id)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: 'white',
                              backgroundColor: STATUS_COLOR(order.status),
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
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {orders?.map((order) => (
            <Paper
              key={order.id}
              sx={{ p: 2, cursor: "pointer" }}
              onClick={() => openOrderDetail(order)}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 700 }}>#{order.code}</Typography>
                <Chip
                  size="small"
                  label={order.type === "delivery" ? "Delivery" : "Retirada"}
                  color={order.type === "delivery" ? "primary" : "default"}
                  variant="outlined"
                />
              </Stack>

              <Stack sx={{ mt: 1 }}>
                <Typography variant="body2">{order.costumerName}</Typography>
                <Typography variant="body2" color="text.secondary">{order.costumerPhone}</Typography>
              </Stack>

              {/* <Divider sx={{ my: 1.5 }} /> */}

              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">{order.paymentMethod}</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {Number(order.orderTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction={'row'} spacing={1}>
                <Button 
                  endIcon={<WhatsAppIcon />} 
                  sx={{ textTransform: 'none' }} 
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `whatsapp://send?phone=55${order.costumerPhone}&text=${encodeURIComponent(`Olá, ${order.costumerName}, Recebemos seu pedido!`)}`
                  }}
                  >  
                Recebido
                </Button>
                
                <Select
                  value={order.status}
                  size="small"
                  onChange={(e) => updateStatusOrder(e.target.value, order.id)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: 'white',
                    backgroundColor: STATUS_COLOR(order.status),
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
  
            </Paper>
          ))}
        </Stack>
      )}
    </>
  )
}