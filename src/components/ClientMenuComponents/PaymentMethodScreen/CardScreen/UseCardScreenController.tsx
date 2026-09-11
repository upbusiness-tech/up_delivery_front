import type { Order } from "../../../../types/Order.type";
import { usePaymentSocket } from "../../../../api/services/socket";
import { useState } from "react";

interface Props {
  order: Order;
}

export function UseCardScreenController({ order }: Props) {
  const { status: socketStatus, isPaid: socketIsPaid } = usePaymentSocket(order.id);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [brickKey, setBrickKey] = useState(0);
  // prioriza o socket (confirmação definitiva via webhook),
  // mas usa o status local como feedback imediato até o socket responder
  const paymentStatus = socketStatus ?? localStatus;
  const isPaid = socketIsPaid || localStatus === 'approved';

  function handlePaymentResult(result: { status: string; status_detail?: string }) {
    setLocalStatus(result.status);
    setStatusDetail(result.status_detail ?? null);
    if (result.status === 'rejected') {
      setAttempts((prev) => prev + 1);
    }
  }
  function retry() {
    setLocalStatus(null);
    setStatusDetail(null);
    setBrickKey((prev) => prev + 1); //remount do Brick
  }

  return {
    paymentStatus,
    isPaid,
    statusDetail,
    attempts,
    brickKey,
    handlePaymentResult,
    retry,
  };
}