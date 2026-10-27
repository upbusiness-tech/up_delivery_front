import { Alert, Button, IconButton, InputAdornment, Paper, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import UseOrdersController from "./UseOrdersController";
import { OrderTable } from "../../components/OrdersComponents/OrderTable/OrderTable";
import OrderDetail from "../../components/OrdersComponents/OrderDetails/OrderDetails";
import { HeaderOrders } from "../../components/OrdersComponents/HeaderComponents/HeaderOrders";
import UpdatesModal from "../../components/OrdersComponents/UpdatesModal/UpdatesModal";

const UPDATES = [
  { text: "Agora você pode pesquisar pedidos pelo nome ou número do cliente, facilitando a localização rápida de pedidos na tabela." },
  { text: "Implementada a fila de impressão automática para novos pedidos, com processamento sequencial" },
  { text: "Corrigidos os erros na geração de pagamentos via PIX, proporcionando mais estabilidade e confiabilidade durante o pagamento." },
];

export default function Orders() {

  const {
    isDesktop, 
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    hasSearch,
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
        emptyMessage={hasSearch ? "Nenhum pedido corresponde à pesquisa." : undefined}
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