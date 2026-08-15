import { CardPayment } from '@mercadopago/sdk-react';
import { useCallback, useEffect } from 'react';
import type { Order } from '../../../../types/Order.type';
import type { ICardPaymentBrickPayer, ICardPaymentFormData } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';
import { UseCardScreenController } from './UseCardScreenController';
import DoneScreen from '../../DoneScreen/DoneScreen';
interface PaymentFormProps {
  amount: number;
  order: Order
  onNext: () => void;
  setDisabeHeader: (value: boolean) => void;
}

export function CardScreen({ amount, order, onNext, setDisabeHeader}: PaymentFormProps) {

  const c = UseCardScreenController({order})

  const isApproved = c.paymentStatus === 'approved';
  const isInProcess = c.paymentStatus === 'in_process' || c.paymentStatus === 'pending';
  const isRejected = c.paymentStatus === 'rejected';

  useEffect(() => {
    if (isApproved) setDisabeHeader(true);
  }, [isApproved]);

  const initialization = {
    amount
  };

  const customization: any = {
    paymentMethods: {
      creditCard: 'all',
      maxInstallments: 1,
    },
  };

  const onSubmit = useCallback(
    async (cardFormData: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
      const response = await fetch(`http://localhost:3000/payment/create-payment-card/${order.restaurant.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardFormData, orderId: order.id }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar pagamento');
      }

      const result = await response.json();
      c.setLocalStatus(result.status); // feedback imediato, até o socket confirmar
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
    <>
      {isApproved && <DoneScreen order={order} onNext={onNext} />}

      {!isApproved && !isInProcess && (
          <CardPayment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
            />
      )}

      {isInProcess && <p>Pagamento em análise...</p>}
      {isRejected && <p>Pagamento recusado. Tente novamente.</p>}
    </>
  );
}