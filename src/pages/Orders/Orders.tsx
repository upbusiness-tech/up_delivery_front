import { Stack } from "@mui/material";

import UseOrdersController from "./UseOrdersController";
import { OrderTable } from "../../components/OrdersComponents/OrderTable/OrderTable";
import OrderDetail from "../../components/OrdersComponents/OrderDetails/OrderDetails";
import { HeaderOrders } from "../../components/OrdersComponents/HeaderComponents/HeaderOrders";

export default function Orders() {

  const {
    isDesktop, 
    orders, 
    isLoading,
    openOrderDetail, 
    selectedOrder,
    closeOrderDetail
  } = UseOrdersController()

  return (
    <Stack spacing={2}>
      <HeaderOrders orders={orders} />
      <OrderTable 
        orders={orders} 
        isDesktop={isDesktop} 
        loading={isLoading} 
        openOrderDetail={openOrderDetail} 
      />

      <OrderDetail
        order={selectedOrder}
        onClose={closeOrderDetail}
      />

      {/* <PrintOrder order={orderToPrint} /> */}
    </Stack>
  );
}