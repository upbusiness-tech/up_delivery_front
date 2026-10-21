import type { SelectChangeEvent } from "@mui/material";
import type { Order } from "../../../types/Order.type";
import { STATUS } from "../../../utils/texts/status.enum";
import { OrderService } from "../../../api/services/order.service";
import { useRestaurant } from "../../../context/RestaurantContext";
import { buildOrderMessage, sendWhatsAppMessage } from "../../../utils/whatsapp/orderMessage";

interface UseOrderTableControllerProps {
  updateStatusOrder: (status: string, orderId: string) => Promise<void>;
}

export function useOrderTableController({ updateStatusOrder }: UseOrderTableControllerProps) {
  const { setOrders, restaurant, products } = useRestaurant();

  const isReceived = (order: Order) => order.received;

  const handleReceived = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (isReceived(order)) return;
    try {
      await OrderService.updateReceived(order.id);
      setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, received: true } : o)));
      await sendWhatsAppMessage(order, buildOrderMessage(order, 40, products));
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

    await updateStatusOrder(newStatus, order.id);

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

  return { isReceived, handleReceived, handleStatusChange, imprimir };
}