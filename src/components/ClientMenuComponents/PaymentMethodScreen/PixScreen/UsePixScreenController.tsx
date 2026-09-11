import { useCallback, useEffect, useRef, useState } from "react";
import type { Order } from "../../../../types/Order.type";
import { usePaymentSocket } from "../../../../api/services/socket";
import {
  MethodPayment,
  type CreatePixPayment,
} from "../../../../types/Payment.type";

import { PaymentSevice } from "../../../../api/services/payment.service";
interface Props {
  order: Order;
  total: number;
  userEmail: string;
}

const PIX_EXPIRATION_SECONDS = 60;

export function UsePixScreenController({
  order,
  total,
  userEmail,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const paymentCreatedRef = useRef(false);

  // WebSocket
  const { status: paymentStatus, isPaid: paymentConfirmed } = usePaymentSocket(orderId);

  const isApproved = paymentConfirmed;
  const isRejected = paymentStatus === "rejected";
  const isCancelled = paymentStatus === "cancelled";

  const fetchPayment = useCallback(async () => {
    console.log("fetchPayment chamado", Date.now());

    setLoading(true);
    setExpired(false);

    try {
      const payment: CreatePixPayment = {
        amount: total,
        paymentMethod: MethodPayment.PIX,
        description: "UPDELIVERY_ORDER",
        payerEmail: userEmail,
        orderInternalId: order.id,
      };

      const data = await PaymentSevice.createPixPayment(
        order.restaurant.id,
        payment,
      );

      if (data) {
        setQrCodeBase64(data.qrCodeBase64);
        setQrCode(data.qrCode);
        setExpiresAt(data.expiresAt);
        setOrderId(order.id);
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
    } finally {
      setLoading(false);
    }
  }, [order.id, order.restaurant.id, total, userEmail]);

  // Cria o pagamento PIX
  useEffect(() => {
    if (order.paymentMethod !== MethodPayment.PIX) return;

    if (paymentCreatedRef.current) return;

    paymentCreatedRef.current = true;

    fetchPayment();
  }, [order.paymentMethod, fetchPayment]);

  // Expiração
  useEffect(() => {
    if (!expiresAt) return;

    const expirationTime = new Date(expiresAt).getTime();

    const updateCountdown = () => {
      const diff = Math.max(
        0,
        Math.floor((expirationTime - Date.now()) / 1000),
      );

      setSecondsLeft(diff);

      if (diff === 0) {
        setExpired(true);
      }
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formattedTime =
    secondsLeft !== null
      ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60)
          .toString()
          .padStart(2, "0")}`
      : null;

  const progress =
    secondsLeft !== null
      ? Math.min(
          100,
          (secondsLeft / PIX_EXPIRATION_SECONDS) * 100,
        )
      : 100;

  const handleCopy = async () => {
    if (!qrCode) return;

    await navigator.clipboard.writeText(qrCode);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  // Gera um novo código PIX
  const handleRetry = () => {
    fetchPayment();
  };

  const handleCardPaymentCreated = useCallback(
    (paymentId: string) => {
      setSubmitError(null);
      setOrderId(paymentId);
    },
    [],
  );

  const handleCardSubmitError = useCallback((message: string) => {
    setSubmitError(message);
  }, []);

  const truncatedCode =
    qrCode.length > 40
      ? `${qrCode.slice(0, 20)}...${qrCode.slice(-15)}`
      : qrCode;

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
    truncatedCode,
  };
}