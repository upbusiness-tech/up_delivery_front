import { Payment } from '@mercadopago/sdk-react';
import { useCallback } from 'react';
import type { Order } from '../../../../types/Order.type';

interface PaymentFormProps {
  amount: number;
  order: Order
}

interface BrickSubmitData {
  selectedPaymentMethod: string;
  formData: {
    token: string;
    issuer_id: string;
    payment_method_id: string;
    transaction_amount: number;
    installments: number;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
    };
  };
}

export function CardScreen({ amount, order }: PaymentFormProps) {
  const initialization = {
    amount,
  };

  const customization = {
    paymentMethods: {
      creditCard: 'all' as const,
      debitCard: 'all' as const,
      maxInstallments: 12,
    },
  };

  const onSubmit = useCallback(
    async ({ selectedPaymentMethod, formData }: BrickSubmitData) => {
      const response = await fetch(`http://localhost:3000/payment/payment-card/${order.restaurant.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, selectedPaymentMethod, orderId: order.id }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar pagamento');
      }

      const result = await response.json();

      switch (result.status) {
        case 'approved':
          console.log('Pagamento aprovado!');
          break;
        case 'in_process':
        case 'pending':
          console.log('Pagamento em análise.');
          break;
        case 'rejected':
          console.log('Pagamento recusado:', result.status_detail);
          break;
      }
    },
    [order.restaurant.id, order.id]
  );

  const onError = useCallback((error: unknown) => {
    console.error('Erro no Payment Brick:', error);
  }, []);

  const onReady = useCallback(() => {
    // esconder loading
  }, []);

  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
    />
  );
}