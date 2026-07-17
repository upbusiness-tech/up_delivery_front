import { useCallback, useMemo, useState } from "react";
import { STATUS_FLOW, type Order, type OrderStatus } from "../../../types/Order.type";

interface UseOrderDetailControllerParams {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, nextStatus: OrderStatus) => Promise<void> | void;
  onPrint?: (order: Order) => void;
}

export function useOrderDetailController({
  order,
  onClose,
  onUpdateStatus,
  onPrint,
}: UseOrderDetailControllerParams) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = Boolean(order);

  const nextStatus: OrderStatus | null = useMemo(() => {
    if (!order) return null;
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  }, [order]);

  const changeDue = useMemo(() => {
    if (!order?.changeFor) return null;
    return order.changeFor - order.total;
  }, [order]);

  const handleUpdateStatus = useCallback(async () => {
    if (!order || !nextStatus || !onUpdateStatus) return;
    setError(null);
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, nextStatus);
    } catch (err) {
      setError("Não foi possível atualizar o status. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  }, [order, nextStatus, onUpdateStatus]);

  const handlePrint = useCallback(() => {
    if (!order) return;
    if (onPrint) {
      onPrint(order);
    } else {
      window.print();
    }
  }, [order, onPrint]);

  const handleClose = useCallback(() => {
    if (isUpdating) return;
    onClose();
  }, [isUpdating, onClose]);

  return {
    open,
    order,
    nextStatus,
    changeDue,
    isUpdating,
    error,
    handleUpdateStatus,
    handlePrint,
    handleClose,
  };
}