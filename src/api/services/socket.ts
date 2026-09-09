import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_DELIVERY_API_URL;

export const createSocket = (restaurantId: string) => {
  return io(SOCKET_URL, {
    query: { restaurantId },
  });
};

export function usePaymentSocket(orderId: string | null) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const socket: Socket = io(`${SOCKET_URL}/payment`);

    socket.on('connect', () => {
      console.log('WebSocket conectado:', socket.id);
      console.log('Acompanhando pedido:', orderId);

      socket.emit('watchPayment', {
        orderId,
      });
    });

    socket.on(
      'paymentStatusUpdate',
      (data: {
        orderId: string;
        status: string;
        isPaid: boolean;
      }) => {
        console.log('Status atualizado:', data);

        if (data.orderId !== orderId) {
          console.log('Evento de outro pedido, ignorando');
          return;
        }

        setStatus(data.status);
      },
    );

    socket.on('paymentError', (data: { message: string }) => {
      console.error('Erro no pagamento:', data.message);
    });

    socket.on('connect_error', (error) => {
      console.error('Erro ao conectar WebSocket:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket desconectado:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return status;
}