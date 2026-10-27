import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { OrderService } from "../api/services/order.service";
import { createSocket } from "../api/services/socket";
import { useNotificationSound } from "../hooks/useNotificationSound";
import { queryKeys } from "../hooks/queries/queryKeys";
import { useRestaurantMe } from "../hooks/queries/useRestaurantQueries";
import type { Order } from "../types/Order.type";
import PrintOrder from "../utils/print/PrintOrder";

interface PrintQueueContextValue {
  /** Pedido que está sendo impresso agora. Também serve para evitar duas prévias no DOM. */
  activeOrder: Order | null;
  /** Coloca um pedido na frente da fila para impressão manual. */
  printOrder: (order: Order) => void;
}

const PrintQueueContext = createContext<PrintQueueContextValue | undefined>(undefined);

const PRINT_DIALOG_BLOCKING_THRESHOLD_MS = 500;
const PRINT_DIALOG_FALLBACK_MS = 60_000;

function getOrderTimestamp(order: Order) {
  if (!order.created_at) return 0;

  const timestamp = new Date(order.created_at).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortByOldestFirst(orders: Order[]) {
  return [...orders].sort(
    (first, second) => getOrderTimestamp(first) - getOrderTimestamp(second),
  );
}

function sortByNewestFirst(orders: Order[]) {
  return [...orders].sort(
    (first, second) => getOrderTimestamp(second) - getOrderTimestamp(first),
  );
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

/**
 * Abre a janela de impressão e só resolve quando ela é fechada.
 *
 * No Chrome/Edge `window.print()` bloqueia o JavaScript até o usuário fechar a
 * prévia. Nesses casos o tempo decorrido já indica que a janela foi fechada.
 * Para navegadores que não bloqueiam, usamos o evento `afterprint` e um
 * fallback longo para nunca imprimir o próximo pedido com a prévia anterior aberta.
 */
function openPrintDialog() {
  return new Promise<void>((resolve) => {
    let settled = false;
    let fallbackId: number | undefined;

    const finish = () => {
      if (settled) return;

      settled = true;
      window.removeEventListener("afterprint", finish);

      if (fallbackId !== undefined) {
        window.clearTimeout(fallbackId);
      }

      resolve();
    };

    window.addEventListener("afterprint", finish);

    const startedAt = performance.now();

    try {
      window.print();
    } catch (error) {
      console.error("Não foi possível abrir a janela de impressão:", error);
      finish();
      return;
    }

    if (settled) return;

    const elapsed = performance.now() - startedAt;

    if (elapsed >= PRINT_DIALOG_BLOCKING_THRESHOLD_MS) {
      finish();
      return;
    }

    fallbackId = window.setTimeout(finish, PRINT_DIALOG_FALLBACK_MS);
  });
}

export function PrintQueueProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: restaurant } = useRestaurantMe();
  const restaurantId = restaurant?.id;
  const { play: playNotificationSound } = useNotificationSound();

  const [queue, setQueue] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // O ref é a fonte da verdade para o fluxo assíncrono. O state só dispara a UI.
  const queueRef = useRef<Order[]>([]);
  const handledIdsRef = useRef(new Set<string>());
  const forcedPrintIdsRef = useRef(new Set<string>());
  const printInProgressRef = useRef(false);
  const printStartedRef = useRef(false);

  const mergeOrdersIntoCache = useCallback(
    (orders: Order[]) => {
      if (orders.length === 0) return;

      // Não crie a lista de pedidos a partir de um único evento de socket.
      // Isso faria a página /orders abrir com uma lista parcial e considerá-la
      // "fresca" pelo staleTime. Se a lista ainda não foi carregada, a própria
      // página busca todos os pedidos.
      const currentOrders = queryClient.getQueryData<Order[]>(queryKeys.orders.list());
      if (!currentOrders) return;

      const ordersById = new Map(currentOrders.map((order) => [order.id, order]));

      orders.forEach((order) => {
        const existing = ordersById.get(order.id);
        const merged = existing ? { ...existing, ...order } : order;

        // Um pedido já marcado como impresso/recebido localmente não volta para
        // "não impresso"/"não recebido" por causa de uma consulta que saiu
        // antes do POST correspondente.
        ordersById.set(order.id, {
          ...merged,
          printed: Boolean(existing?.printed || order.printed),
          received: Boolean(existing?.received || order.received),
        });
      });

      queryClient.setQueryData<Order[]>(
        queryKeys.orders.list(),
        sortByNewestFirst(Array.from(ordersById.values())),
      );
    },
    [queryClient],
  );

  const enqueueOrders = useCallback(
    (orders: Order[]) => {
      if (orders.length === 0) return;

      const cachedOrders = queryClient.getQueryData<Order[]>(queryKeys.orders.list()) ?? [];
      const cachedPrintedIds = new Set(
        cachedOrders.filter((order) => order.printed).map((order) => order.id),
      );
      const queuedIds = new Set(queueRef.current.map((order) => order.id));
      const additions: Order[] = [];

      orders.forEach((order) => {
        if (order.printed) return;
        if (cachedPrintedIds.has(order.id)) return;
        if (handledIdsRef.current.has(order.id)) return;
        if (queuedIds.has(order.id)) return;

        queuedIds.add(order.id);
        additions.push(order);
      });

      if (additions.length === 0) return;

      const nextQueue = sortByOldestFirst([...queueRef.current, ...additions]);

      queueRef.current = nextQueue;
      setQueue(nextQueue);
    },
    [queryClient],
  );

  const syncPendingOrders = useCallback(async () => {
    // Sempre faz uma consulta nova. O enqueue deduplica por ID, então uma
    // resposta atrasada (ou uma reconexão do socket) não imprime em dobro.
    try {
      const pendingOrders = await OrderService.getFullPendingOrders();

      mergeOrdersIntoCache(pendingOrders);
      enqueueOrders(pendingOrders);
    } catch (error) {
      console.error("Erro ao buscar pedidos pendentes para impressão:", error);
    }
  }, [enqueueOrders, mergeOrdersIntoCache]);

  const markOrderAsPrinted = useCallback(
    async (orderId: string) => {
      let lastError: unknown;

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          await OrderService.updatePrinted(orderId);

          const currentOrders = queryClient.getQueryData<Order[]>(queryKeys.orders.list());

          if (currentOrders) {
            queryClient.setQueryData<Order[]>(
              queryKeys.orders.list(),
              currentOrders.map((order) =>
                order.id === orderId ? { ...order, printed: true } : order,
              ),
            );
          }

          return;
        } catch (error) {
          lastError = error;

          if (attempt < 3) {
            await wait(400 * attempt);
          }
        }
      }

      // Mesmo se o backend falhar, o pedido já saiu fisicamente. Ele fica
      // marcado localmente para não entrar de novo na fila nesta sessão.
      console.error(
        `Não foi possível marcar o pedido ${orderId} como impresso:`,
        lastError,
      );
    },
    [queryClient],
  );

  const removeFromQueue = useCallback(
    (orderId: string) => {
      const nextQueue = queueRef.current.filter(
        (queuedOrder) => queuedOrder.id !== orderId,
      );

      queueRef.current = nextQueue;
      setQueue(nextQueue);
      setActiveOrder(null);

      // O socket pode ter perdido eventos enquanto a janela de impressão
      // bloqueava o navegador. Ao esvaziar a fila, buscamos o que ficou para trás.
      if (nextQueue.length === 0) {
        void syncPendingOrders();
      }
    },
    [syncPendingOrders],
  );

  const finishPrint = useCallback(
    async (order: Order) => {
      printStartedRef.current = true;

      try {
        await openPrintDialog();
        await markOrderAsPrinted(order.id);
      } catch (error) {
        console.error(`Erro ao imprimir o pedido ${order.code}:`, error);
      } finally {
        handledIdsRef.current.add(order.id);
        forcedPrintIdsRef.current.delete(order.id);

        // Remove pelo ID capturado no início desta impressão. Nunca use o
        // primeiro item atual da fila: ele já pode ter mudado.
        removeFromQueue(order.id);
        printInProgressRef.current = false;
        printStartedRef.current = false;
      }
    },
    [markOrderAsPrinted, removeFromQueue],
  );

  const printOrder = useCallback(
    (order: Order) => {
      // A impressão manual ignora o filtro de "já impresso": o usuário pode
      // querer reimprimir um pedido. Se já houver uma impressão em andamento,
      // o pedido sobe para o início da fila.
      forcedPrintIdsRef.current.add(order.id);

      const queuedWithoutOrder = queueRef.current.filter(
        (queuedOrder) => queuedOrder.id !== order.id,
      );
      const nextQueue = [order, ...queuedWithoutOrder];

      if (activeOrder || printInProgressRef.current) {
        queueRef.current = nextQueue;
        setQueue(nextQueue);
        return;
      }

      // Em impressão manual, o clique do usuário ainda está ativo. Renderiza o
      // PrintOrder de forma síncrona e chama window.print() dentro do próprio
      // evento, evitando que o navegador bloqueie a janela de impressão.
      printInProgressRef.current = true;

      flushSync(() => {
        queueRef.current = nextQueue;
        setQueue(nextQueue);
        setActiveOrder(order);
      });

      void finishPrint(order);
    },
    [activeOrder, finishPrint],
  );

  // Escolhe o próximo pedido somente quando não há impressão em andamento.
  useEffect(() => {
    if (activeOrder || printInProgressRef.current) return;

    const nextOrder = queueRef.current[0];
    if (!nextOrder) return;

    setActiveOrder(nextOrder);
  }, [activeOrder, queue]);

  // Espera o PrintOrder do pedido ativo ser renderizado/pintado antes de abrir
  // a janela de impressão. Isso evita imprimir a prévia do pedido anterior.
  useEffect(() => {
    if (!activeOrder || printInProgressRef.current) return;

    // Se o usuário clicou em "Receber" enquanto este pedido esperava na fila,
    // não imprima de novo.
    const cachedOrder = queryClient
      .getQueryData<Order[]>(queryKeys.orders.list())
      ?.find((order) => order.id === activeOrder.id);

    // A fila automática não reimprime pedidos já marcados. A impressão manual,
    // porém, deve funcionar como reimpressão.
    const isForcedManualPrint = forcedPrintIdsRef.current.has(activeOrder.id);

    if (cachedOrder?.printed && !isForcedManualPrint) {
      handledIdsRef.current.add(activeOrder.id);
      removeFromQueue(activeOrder.id);
      return;
    }

    printInProgressRef.current = true;
    printStartedRef.current = false;

    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (cancelled) {
          printInProgressRef.current = false;
          return;
        }

        void finishPrint(activeOrder);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);

      // O StrictMode executa o efeito duas vezes no mount. Se a impressão
      // ainda não começou, libera o fluxo para a segunda execução.
      if (!printStartedRef.current) {
        printInProgressRef.current = false;
      }
    };
  }, [activeOrder, finishPrint, queryClient, removeFromQueue]);

  // Socket global do painel. Fica no Layout protegido, então não afeta o
  // cardápio público e é encerrado junto com a sessão.
  useEffect(() => {
    if (!restaurantId) return;

    const socket = createSocket(restaurantId);
    let hasConnected = false;

    const handleConnect = () => {
      // Ao reconectar depois de uma impressão longa, recupera os eventos perdidos.
      if (hasConnected) {
        void syncPendingOrders();
      }

      hasConnected = true;
    };

    const handleNewOrder = (newOrder: Order) => {
      mergeOrdersIntoCache([newOrder]);
      enqueueOrders([newOrder]);
      playNotificationSound();
    };

    socket.on("connect", handleConnect);
    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newOrder", handleNewOrder);
      socket.disconnect();
    };
  }, [
    enqueueOrders,
    mergeOrdersIntoCache,
    playNotificationSound,
    restaurantId,
    syncPendingOrders,
  ]);

  return (
    <PrintQueueContext.Provider value={{ activeOrder, printOrder }}>
      {children}
      <PrintOrder order={activeOrder} />
    </PrintQueueContext.Provider>
  );
}

export function usePrintQueue() {
  const context = useContext(PrintQueueContext);

  if (!context) {
    throw new Error("usePrintQueue deve ser usado dentro de <PrintQueueProvider>");
  }

  return context;
}
