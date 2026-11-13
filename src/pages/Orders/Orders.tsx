import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import UseOrdersController, { type OrderStatusFilter } from "./UseOrdersController";
import { STATUS } from "../../utils/texts/status.enum";
import { OrderTable } from "../../components/OrdersComponents/OrderTable/OrderTable";
import OrderDetail from "../../components/OrdersComponents/OrderDetails/OrderDetails";
import { HeaderOrders } from "../../components/OrdersComponents/HeaderComponents/HeaderOrders";
import UpdatesModal from "../../components/OrdersComponents/UpdatesModal/UpdatesModal";

const UPDATES = [
  { text: "Agora você pode pesquisar pedidos pelo nome ou número do cliente, facilitando a localização rápida de pedidos na tabela." },
  { text: "Implementada a fila de impressão automática para novos pedidos, com processamento sequencial" },
  { text: "Corrigidos os erros na geração de pagamentos via PIX, proporcionando mais estabilidade e confiabilidade durante o pagamento." },
];

const ORDER_FILTERS: { value: OrderStatusFilter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: STATUS.PENDENTE, label: "Pendentes" },
  { value: STATUS.EM_PREPARO, label: "Em preparo" },
  { value: STATUS.EM_ROTA, label: "Em rota" },
  { value: STATUS.PRONTO_RETIRADA, label: "Prontos para retirada" },
  { value: STATUS.FINALIZADO, label: "Finalizados" },
];

export default function Orders() {

  const {
    isDesktop, 
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    hasSearch,
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    isLoading,
    error,
    refetch,
    openOrderDetail, 
    selectedOrder,
    closeOrderDetail
  } = UseOrdersController()

  return (
    <Stack spacing={2}>
      <HeaderOrders orders={orders} />
      <Paper elevation={0} sx={{ p: 1.5, border: "1px solid #E5E7EB", borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Pesquisar por nome ou telefone..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Limpar pesquisa"
                      onClick={() => setSearchTerm("")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          <Box sx={{ overflowX: "auto", pb: 0.5 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={statusFilter}
              onChange={(_event, value: OrderStatusFilter | null) => {
                if (value) setStatusFilter(value);
              }}
              aria-label="Filtrar pedidos por status"
              sx={{
                flexWrap: "nowrap",
                gap: 0.75,
                minWidth: "max-content",
                "& .MuiToggleButton-root": {
                  px: 1.5,
                  py: 0.7,
                  border: "1px solid #E2E8F0 !important",
                  borderRadius: "999px !important",
                  color: "#475569",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { backgroundColor: "#F8FAFC" },
                  "&.Mui-selected": {
                    backgroundColor: "#0F172A",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1E293B" },
                  },
                },
              }}
            >
              {ORDER_FILTERS.map((filter) => (
                <ToggleButton key={filter.value} value={filter.value}>
                  {filter.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Paper>
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar os pedidos.
        </Alert>
      )}
      <OrderTable 
        orders={filteredOrders} 
        isDesktop={isDesktop} 
        loading={isLoading} 
        openOrderDetail={openOrderDetail}
        emptyMessage={
          hasActiveFilters
            ? hasSearch && statusFilter !== "ALL"
              ? "Nenhum pedido corresponde à pesquisa e ao status selecionado."
              : hasSearch
                ? "Nenhum pedido corresponde à pesquisa."
                : "Nenhum pedido com este status."
            : undefined
        }
      />

      <OrderDetail
        order={selectedOrder}
        onClose={closeOrderDetail}
      />

      <UpdatesModal updates={UPDATES} />

      {/* <PrintOrder order={orderToPrint} /> */}
    </Stack>
  );
}