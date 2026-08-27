import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_DELIVERY_API_URL;

export const createSocket = (restaurantId: string) => {
  return io(SOCKET_URL, { query: { restaurantId } });
};

export function usePaymentSocket(orderId: string | null) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const socket: Socket = io(`${SOCKET_URL}/payment`);

    socket.on('connect', () => {
      socket.emit('joinOrderRoom', orderId);
    });

    socket.on('paymentStatusUpdate', (data: { orderId: string; status: string }) => {
      console.log('Status atualizado:', data);
      setStatus(data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return status;
}