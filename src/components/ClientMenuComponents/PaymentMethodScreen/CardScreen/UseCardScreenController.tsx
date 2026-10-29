import { useCallback, useEffect, useState } from "react";
import type { Order } from "../../../../types/Order.type";
import { usePaymentSocket } from "../../../../api/services/socket";
import { PaymentSevice } from "../../../../api/services/payment.service";
import type {
  CardPaymentResult,
  OrderPaymentStatusData,
} from "../../../../types/Payment.type";

interface Props {
  order: Order;
}

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_DELAY_MS = 12000;
const POLL_MAX_ATTEMPTS = 18;

function resolveStatus(statuses: Array<string | null | undefined>) {
  if (statuses.includes("approved")) return "approved";
  if (statuses.includes("cancelled")) return "cancelled";
  if (statuses.includes("rejected")) return "rejected";
  return statuses.find((status): status is string => Boolean(status)) ?? null;
}

export function UseCardScreenController({ order }: Props) {
  const { status: socketStatus, isPaid: socketIsPaid } = usePaymentSocket(order.id);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [brickKey, setBrickKey] = useState(0);
  const [checking, setChecking] = useState(false);
  const [paymentId, setPaymentId] = useState<string | number | null>(null);

  // O socket é a confirmação principal. O status local dá feedback imediato e o
  // status do banco serve de fallback caso o webhook demore ou não chegue.
  const paymentStatus = resolveStatus([dbStatus, socketStatus, localStatus]);
  const isPaid = socketIsPaid || paymentStatus === "approved";

  const applyDbStatus = useCallback((data: OrderPaymentStatusData) => {
    if (data.isPaid) {
      setDbStatus("approved");
      return true;
    }

    if (data.paymentStatus === "failed") {
      setDbStatus("rejected");
      return true;
    }

    if (data.paymentStatus === "cancelled") {
      setDbStatus("cancelled");
      return true;
    }

    return false;
  }, []);

  const handlePaymentResult = useCallback((result: CardPaymentResult) => {
    setPaymentId(result.id);
    setLocalStatus(result.status);
    setStatusDetail(result.status_detail ?? null);

    if (result.status === "rejected") {
      setAttempts((prev) => prev + 1);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    setChecking(true);

    try {
      // A consulta manual pode ir direto ao Mercado Pago; o polling
      // automático continua limitado ao banco para não sobrecarregar a API.
      if (paymentId) {
        try {
          await PaymentSevice.getStatusPaymentPolling(
            order.restaurant.id,
            String(paymentId),
          );
        } catch (error) {
          console.error("Erro ao consultar pagamento no Mercado Pago:", error);
        }
      }

      const data = await PaymentSevice.getPaymentStatus(order.id);
      applyDbStatus(data);
    } catch (error) {
      console.error("Erro ao consultar status do pagamento:", error);
    } finally {
      setChecking(false);
    }
  }, [applyDbStatus, order.id, order.restaurant.id, paymentId]);

  useEffect(() => {
    if (isPaid) return;
    if (localStatus !== "pending" && localStatus !== "in_process") return;

    let cancelled = false;
    let pollAttempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      if (cancelled) return;

      if (document.visibilityState === "hidden") {
        schedule();
        return;
      }

      pollAttempts += 1;

      try {
        const data = await PaymentSevice.getPaymentStatus(order.id);
        if (cancelled) return;
        if (applyDbStatus(data)) return;
      } catch (error) {
        console.error("Erro ao consultar status do pagamento:", error);
      }

      schedule();
    }

    function schedule() {
      if (cancelled || pollAttempts >= POLL_MAX_ATTEMPTS) return;

      const delay =
        pollAttempts === 0
          ? POLL_INTERVAL_MS
          : Math.min(
              POLL_INTERVAL_MS * 2 ** Math.min(pollAttempts, 2),
              POLL_MAX_DELAY_MS,
            );

      timer = setTimeout(poll, delay);
    }

    schedule();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [applyDbStatus, isPaid, localStatus, order.id]);

  const retry = useCallback(() => {
    setLocalStatus(null);
    setDbStatus(null);
    setStatusDetail(null);
    setPaymentId(null);
    setBrickKey((prev) => prev + 1);
  }, []);

  return {
    paymentStatus,
    isPaid,
    statusDetail,
    attempts,
    brickKey,
    checking,
    handlePaymentResult,
    checkStatus,
    retry,
  };
}
