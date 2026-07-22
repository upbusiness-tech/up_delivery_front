import { useState } from "react";
import type { Order, OrderItem } from "../../../types/Order.type";
import { STATUS } from "../../../utils/status.enum";
import UseOrdersController from "../../../pages/Orders/UseOrdersController";

interface UseOrderDetailControllerParams {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string) => Promise<void> | void;
  onPrint?: (order: Order) => void;
}

export function useOrderDetailController({ order, onClose }: UseOrderDetailControllerParams) {
  const [openModalOrderCancel, setOpenModalOrderCancel] = useState<boolean>(false)
  const handleOpenModalOrderCancel = () => setOpenModalOrderCancel(true)
  const handleCloseModalOrderCancel = () => setOpenModalOrderCancel(false)

    const {  updateStatusOrder } = UseOrdersController()
  
  const open = Boolean(order);

  function getItemFlavorLines(item: OrderItem): string[] {
    const limitFlavors = item.flavors?.[0]?.size?.limitFlavors ?? 1;
    // Se for so 1 sabor permitido, mostra só o nome do produto
    if (limitFlavors <= 1) {
      return [];
    }
    // Mais de 1 sabor permitido mostra os nomes dos sabores
    return item.flavors.map((f, index) =>
      `${index + 1}/${limitFlavors} ${f.product.productName}`
    );
  }

  async function cancelOrder(){
    if(!order) return;
    await updateStatusOrder(STATUS.CANCELADO, order?.id);
    handleCloseModalOrderCancel()
    onClose()
  }


  return {
    open,
    order,
    getItemFlavorLines,
    handleOpenModalOrderCancel,
    handleCloseModalOrderCancel,
    openModalOrderCancel,
    cancelOrder
  };
}