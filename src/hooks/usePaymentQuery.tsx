import { useQuery } from "@tanstack/react-query";
import { PaymentSevice } from "../api/services/payment.service";

export function usePaymentStatus(orderId: string) {
  return useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => PaymentSevice.getPaymentStatus(orderId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.isPaid) return false; // já aprovado, para de perguntar
      return 3000; // continua perguntando a cada 3s
    },
    enabled: !!orderId,
  });
}