import type { Order, OrderItem } from "../../../types/Order.type";

interface UseOrderDetailControllerParams {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string) => Promise<void> | void;
  onPrint?: (order: Order) => void;
}

export function useOrderDetailController({ order }: UseOrderDetailControllerParams) {
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

  return {
    open,
    order,
    getItemFlavorLines,
  };
}