import { useEffect, useState } from "react";
import { MethodPayment, type CreatePayment } from "../../../types/Payment.type";
import { PaymentSevice } from "../../../api/services/payment.service";
import { usePaymentSocket } from "../../../api/services/socket";
import type { Order } from "../../../types/Order.type";

interface Props {
  order: Order;
  total: number;
}

const PIX_EXPIRATION_SECONDS = 15 * 60;

export function UsePaymentMethodScreenController({ order, total }: Props) {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // WebSocket entra na sala assim que o orderId existir
  const paymentStatus = usePaymentSocket(orderId);

  // Busca o pagamento
  useEffect(() => {
    if (order.paymentMethod !== MethodPayment.PIX) return;

  const fetchPayment = async () => {
    setLoading(true);
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
        setOrderId(data.orderId); //salva o orderId retornado
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchPayment();
  }, [order.paymentMethod, total]);

  //Expiração
  useEffect(() => {
    if (!expiresAt) return;
    const expirationTime = new Date(expiresAt).getTime();
    const updateCountdown = () => {
      const diff = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formattedTime =
    secondsLeft !== null
      ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, "0")}`
      : null;

  const progress =
    secondsLeft !== null ? Math.min(100, (secondsLeft / PIX_EXPIRATION_SECONDS) * 100) : 100;

  const handleCopy = async () => {
    if (!qrCode) return;
    await navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    paymentStatus
  };
}