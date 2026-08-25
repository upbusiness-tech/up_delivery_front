import { Box, Button, Chip, CircularProgress, Divider, IconButton, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { moneyMask, paymentMethodMask, phoneMask } from "../../../utils/masks/mask";
import { STATUS, STATUS_LABEL } from "../../../utils/texts/status.enum";
import type { Order } from "../../../types/Order.type";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import STATUS_COLOR from "../../../utils/colors/colors";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useOrderTableController } from "./UseOrderTableController";

interface Props {
  orders: Order[] | undefined;
  loading: boolean;
  isDesktop: boolean;
  openOrderDetail: (order: Order) => void;
  deliveryFee: (order: Order) => number;
  updateStatusOrder: (status: string, orderId: string) => Promise<void>;
}

export function OrderTable({ orders, loading, isDesktop, updateStatusOrder, deliveryFee, openOrderDetail }: Props) {
  const { isReceived, handleReceived, handleStatusChange } = useOrderTableController({ updateStatusOrder });

  if (loading) {
    return <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", py: 8 }}><CircularProgress size={32} /></Stack>;
  }

  if (!orders || orders.length === 0) {
    return <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}><Typography sx={{ color: "#64748B", fontSize: "0.9rem" }}>Nenhum pedido encontrado.</Typography></Paper>;
  }

  if (isDesktop) {
    return (
      <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid #E5E7EB", borderRadius: 3, backgroundColor: "#fff" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="medium" sx={{ minWidth: 1100, "& th": { backgroundColor: "#F8FAFC", color: "#64748B", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", borderBottom: "1px solid #E5E7EB", whiteSpace: "nowrap", py: 1.5 }, "& td": { borderBottom: "1px solid #F1F5F9", py: 1.6 }, "& tbody tr": { transition: "all 0.15s ease", backgroundColor: "#fff" }, "& tbody tr:hover": { backgroundColor: "#F8FAFC" }, "& tbody tr:last-child td": { borderBottom: 0 } }}>
            <TableHead><TableRow><TableCell width={70} align="center">Ações</TableCell><TableCell width={90}>Pedido</TableCell><TableCell width={120}>Tipo</TableCell><TableCell>Cliente</TableCell><TableCell width={150}>Telefone</TableCell><TableCell width={130} align="right">Total</TableCell><TableCell width={130}>Pagamento</TableCell><TableCell width={100} align="right">Troco</TableCell><TableCell width={230} align="right">Status</TableCell></TableRow></TableHead>
            <TableBody>
              {orders.map((order) => {
                const isCancelled = order.status === STATUS.CANCELADO;
                const total = Number(order.orderTotal) + deliveryFee(order);
                const change = Number(order.changeFor) - total;
                const received = isReceived(order);

                return (
                  <TableRow key={order.id} onClick={() => openOrderDetail(order)} sx={{ cursor: "pointer", backgroundColor: isCancelled ? "#FFF7F7" : "#fff", "&:hover": { backgroundColor: isCancelled ? "#FFF1F2" : "#F8FAFC" } }}>
                    <TableCell align="center"><IconButton size="small" onClick={(e) => e.stopPropagation()} sx={{ width: 34, height: 34, border: "1px solid #E2E8F0", borderRadius: 2, color: "#475569", "&:hover": { backgroundColor: "#F1F5F9" } }}><PrintIcon fontSize="small" /></IconButton></TableCell>
                    <TableCell><Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>#{order.code}</Typography></TableCell>
                    <TableCell><Chip size="small" icon={<LocalShippingIcon sx={{ fontSize: 15 }} />} label={order.type === "pickup" ? "Retirada" : "Delivery"} sx={{ fontWeight: 600, fontSize: "0.75rem", backgroundColor: order.type === "pickup" ? "#F1F5F9" : "#EFF6FF", color: order.type === "pickup" ? "#475569" : "#2563EB", border: "none" }} /></TableCell>
                    <TableCell><Box><Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#0F172A" }}>{order.costumerName}</Typography><Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", mt: 0.25 }}>Cliente</Typography></Box></TableCell>
                    <TableCell><Typography sx={{ fontSize: "0.85rem", color: "#475569" }}>{phoneMask(order.costumerPhone)}</Typography></TableCell>
                    <TableCell align="right"><Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>{moneyMask(total)}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#475569" }}>{paymentMethodMask(order.paymentMethod)}</Typography></TableCell>
                    <TableCell align="right"><Typography sx={{ fontSize: "0.85rem", color: "#475569" }}>{order.paymentMethod === "cash" && Number(order.changeFor) > 0 ? moneyMask(change) : "—"}</Typography></TableCell>
                    <TableCell align="right">
                      {isCancelled ? <Chip label="Cancelado" size="small" sx={{ fontWeight: 700, backgroundColor: "#FEE2E2", color: "#B91C1C" }} /> : (
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                          <Button endIcon={<WhatsAppIcon sx={{ fontSize: "17px !important" }} />} variant={received ? "outlined" : "contained"} size="small" onClick={(e) => handleReceived(e, order)} sx={{ minWidth: 95, height: 34, textTransform: "none", borderRadius: 2, fontWeight: 600, backgroundColor: received ? "transparent" : "#25D366", color: received ? "#64748B" : "#fff", borderColor: received ? "#CBD5E1" : "#25D366", "&:hover": { backgroundColor: received ? "#F8FAFC" : "#20BD5A", borderColor: received ? "#94A3B8" : "#20BD5A" } }}>{received ? "Recebido" : "Receber"}</Button>
                          <Select value={order.status} size="small" onChange={(e) => handleStatusChange(e, order)} onClick={(e) => e.stopPropagation()} sx={{ minWidth: 135, height: 34, color: "#fff", fontWeight: 700, fontSize: "0.78rem", borderRadius: 2, backgroundColor: STATUS_COLOR(order.status), "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSelect-icon": { color: "#fff" } }}>
                            {Object.values(STATUS).filter((status) => status !== STATUS.CANCELADO).map((status) => <MenuItem key={status} value={status}>{STATUS_LABEL[status]}</MenuItem>)}
                          </Select>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    );
  }

  return (
    <Stack spacing={1.5}>
      {orders.map((order) => {
        const isCancelled = order.status === STATUS.CANCELADO;
        const total = Number(order.orderTotal) + deliveryFee(order);
        const received = isReceived(order);

        return (
          <Paper key={order.id} elevation={0} onClick={() => openOrderDetail(order)} sx={{ p: 2, cursor: "pointer", border: "1px solid #E5E7EB", borderRadius: 3, backgroundColor: isCancelled ? "#FFF7F7" : "#fff", transition: "all 0.15s ease", "&:hover": { backgroundColor: isCancelled ? "#FFF1F2" : "#F8FAFC", borderColor: "#CBD5E1" } }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box><Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>#{order.code}</Typography><Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", mt: 0.25 }}>Pedido</Typography></Box>
              <Chip size="small" label={order.type === "delivery" ? "Delivery" : "Retirada"} sx={{ fontWeight: 600, backgroundColor: order.type === "delivery" ? "#EFF6FF" : "#F1F5F9", color: order.type === "delivery" ? "#2563EB" : "#475569", border: "none" }} />
            </Stack>
            <Box sx={{ mt: 2 }}><Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#0F172A" }}>{order.costumerName}</Typography><Typography sx={{ fontSize: "0.78rem", color: "#64748B", mt: 0.25 }}>{phoneMask(order.costumerPhone)}</Typography></Box>
            <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box><Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>Pagamento</Typography><Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", mt: 0.25 }}>{paymentMethodMask(order.paymentMethod)}</Typography></Box>
              <Box sx={{ textAlign: "right" }}><Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>Total</Typography><Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#0F172A", mt: 0.25 }}>{moneyMask(total)}</Typography></Box>
            </Stack>
            <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />
            {isCancelled ? <Chip label="Cancelado" size="small" sx={{ fontWeight: 700, backgroundColor: "#FEE2E2", color: "#B91C1C" }} /> : (
              <Stack direction="row" spacing={1}>
                <Button endIcon={<WhatsAppIcon sx={{ fontSize: "17px !important" }} />} variant={received ? "outlined" : "contained"} size="small" onClick={(e) => handleReceived(e, order)} sx={{ minWidth: 95, height: 34, textTransform: "none", borderRadius: 2, fontWeight: 600, backgroundColor: received ? "transparent" : "#25D366", color: received ? "#64748B" : "#fff", borderColor: received ? "#CBD5E1" : "#25D366", "&:hover": { backgroundColor: received ? "#F8FAFC" : "#20BD5A", borderColor: received ? "#94A3B8" : "#20BD5A" } }}>{received ? "Recebido" : "Receber"}</Button>
                <Select value={order.status} size="small" onChange={(e) => handleStatusChange(e, order)} onClick={(e) => e.stopPropagation()} sx={{ flex: 1, height: 36, color: "#fff", fontWeight: 700, fontSize: "0.78rem", borderRadius: 2, backgroundColor: STATUS_COLOR(order.status), "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSelect-icon": { color: "#fff" } }}>
                  {Object.values(STATUS).filter((status) => status !== STATUS.CANCELADO).map((status) => <MenuItem key={status} value={status}>{STATUS_LABEL[status]}</MenuItem>)}
                </Select>
              </Stack>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
}