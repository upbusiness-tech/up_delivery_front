import { useCallback, useEffect, useRef, useState } from "react";
import { MethodPayment, type CreatePayment } from "../../../types/Payment.type";
import { PaymentSevice } from "../../../api/services/payment.service";
import { usePaymentSocket } from "../../../api/services/socket";
import type { Order } from "../../../types/Order.type";

interface Props {
  order: Order;
  total: number;
}

const PIX_EXPIRATION_SECONDS = 60;

const FINAL_STATUSES = ["approved", "rejected", "cancelled"];

export function UsePaymentMethodScreenController({ order, total }: Props) {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [restStatus, setRestStatus] = useState<string | null>(null);

  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const paymentCreatedRef = useRef(false);
  const socketStatus = usePaymentSocket(orderId);
  
  //prioriza o que chegar, seja via socket ou via polling
  const paymentStatus = socketStatus ?? restStatus;

  const fetchPayment = useCallback(async () => {
    console.log("fetchPayment chamado", Date.now());
    setLoading(true);
    setExpired(false);
    setRestStatus(null);
    try {
      const payment: CreatePayment = {
        amount: total,
        paymentMethod: MethodPayment.PIX,
        description: "UPDELIVERY_ORDER",
        payerEmail: "cliente.teste@gmail.com",
        orderInternalId: order.id
      };
      const data = await PaymentSevice.createPayment(payment);
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

  // cria o pagamento
  useEffect(() => {
    if (order.paymentMethod !== MethodPayment.PIX) return;
    if (paymentCreatedRef.current) return;
    paymentCreatedRef.current = true;
    fetchPayment();
  }, [order.paymentMethod, fetchPayment]);

  // polling do status do pagamento
  useEffect(() => {
    if (!orderId || expired) return;

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

    const checkPaymentStatus = async () => {
      try {
        const status = await PaymentSevice.getStatusPaymentPolling(order.restaurant.id, orderId);
        console.log("Status do pagamento:", status);
        setRestStatus(status);
        if (FINAL_STATUSES.includes(status)) {
          stopPolling();
        }
      } catch (err) {
        console.error("Erro ao consultar pagamento:", err);
      }
    };

    checkPaymentStatus();
    pollingIntervalRef.current = setInterval(checkPaymentStatus, 10000);

    return stopPolling;
  }, [orderId, expired, order.restaurant.id]);

  useEffect(() => {
    if (socketStatus === "approved" && pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, [socketStatus]);

  //Expiração
  useEffect(() => {
    if (!expiresAt) return;
    const expirationTime = new Date(expiresAt).getTime();

    const updateCountdown = () => {
      const diff = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      setSecondsLeft(diff);

      if (diff === 0) {
        setExpired(true);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
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
    expired,
    handleRetry
  };
}