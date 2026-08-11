import {
  Box, Paper, Stack,
  Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Chip, CircularProgress, Typography, Divider,
  Select,
  MenuItem,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import UseOrdersController from "./UseOrdersController";
import OrderDetail from "../../components/OrdersComponents/OrderDetails/OrderDetails";
import  { STATUS, STATUS_LABEL } from "../../utils/texts/status.enum";
import STATUS_COLOR from "../../utils/colors/colors";
import PrintOrder from "../../utils/print/orderPrint";
import {capitalizeMask, moneyMask, phoneMask} from "../../utils/masks/mask";

export default function Orders() {

  const {
    isDesktop, orders, loading,
    selectedOrder, openOrderDetail, closeOrderDetail,
    orderToPrint, updateStatusOrder, deliveryFee 
  } = UseOrdersController()

  return (
    <Stack spacing={2}>
      {loading ? (
        <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", py: 6 }}>
          <CircularProgress />
        </Stack>
      ) : orders?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Nenhum pedido encontrado.</Typography>
        </Paper>
      ) : isDesktop ? (
        <Paper elevation={0} sx={{ overflow: "hidden" }}>
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
                  <TableCell align="center" width={64}>Imprimir</TableCell>
                  <TableCell width={90}>Código</TableCell>
                  <TableCell width={110}>Tipo</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell width={150}>Telefone</TableCell>
                  <TableCell align="right" width={110}>Total</TableCell>
                  <TableCell width={130}>Pagamento</TableCell>
                  <TableCell align="right" width={100}>Troco</TableCell>
                  <TableCell align="right" width={100}>Status</TableCell>
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
                    <TableCell sx={{color: 'black', fontSize: '1rem', fontWeight: 600}}>{capitalizeMask(order.type)}</TableCell>
                    <TableCell sx={{color: 'black', fontSize: '1rem'}}>{order.costumerName}</TableCell>
                    <TableCell sx={{color: 'black', fontSize: '1rem'}}>{phoneMask(order.costumerPhone)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'black', fontSize: '1rem' }}>
                      {moneyMask(Number(order.orderTotal) + deliveryFee(order))}
                    </TableCell>
                    <TableCell sx={{color: 'black'}}>{order.paymentMethod}</TableCell>
                    <TableCell align="right" sx={{color: 'black', fontSize: '1rem'}}>
                      {order.changeFor
                        ? moneyMask(order.changeFor)
                        : "—"}
                    </TableCell>
                    {order.status == STATUS.CANCELADO ? (
                      <TableCell align="right"/>
                    ) : (
                      <TableCell align="right">
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

              <Divider sx={{ my: 1.5 }} />

              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">{order.paymentMethod}</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {Number(order.orderTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </Typography>
              </Stack>

            
            </Paper>
          ))}
        </Stack>
      )}

      <OrderDetail
        order={selectedOrder}
        onClose={closeOrderDetail}
        updateStatusOrder={updateStatusOrder}
      />

      <PrintOrder order={orderToPrint} />
    </Stack>
  );
}