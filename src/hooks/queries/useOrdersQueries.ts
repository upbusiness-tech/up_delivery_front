import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "../../api/services/order.service";
import type { Order } from "../../types/Order.type";
import { queryKeys } from "./queryKeys";

const ORDERS_STALE_TIME = 15_000;

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: () => OrderService.listOrders(),
    staleTime: ORDERS_STALE_TIME,
  });
}

type UpdateStatusOrderVariables = {
  orderId: string;
  status: string;
};

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const ordersKey = queryKeys.orders.list();

  return useMutation({
    mutationFn: ({ orderId, status }: UpdateStatusOrderVariables) =>
      OrderService.updateStatusOrder(status, orderId),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ordersKey });

      const previousOrders = queryClient.getQueryData<Order[]>(ordersKey);

      queryClient.setQueryData<Order[]>(ordersKey, (orders) =>
        orders?.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );

      return { previousOrders };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ordersKey, context.previousOrders);
      }
    },
    // O backend só altera `status` nessa rota. O cache otimista já contém o
    // estado final, então não vale a pena buscar a lista inteira de pedidos.
  });
}

export function useUpdateOrderPrinted() {
  const queryClient = useQueryClient();
  const ordersKey = queryKeys.orders.list();

  return useMutation({
    mutationFn: (orderId: string) => OrderService.updatePrinted(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ordersKey });

      const previousOrders = queryClient.getQueryData<Order[]>(ordersKey);

      queryClient.setQueryData<Order[]>(ordersKey, (orders) =>
        orders?.map((order) =>
          order.id === orderId ? { ...order, printed: true } : order,
        ),
      );

      return { previousOrders };
    },
    onError: (_error, _orderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ordersKey, context.previousOrders);
      }
    },
    // Assim como no status, `printed` é um campo isolado. Atualizar o cache
    // evita um GET da lista completa a cada impressão.
  });
}

export function useUpdateOrderReceived() {
  const queryClient = useQueryClient();
  const ordersKey = queryKeys.orders.list();

  return useMutation({
    mutationFn: (orderId: string) => OrderService.updateReceived(orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ordersKey });

      const previousOrders = queryClient.getQueryData<Order[]>(ordersKey);

      // O backend só altera o campo `received`, então o cache otimista já é o
      // estado final. Invalidar aqui faria um GET da lista inteira por clique.
      queryClient.setQueryData<Order[]>(ordersKey, (orders) =>
        orders?.map((order) =>
          order.id === orderId ? { ...order, received: true } : order,
        ),
      );

      return { previousOrders };
    },
    onError: (_error, _orderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ordersKey, context.previousOrders);
      }
    },
  });
}
