import { io } from 'socket.io-client';

export const createSocket = (restaurantId: string) =>
  io('http://localhost:3000', {
    query: { restaurantId },
  });