import type { Order } from "../../../../types/Order.type";
import { usePaymentSocket } from "../../../../api/services/socket";
import { useState } from "react";

interface Props {
  order: Order;
}

export function UseCardScreenController({ order }: Props) {
  const socketStatus = usePaymentSocket(order.id);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  // prioriza o socket (confirmação definitiva via webhook),
  // mas usa o status local como feedback imediato até o socket responder
  const paymentStatus = socketStatus ?? localStatus;

  return {
    paymentStatus,
    setLocalStatus,
  };
}