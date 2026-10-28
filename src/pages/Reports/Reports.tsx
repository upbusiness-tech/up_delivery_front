import { useState, type FormEvent, type ReactNode } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TuneIcon from "@mui/icons-material/Tune";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UseReportsController from "./UseReportsController";
import { AuthService } from "../../api/services/auth.service";
import { moneyMask, paymentMethodMask, phoneMask } from "../../utils/masks/mask";
import { STATUS, STATUS_LABEL } from "../../utils/texts/status.enum";
import STATUS_COLOR from "../../utils/colors/colors";
import type {
  OrderReportProductSummary,
  OrderReportSummary,
} from "../../types/Report.type";

const PAYMENT_OPTIONS = [
  { value: "pix", label: "Pix" },
  { value: "CREDITO", label: "Crédito" },
  { value: "DEBITO", label: "Débito" },
  { value: "cash", label: "Dinheiro" },
];

const TYPE_OPTIONS = [
  { value: "delivery", label: "Entrega" },
  { value: "pickup", label: "Retirada" },
];

const INFO_PANEL_WIDTH = 300;
const INFO_RAIL_WIDTH = 48;

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function SummaryCard({
  icon,
  label,
  value,
  helper,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
  color: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ px: 1.5, py: 1.25, borderRadius: 2, height: "100%", borderColor: "#E5E7EB" }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            bgcolor: `${color}14`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 600, display: "block", lineHeight: 1.2 }}
          >
            {label}
          </Typography>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ fontWeight: 800, lineHeight: 1.25 }}
          >
            {value}
          </Typography>
          <Typography
            noWrap
            sx={{ color: "text.secondary", fontSize: 11, lineHeight: 1.2 }}
          >
            {helper}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function ReportsInfoContent({
  summary,
  products,
  periodLabel,
  totalOrders,
}: {
  summary: OrderReportSummary;
  products: OrderReportProductSummary[];
  periodLabel: string;
  totalOrders: number;
}) {
  const topProducts = products.slice(0, 5);

  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography
          sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}
        >
          Período
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {periodLabel}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {totalOrders} pedido(s) pago(s)
        </Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
          Formas de pagamento
        </Typography>

        {summary.paymentMethods.length === 0 ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Nenhum pagamento no período.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {summary.paymentMethods.map((payment) => {
              const share =
                summary.totalRevenue > 0
                  ? (payment.revenue / summary.totalRevenue) * 100
                  : 0;

              return (
                <Box key={payment.method}>
                  <Stack
                    direction="row"
                    sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {paymentMethodMask(payment.method)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {moneyMask(payment.revenue)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, share))}
                    sx={{ height: 5, borderRadius: 3, mt: 0.5 }}
                  />
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {payment.orders} pedido(s) • {share.toFixed(0)}%
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
          Produtos mais vendidos
        </Typography>

        {topProducts.length === 0 ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Nenhum produto no período.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {topProducts.map((product) => (
              <Stack
                key={product.name}
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }} title={product.name}>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {product.quantity} un.
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {moneyMask(product.revenue)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default function Reports() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <ReportsPasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <ReportsDashboard />;
}

function ReportsPasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await AuthService.verifyPassword(password);
      setPassword("");
      onUnlock();
    } catch (authError) {
      const code = (authError as { code?: string })?.code;

      if (code === "auth/too-many-requests") {
        setError("Muitas tentativas. Aguarde alguns instantes.");
      } else if (code === "auth/network-request-failed") {
        setError("Falha de conexão. Verifique sua internet.");
      } else {
        setError("Senha incorreta. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        variant="outlined"
        sx={{ width: "100%", maxWidth: 360, p: 2.5, borderRadius: 3 }}
      >
        <Stack spacing={1.75} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            <LockOutlinedIcon />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Relatórios protegidos
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Informe a senha do restaurante para acessar.
            </Typography>
          </Box>

          <TextField
            autoFocus
            fullWidth
            size="small"
            type="password"
            label="Senha"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
            error={Boolean(error)}
            helperText={error || " "}
            autoComplete="current-password"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={!password || submitting}
          >
            {submitting ? "Verificando..." : "Acessar"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function ReportsDashboard() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [infoOpen, setInfoOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

  const {
    filters,
    updateFilter,
    filtersOpen,
    openFilters,
    closeFilters,
    activeFilterCount,
    periodLabel,
    searchInput,
    setSearchInput,
    resetFilters,
    page,
    setPage,
    rowsPerPage,
    handleRowsPerPageChange,
    tab,
    setTab,
    productPage,
    setProductPage,
    productRowsPerPage,
    handleProductRowsPerPageChange,
    orders,
    products,
    visibleProducts,
    summary,
    totalOrders,
    isFetching,
    error,
    refetch,
  } = UseReportsController();

  const infoPanelWidth = infoOpen ? INFO_PANEL_WIDTH : INFO_RAIL_WIDTH;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
      <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Badge
              badgeContent={activeFilterCount}
              color="primary"
              overlap="rectangular"
              invisible={activeFilterCount === 0}
            >
              <Button
                size="small"
                variant="outlined"
                startIcon={<TuneIcon fontSize="small" />}
                onClick={openFilters}
              >
                Filtros
              </Button>
            </Badge>

            <IconButton
              size="small"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-label="Atualizar relatório"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {periodLabel} • {totalOrders} pedido(s)
            </Typography>

            {!isDesktop && (
              <IconButton
                size="small"
                onClick={() => setMobileInfoOpen(true)}
                aria-label="Abrir informações do relatório"
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            }
          >
            Não foi possível carregar os relatórios.
          </Alert>
        )}

        <Grid container spacing={1.25}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SummaryCard
              icon={<AttachMoneyIcon fontSize="small" />}
              label="Faturamento"
              value={moneyMask(summary.totalRevenue)}
              helper="Pedidos pagos no período"
              color="#16A34A"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SummaryCard
              icon={<ReceiptLongIcon fontSize="small" />}
              label="Pedidos"
              value={String(summary.totalOrders)}
              helper="Pedidos pagos no período"
              color="#2563EB"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SummaryCard
              icon={<ShoppingBagIcon fontSize="small" />}
              label="Ticket médio"
              value={moneyMask(summary.averageTicket)}
              helper="Faturamento por pedido"
              color="#D97706"
            />
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{ border: "1px solid #E5E7EB", borderRadius: 2.5, overflow: "hidden" }}
        >
          <Tabs
            value={tab}
            onChange={(_, value: number) => setTab(value)}
            sx={{
              px: 0.5,
              minHeight: 40,
              borderBottom: "1px solid #E5E7EB",
              "& .MuiTab-root": { minHeight: 40, py: 0.75, fontSize: 13, fontWeight: 700 },
            }}
          >
            <Tab label={`Pedidos (${totalOrders})`} />
            <Tab label={`Produtos (${products.length})`} />
          </Tabs>
          {isFetching && <LinearProgress />}

          {tab === 0 && (
            <>
              <TableContainer>
                <Table
                  size="small"
                  sx={{ "& .MuiTableCell-root": { py: 0.75, fontSize: 13 } }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Pedido</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Pagamento</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isFetching && orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Nenhum pedido encontrado com os filtros selecionados.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow hover key={order.id}>
                          <TableCell>
                            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                              #{order.code}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatDateTime(order.created_at)}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                              {order.costumerName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              {phoneMask(order.costumerPhone)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              variant="outlined"
                              color={order.type === "delivery" ? "primary" : "default"}
                              label={order.type === "delivery" ? "Entrega" : "Retirada"}
                              sx={{ height: 20, fontSize: 11 }}
                            />
                          </TableCell>
                          <TableCell>{paymentMethodMask(order.paymentMethod)}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={STATUS_LABEL[order.status as STATUS] ?? order.status}
                              sx={{
                                height: 20,
                                fontSize: 11,
                                bgcolor: STATUS_COLOR(order.status),
                                color: "#111827",
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                              {moneyMask(Number(order.orderTotal))}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalOrders}
                page={page}
                onPageChange={(_, value) => setPage(value)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) =>
                  handleRowsPerPageChange(Number(event.target.value))
                }
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage="Por página"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                sx={{
                  "& .MuiTablePagination-toolbar": { minHeight: 40 },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    fontSize: 12,
                  },
                }}
              />
            </>
          )}

          {tab === 1 && (
            <>
              <TableContainer>
                <Table
                  size="small"
                  sx={{ "& .MuiTableCell-root": { py: 0.75, fontSize: 13 } }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Produto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Quantidade
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Faturamento
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Participação
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isFetching && products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : visibleProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Nenhum produto vendido no período selecionado.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      visibleProducts.map((product) => (
                        <TableRow hover key={product.name}>
                          <TableCell>
                            <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                              {product.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{product.quantity}</TableCell>
                          <TableCell align="right">{moneyMask(product.revenue)}</TableCell>
                          <TableCell align="right">
                            {summary.totalRevenue > 0
                              ? `${((product.revenue / summary.totalRevenue) * 100).toFixed(1)}%`
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={products.length}
                page={productPage}
                onPageChange={(_, value) => setProductPage(value)}
                rowsPerPage={productRowsPerPage}
                onRowsPerPageChange={(event) =>
                  handleProductRowsPerPageChange(Number(event.target.value))
                }
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage="Por página"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                sx={{
                  "& .MuiTablePagination-toolbar": { minHeight: 40 },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    fontSize: 12,
                  },
                }}
              />
            </>
          )}
        </Paper>
      </Stack>

      {isDesktop && (
        <Paper
          variant="outlined"
          sx={{
            width: infoPanelWidth,
            flexShrink: 0,
            position: "sticky",
            top: 16,
            maxHeight: "calc(100vh - 96px)",
            borderRadius: 2.5,
            borderColor: "#E5E7EB",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shorter,
            }),
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: infoOpen ? "space-between" : "center",
              px: infoOpen ? 1.5 : 0,
              py: 1,
              borderBottom: infoOpen ? "1px solid #E5E7EB" : 0,
            }}
          >
            {infoOpen && (
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Informações
              </Typography>
            )}
            <IconButton
              size="small"
              onClick={() => setInfoOpen((previous) => !previous)}
              aria-label={infoOpen ? "Retrair informações" : "Expandir informações"}
            >
              {infoOpen ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>

          {infoOpen ? (
            <Box sx={{ p: 1.5, overflowY: "auto" }}>
              <ReportsInfoContent
                summary={summary}
                products={products}
                periodLabel={periodLabel}
                totalOrders={totalOrders}
              />
            </Box>
          ) : (
            <Box sx={{ py: 1, display: "grid", placeItems: "center", color: "text.secondary" }}>
              <InfoOutlinedIcon fontSize="small" />
            </Box>
          )}
        </Paper>
      )}

      <Drawer
        anchor="right"
        open={mobileInfoOpen}
        onClose={() => setMobileInfoOpen(false)}
        slotProps={{ paper: { sx: { width: 320, maxWidth: "90vw" } } }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 1,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Informações
          </Typography>
          <IconButton size="small" onClick={() => setMobileInfoOpen(false)} aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ p: 1.5 }}>
          <ReportsInfoContent
            summary={summary}
            products={products}
            periodLabel={periodLabel}
            totalOrders={totalOrders}
          />
        </Box>
      </Drawer>

      <Dialog open={filtersOpen} onClose={closeFilters} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ py: 1.5, px: 2, fontSize: 18, fontWeight: 800 }}>
          Filtros
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                fullWidth
                type="date"
                size="small"
                label="De"
                value={filters.startDate}
                onChange={(event) => updateFilter("startDate", event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                type="date"
                size="small"
                label="Até"
                value={filters.endDate}
                onChange={(event) => updateFilter("endDate", event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>

            <FormControl fullWidth size="small">
              <InputLabel>Pagamento</InputLabel>
              <Select
                label="Pagamento"
                value={filters.paymentMethod}
                onChange={(event) => updateFilter("paymentMethod", event.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {PAYMENT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={filters.type}
                onChange={(event) =>
                  updateFilter("type", event.target.value as "" | "delivery" | "pickup")
                }
              >
                <MenuItem value="">Todos</MenuItem>
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {Object.values(STATUS).map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              placeholder="Cliente ou número do pedido"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="Limpar pesquisa"
                        onClick={() => setSearchInput("")}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button size="small" onClick={resetFilters}>
            Limpar filtros
          </Button>
          <Button size="small" variant="contained" onClick={closeFilters}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
