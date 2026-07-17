import {
  Box, Paper, Stack, TextField, MenuItem, Select,
  Table, TableHead, TableBody, TableRow, TableCell, InputAdornment,
  IconButton, Chip, CircularProgress, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import UseOrdersController from "./UseOrdersController";

export default function Orders() {

  const { filter, isDesktop, query, setFilter, setQuery, setType, type, orders, loading } = UseOrdersController()

  const filteredOrders = orders.filter((order) => {
    const matchesQuery = query
      ? order.code?.toString().includes(query) ||
        order.costumerName?.toLowerCase().includes(query.toLowerCase()) ||
        order.costumerPhone?.includes(query)
      : true;

    const matchesType = type === "Todos os tipos" || order.type === type.toLowerCase();

    return matchesQuery && matchesType;
  });

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
          <TextField
            size="small"
            placeholder="Buscar por código, cliente ou telefone"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
          />
          <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 200 }}>
            {["Todos"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
          <Select size="small" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 170 }}>
            <MenuItem value="Todos os tipos">Todos os tipos</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
            <MenuItem value="retirada">Retirada</MenuItem>
          </Select>
        </Stack>
      </Paper>

      {loading ? (
        <Stack>
          <CircularProgress />
        </Stack>
      ) : filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Nenhum pedido encontrado.</Typography>
        </Paper>
      ) : isDesktop ? (
        <Paper sx={{ overflow: "hidden" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell width={64}>Imprimir</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell>Troco</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover sx={{ cursor: "pointer" }}>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); /* imprimir */ }}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>{order.code}</TableCell>
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
                    <TableCell align="right">
                      {Number(order.orderTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
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
          {filteredOrders.map((order) => (
            <Paper key={order.id} sx={{ p: 2 }}>
              <Stack>
                <Typography sx={{ fontWeight: 700 }}>#{order.code}</Typography>
                <Chip
                  size="small"
                  label={order.type === "delivery" ? "Delivery" : "Retirada"}
                  color={order.type === "delivery" ? "primary" : "default"}
                  variant="outlined"
                />
              </Stack>
              <Typography variant="body2">{order.costumerName}</Typography>
              <Typography variant="body2" color="text.secondary">{order.costumerPhone}</Typography>
              <Stack>
                <Typography variant="body2">{order.paymentMethod}</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {Number(order.orderTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}