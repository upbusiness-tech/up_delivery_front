import {
  Box, Paper, Stack,
  Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Chip, CircularProgress, Typography, Divider,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import UseOrdersController from "./UseOrdersController";
import OrderDetail from "../../components/OrdersComponents/OrderDetails/OrderDetails";
import PrintOrder from "../../utils/orderPrint";

export default function Orders() {

  const {
    isDesktop, orders, loading,
    selectedOrder, openOrderDetail, closeOrderDetail,
    orderToPrint
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
        <Paper sx={{ overflow: "hidden" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table
              size="medium"
              sx={{
                "& th": { fontWeight: 700, whiteSpace: "nowrap", color: "text.secondary" },
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
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    onClick={() => openOrderDetail(order)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); /* imprimir */ }}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>#{order.code}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={order.type === "delivery" ? "Delivery" : "Retirada"}
                        color={order.type === "delivery" ? "primary" : "default"}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>{order.costumerName}</TableCell>
                    <TableCell>{order.costumerPhone}</TableCell>

                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {Number(order.orderTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </TableCell>

                    <TableCell>{order.paymentMethod}</TableCell>

                    <TableCell align="right">
                      {order.changeFor
                        ? Number(order.changeFor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        : "—"}
                    </TableCell>

                    
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

      <OrderDetail order={selectedOrder} onClose={closeOrderDetail} />
      <PrintOrder order={orderToPrint} />
    </Stack>
  );
}