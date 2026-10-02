import { useState } from "react";
import type { Order, OrderItem } from "../../../types/Order.type";
// import { STATUS } from "../../../utils/texts/status.enum";
// import UseOrdersController from "../../../pages/Orders/UseOrdersController";
import { useRestaurant } from "../../../context/RestaurantContext";
import type { ProducSize } from "../../../types/Product.type";

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

  // const {  updateStatusOrder } = UseOrdersController()
  const {products} = useRestaurant()
  
  function getProductNameByProductSize(flavor: string | ProducSize): string {
    const targetId = typeof flavor === "string" ? flavor : flavor.id;

    const product = products?.find((p) =>
      p.sizes.some((ps) => ps.id === targetId)
    );

    return product?.productName ?? "Sabor não encontrado";
  }
  const open = Boolean(order);

  function getItemFlavorLines(item: OrderItem): string[] {
    const names = item.flavors.map(getProductNameByProductSize);
    if (names.length === 1 && names[0].trim().toLowerCase() === item.name.trim().toLowerCase()) return [];
    return names.map((n) => names.length === 1 ? n : `1/${names.length} ${n}`);
  }

  async function cancelOrder(){
    if(!order) return;
    // await updateStatusOrder(STATUS.CANCELADO, order?.id);
    handleCloseModalOrderCancel()
    onClose()
  }

  function imprimir() {
    window.print();
  }

  return {
    open,
    order,
    getItemFlavorLines,
    handleOpenModalOrderCancel,
    handleCloseModalOrderCancel,
    openModalOrderCancel,
    cancelOrder,
    imprimir
  };
}