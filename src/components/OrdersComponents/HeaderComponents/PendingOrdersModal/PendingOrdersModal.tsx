import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { Order } from "../../../../types/Order.type";
import { moneyMask, paymentMethodMask, phoneMask } from "../../../../utils/masks/mask";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/PrintOutlined";

interface props {
  open: boolean;
  onClose: () => void;
  orders: Order[];
  onReceive: (order: Order) => void;
  isReceiving?: boolean;
}

export default function PendingOrdersModal({ onClose, open, orders, onReceive, isReceiving }: props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ sx: { borderRadius: 3, maxHeight: "90vh" } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E7EB", py: 1.25, px: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Pedidos pendentes</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#64748B" }}>{orders.length} {orders.length === 1 ? "pedido pendente" : "pedidos pendentes"}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ width: 28, height: 28, border: "1px solid #E2E8F0", borderRadius: 1.5, color: "#64748B", "&:hover": { backgroundColor: "#F8FAFC" } }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 1 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small" sx={
            { "& th": { backgroundColor: "#F8FAFC", color: "#64748B", fontSize: "0.68rem", fontWeight: 700, 
            textTransform: "uppercase", letterSpacing: "0.03em", borderBottom: "1px solid #E5E7EB", whiteSpace: "nowrap", py: 1.75, px: 1.5 }, 
            "& td": { borderBottom: "1px solid #F1F5F9", py: 1.5, px: 1.5 }, 
            "& tbody tr:hover": { backgroundColor: "#F8FAFC" }, 
            "& tbody tr:last-child td": { borderBottom: 0 } }
            }>
            <TableHead>
              <TableRow>
                <TableCell align="center">Pedido</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Pagamento</TableCell>
                <TableCell align="center">Ação</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => {
                return (
                  <TableRow key={order.id} sx={{ backgroundColor: "#fff", "&:hover": { backgroundColor: "#F8FAFC" } }}>
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => e.stopPropagation()} sx={{ width: 34, height: 34, border: "1px solid #E2E8F0", borderRadius: 2, color: "#475569", "&:hover": { backgroundColor: "#F1F5F9" } }}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>#{order.code}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip size="small" icon={<LocalShippingIcon sx={{ fontSize: 15 }} />} label={order.type === "pickup" ? "Retirada" : "Delivery"} sx={{ fontWeight: 600, fontSize: "0.75rem", backgroundColor: order.type === "pickup" ? "#F1F5F9" : "#EFF6FF", color: order.type === "pickup" ? "#475569" : "#2563EB", border: "none" }} />
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#0F172A" }}>{order.costumerName}</Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", mt: 0.25 }}>Cliente</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: "0.85rem", color: "#475569" }}>{phoneMask(order.costumerPhone)}</Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>{moneyMask(order.orderTotal)}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#475569" }}>{paymentMethodMask(order.paymentMethod)}</Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography sx={{ fontSize: "0.85rem", color: "#475569" }}>
                        {order.paymentMethod === "cash" && Number(order.changeFor) > 0
                          ? moneyMask(Number(order.changeFor) - Number(order.orderTotal))
                          : "—"}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        disabled={isReceiving}
                        onClick={() => onReceive(order)}
                        sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, backgroundColor: "#25D366", "&:hover": { backgroundColor: "#20BD5A" } }}
                      >
                        Receber
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  );
}