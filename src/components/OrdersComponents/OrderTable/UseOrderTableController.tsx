import type { SelectChangeEvent } from "@mui/material";
import type { Order } from "../../../types/Order.type";
import { STATUS } from "../../../utils/texts/status.enum";
import { buildOrderMessage, sendWhatsAppMessage } from "../../../utils/whatsapp/orderMessage";
import {
  useUpdateOrderReceived,
  useUpdateOrderStatus,
} from "../../../hooks/queries/useOrdersQueries";
import { useRestaurantMe } from "../../../hooks/queries/useRestaurantQueries";

export function useOrderTableController() {
  const { data: restaurant } = useRestaurantMe();
  const updateStatusMutation = useUpdateOrderStatus();
  const updateReceivedMutation = useUpdateOrderReceived();

  const isReceived = (order: Order) => order.received;

  const handleReceived = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (isReceived(order)) return;

    try {
      await updateReceivedMutation.mutateAsync(order.id);
      sendWhatsAppMessage(order, buildOrderMessage(order));
    } catch {
      return;
    }
  };

  function imprimir() {
    window.print();
  }


  const handleStatusChange = async (e: SelectChangeEvent<string>, order: Order) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === order.status) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: order.id,
        status: newStatus,
      });
    } catch {
      return;
    }

    if (newStatus === STATUS.EM_PREPARO) {
      sendWhatsAppMessage(order, `Oba😋 Seu pedido já está sendo preparado!\n Assim que estiver prontinho, avisaremos você por aqui.❤️`);
    }

    if (newStatus === STATUS.EM_ROTA) {
      sendWhatsAppMessage(order, `Seu pedido saiu para entrega e está a caminho.\nEm breve ele chegará até você. Obrigado pela preferência!`);
    }

    if (newStatus === STATUS.EM_PREPARO) {
      sendWhatsAppMessage(order, `Oba😋 Seu pedido já está sendo preparado!\n Assim que estiver prontinho, avisaremos você por aqui.❤️`);
    }

    if (newStatus === STATUS.PRONTO_RETIRADA) {
      sendWhatsAppMessage(order, `📦Seu pedido está pronto para retirada.\nJá pode passar para buscar. Estamos te esperando!😁\n📍${restaurant?.restaurantAddress}`);
    }

    if (newStatus === STATUS.FINALIZADO) {
      sendWhatsAppMessage(order, `Seu pedido foi finalizado com sucesso! 🎉 Agradecemos pela preferência e esperamos que você tenha uma ótima experiência. Será um prazer receber seu próximo pedido! ❤️`); 
    }
  };

  return {
    isReceived,
    handleReceived,
    handleStatusChange,
    isUpdating:
      updateStatusMutation.isPending || updateReceivedMutation.isPending,
  };
}
