import { useState } from "react";
import type { Order, OrderItem } from "../../../types/Order.type";
// import { STATUS } from "../../../utils/texts/status.enum";
// import UseOrdersController from "../../../pages/Orders/UseOrdersController";
import { useRestaurant } from "../../../context/RestaurantContext";
import type { ProducSize, Size } from "../../../types/Product.type";

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

  function getSizeByFlavorId(flavorId: string): Size | undefined {
  const product = products?.find((p) => p.sizes.some((ps) => ps.id === flavorId));
  return product?.sizes.find((ps) => ps.id === flavorId)?.size;
}

function getItemFlavorLines(item: OrderItem): string[] {
  if (item.flavors.length === 0) return [];

  const firstSize = getSizeByFlavorId(item.flavors[0]);
  const limitFlavors = firstSize?.limitFlavors ?? item.flavors.length;

  const flavors = item.flavors.length === 1 && limitFlavors > 1
    ? Array(limitFlavors).fill(item.flavors[0])
    : item.flavors;

  return flavors.map((flavor, index) => {
    const name = getProductNameByProductSize(flavor);
    return `${index + 1}/${limitFlavors} ${name}`;
  });
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