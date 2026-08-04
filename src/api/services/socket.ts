import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const createSocket = (restaurantId: string) => {
  return io('http://localhost:3000', {
    query: { restaurantId },
  });
};

export function usePaymentSocket(orderId: string | null) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const socket: Socket = io("http://localhost:3000/payment");

    socket.on("connect", () => {
      socket.emit("joinOrderRoom", orderId);
    });

    socket.on("paymentStatusUpdate", (data: { orderId: string; status: string }) => {
      console.log("Status atualizado:", data);
      setStatus(data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return status;
}