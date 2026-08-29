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
    console.log(item)
    const limitFlavors = item.flavors.length;

    // Se for só 1 sabor permitido, mostra só o nome do produto
    // if (limitFlavors <= 1) {
    //   return [];
    // }
  
    // Mais de 1 sabor, mostra os nomes dos sabores
    return item.flavors.map((flavor, index) => {
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