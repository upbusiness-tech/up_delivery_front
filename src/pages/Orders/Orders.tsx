import { Stack } from "@mui/material";

import UseOrdersController from "./UseOrdersController";
import OrderDetail from "../../components/OrdersComponents/OrderDetails/OrderDetails";
import PrintOrder from "../../utils/print/orderPrint";
import { OrderTable } from "../../components/OrdersComponents/OrderTable/OrderTable";
import { HeadarOrders } from "../../components/OrdersComponents/HeaderComponents/HeaderOrders";

export default function Orders() {

  const {
    isDesktop, orders, loading,
    selectedOrder, openOrderDetail, closeOrderDetail,
    orderToPrint, updateStatusOrder, deliveryFee 
  } = UseOrdersController()

  return (
    <Stack spacing={2}>
      <HeadarOrders/>
      <OrderTable 
        orders={orders} 
        isDesktop={isDesktop} 
        loading={loading} 
        openOrderDetail={openOrderDetail} 
        updateStatusOrder={updateStatusOrder} 
        deliveryFee={deliveryFee}
      />

      <OrderDetail
        order={selectedOrder}
        onClose={closeOrderDetail}
        updateStatusOrder={updateStatusOrder}
      />

      <PrintOrder order={orderToPrint} />
    </Stack>
  );
}