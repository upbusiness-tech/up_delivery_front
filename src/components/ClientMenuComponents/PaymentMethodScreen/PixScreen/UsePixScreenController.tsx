import { useCallback, useEffect, useRef, useState } from "react";
import type { Order } from "../../../../types/Order.type";
import { usePaymentSocket } from "../../../../api/services/socket";
import { MethodPayment, type CreatePixPayment } from "../../../../types/Payment.type";
import { PaymentSevice } from "../../../../api/services/payment.service";

interface Props {
  order: Order;
  total: number;
  userEmail: string
}

const PIX_EXPIRATION_SECONDS = 60;

export function UsePixScreenController({ order, total, userEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [restStatus, setRestStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const paymentCreatedRef = useRef(false);

  const socketStatus = usePaymentSocket(orderId);


  //prioriza o que chegar, seja via socket ou via polling
  const paymentStatus = socketStatus ?? restStatus;
  useEffect(() => {
    console.log("[PixPolling] status atual:", { socketStatus, restStatus, paymentStatus });
  }, [socketStatus, restStatus, paymentStatus]);


  const isApproved = paymentStatus === "approved";
  const isRejected = paymentStatus === "rejected";
  const isCancelled = paymentStatus === "cancelled";

  const fetchPayment = useCallback(async () => {
    console.log("fetchPayment chamado", Date.now());
    setLoading(true);
    setExpired(false);
    setRestStatus(null);
    try {
      const payment: CreatePixPayment = {
        amount: total,
        paymentMethod: MethodPayment.PIX,
        description: "UPDELIVERY_ORDER",
        payerEmail: userEmail,
        orderInternalId: order.id
      };
      const data = await PaymentSevice.createPixPayment(order.restaurant.id, payment);
      if (data) {
        setQrCodeBase64(data.qrCodeBase64);
        setQrCode(data.qrCode);
        setExpiresAt(data.expiresAt);
        setOrderId(data.orderId);
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
    } finally {
      setLoading(false);
    }
  }, [order.id, total]);

  // cria o pagamento PIX
  useEffect(() => {
    if (order.paymentMethod !== MethodPayment.PIX) return;
    if (paymentCreatedRef.current) return;
    paymentCreatedRef.current = true;
    fetchPayment();
  }, [order.paymentMethod, fetchPayment]);

  // Sincroniza o status via REST quando a aba volta a ficar visível (ex: usuário saiu para pagar pelo app do banco e o socket foi derrubado em segundo plano)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      console.log("[PixPolling] visibilitychange disparado, state atual:", document.visibilityState);
      if (document.visibilityState !== "visible") return;
      console.log("[PixPolling] aba visível, checando condições:", { orderId, isApproved, expired });
      if (!orderId || isApproved || expired) return;
      console.log("[PixPolling] abortado — orderId ausente, já aprovado ou expirado");
      try {
        console.log("[PixPolling] chamando getStatusPaymentPolling", { restaurantId: order.restaurant.id, orderId });
        const status = await PaymentSevice.getStatusPaymentPolling(order.restaurant.id, orderId);
        console.log("[PixPolling] resposta recebida:", status);
        if (status) setRestStatus(status);
      } catch (error) {
        console.error("Erro ao sincronizar status do pagamento:", error);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [orderId, order.restaurant.id, isApproved, expired]);

  // Chamado pelo CardScreen depois que o pagamento com cartão foi criado
  const handleCardPaymentCreated = useCallback((paymentId: string) => {
    setSubmitError(null);
    setOrderId(paymentId);
  }, []);

  const handleCardSubmitError = useCallback((message: string) => {
    setSubmitError(message);
  }, []);

  //Expiração
  useEffect(() => {
    if (!expiresAt) return;
    const expirationTime = new Date(expiresAt).getTime();

    const updateCountdown = () => {
      const diff = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      setSecondsLeft(diff);

      if (diff === 0) setExpired(true);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formattedTime =
    secondsLeft !== null
      ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, "0")}`
      : null;

  const progress = secondsLeft !== null ? Math.min(100, (secondsLeft / PIX_EXPIRATION_SECONDS) * 100) : 100;

  const handleCopy = async () => {
    if (!qrCode) return;
    await navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  //Gera um novo codigo PIX
  const handleRetry = () => {
    fetchPayment();
  };

  const truncatedCode = qrCode.length > 40 ? `${qrCode.slice(0, 20)}...${qrCode.slice(-15)}`  : qrCode;

  return {
    loading,
    qrCodeBase64,
    qrCode,
    expiresAt,
    secondsLeft,
    formattedTime,
    progress,
    copied,
    handleCopy,
    paymentStatus,
    isApproved,
    isRejected,
    isCancelled,
    expired,
    handleRetry,
    handleCardPaymentCreated,
    handleCardSubmitError,
    submitError,
    truncatedCode
  };
}