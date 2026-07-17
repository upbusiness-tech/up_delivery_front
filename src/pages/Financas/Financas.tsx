import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Box, Paper, Stack, Typography, Grid, MenuItem, Select, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, Button, useMediaQuery, useTheme, Divider,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { orders, brl, statusColor } from "@/lib/mock-data";
import { DataTablePagination, usePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/financas")({ component: FinancasPage });

function StatCard({ label, value, hint, icon, color }: { label: string; value: string; hint: string; icon: React.ReactNode; color: string }) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 48, height: 48, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: color + "18", color, flexShrink: 0 }}>
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{hint}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function FinancasPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const total = orders.reduce((s, o) => s + o.total, 0);
  const avg = total / orders.length;

  const data = useMemo(() => orders, []);
  const pg = usePagination(data, 10);

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Finanças</Typography>
          <Typography variant="body2" color="text.secondary">Resumo financeiro e histórico de pedidos.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<FileDownloadIcon />}>Exportar relatório</Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard label="Pedidos hoje" value={String(orders.length)} hint="+3 vs ontem" icon={<ReceiptLongIcon />} color="#0288D1" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard label="Ticket médio" value={brl(avg)} hint="Média dos pedidos" icon={<ShowChartIcon />} color="#ED6C02" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard label="Total arrecadado" value={brl(total)} hint="Soma do dia" icon={<PaidIcon />} color="#2E7D32" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" }, flexWrap: "wrap" }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>Filtros:</Typography>
          <Select size="small" defaultValue="hoje">
            <MenuItem value="hoje">Hoje</MenuItem>
            <MenuItem value="7d">Últimos 7 dias</MenuItem>
            <MenuItem value="30d">Últimos 30 dias</MenuItem>
            <MenuItem value="mes">Este mês</MenuItem>
          </Select>
          <Select size="small" defaultValue="todos">
            <MenuItem value="todos">Todas formas de pagamento</MenuItem>
            <MenuItem value="pix">Pix</MenuItem>
            <MenuItem value="dinheiro">Dinheiro</MenuItem>
            <MenuItem value="cartao">Cartão</MenuItem>
          </Select>
          <Select size="small" defaultValue="todos-status">
            <MenuItem value="todos-status">Todos os status</MenuItem>
            <MenuItem value="finalizado">Finalizado</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
          </Select>
          <Select size="small" defaultValue="todos-tipos">
            <MenuItem value="todos-tipos">Todos os tipos</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
            <MenuItem value="retirada">Retirada</MenuItem>
          </Select>
        </Stack>
      </Paper>

      {isDesktop ? (
        <Paper>
          <Box sx={{ p: 2, borderBottom: "1px solid #E5E7EB" }}>
            <Typography variant="subtitle1">Pedidos</Typography>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pg.paginated.map((o) => (
                  <TableRow key={o.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{o.code}</TableCell>
                    <TableCell>{o.createdAt}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell><Chip size="small" label={o.type} variant="outlined" /></TableCell>
                    <TableCell>{o.payment}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{brl(o.total)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={o.status} color={statusColor[o.status]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <DataTablePagination
            count={pg.total} page={pg.page} rowsPerPage={pg.rowsPerPage}
            onPageChange={pg.onPageChange} onRowsPerPageChange={pg.onRowsPerPageChange}
          />
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {pg.paginated.map((o) => (
            <Paper key={o.id} sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{o.code} · {o.customer}</Typography>
                  <Typography variant="body2" color="text.secondary">{o.createdAt} · {o.payment}</Typography>
                </Box>
                <Chip size="small" label={o.status} color={statusColor[o.status]} sx={{ flexShrink: 0 }} />
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Chip size="small" label={o.type} variant="outlined" />
                <Typography variant="h6">{brl(o.total)}</Typography>
              </Stack>
            </Paper>
          ))}
          <Paper>
            <DataTablePagination
              count={pg.total} page={pg.page} rowsPerPage={pg.rowsPerPage}
              onPageChange={pg.onPageChange} onRowsPerPageChange={pg.onRowsPerPageChange}
            />
          </Paper>
        </Stack>
      )}
    </Stack>
  );
}
