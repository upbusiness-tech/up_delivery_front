import { createFileRoute } from "@tanstack/react-router";
import {
  Box, Paper, Stack, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Button, IconButton, useMediaQuery, useTheme, Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { invoices, brl } from "@/lib/mock-data";
import { DataTablePagination, usePagination } from "@/components/DataTablePagination";

export const Route = createFileRoute("/faturas")({ component: FaturasPage });

function FaturasPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const pg = usePagination(invoices, 10);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Faturas</Typography>
        <Typography variant="body2" color="text.secondary">
          Histórico das mensalidades da sua assinatura na plataforma.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Plano atual</Typography>
            <Typography variant="h6">Plano Pro · {brl(199.9)}/mês</Typography>
            <Typography variant="body2" color="text.secondary">Próxima cobrança: 10/08/2026</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">Alterar plano</Button>
            <Button variant="contained">Atualizar cartão</Button>
          </Stack>
        </Stack>
      </Paper>

      {isDesktop ? (
        <Paper>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Referência</TableCell>
                  <TableCell>Plano</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pg.paginated.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{f.ref}</TableCell>
                    <TableCell>{f.plan}</TableCell>
                    <TableCell>{f.due}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{brl(f.value)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={f.status} color={f.status === "Paga" ? "success" : "error"} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="Baixar fatura"><DownloadIcon fontSize="small" /></IconButton>
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
          {pg.paginated.map((f) => (
            <Paper key={f.id} sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{f.ref}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.plan}</Typography>
                  <Typography variant="caption" color="text.secondary">Vence: {f.due}</Typography>
                </Box>
                <Chip size="small" label={f.status} color={f.status === "Paga" ? "success" : "error"} sx={{ flexShrink: 0 }} />
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{brl(f.value)}</Typography>
                <Button size="small" startIcon={<DownloadIcon />}>Baixar</Button>
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
