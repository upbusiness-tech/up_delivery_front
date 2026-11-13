import { useEffect, useState } from "react";
import { useUpdateOrderStatus } from "../../../hooks/queries/useOrdersQueries";
import { STATUS } from "../../../utils/texts/status.enum";

export function useOrderDetailController(orderId?: string) {
  const [openModalOrderCancel, setOpenModalOrderCancel] = useState<boolean>(false);
  const updateStatusMutation = useUpdateOrderStatus();

  useEffect(() => {
    setOpenModalOrderCancel(false);
    updateStatusMutation.reset();
    // Fecha a confirmação e limpa erros ao trocar de pedido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleOpenModalOrderCancel = () => {
    updateStatusMutation.reset();
    setOpenModalOrderCancel(true);
  };

  const handleCloseModalOrderCancel = () => {
    if (updateStatusMutation.isPending) return;
    setOpenModalOrderCancel(false);
  };

  const cancelOrder = async () => {
    if (!orderId || updateStatusMutation.isPending) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: STATUS.CANCELADO,
      });
      setOpenModalOrderCancel(false);
    } catch {
      // O erro fica disponível em cancelError para ser exibido no modal.
    }
  };

  return {
    handleOpenModalOrderCancel,
    handleCloseModalOrderCancel,
    openModalOrderCancel,
    cancelOrder,
    isCancelling: updateStatusMutation.isPending,
    cancelError: updateStatusMutation.error,
  };
}
