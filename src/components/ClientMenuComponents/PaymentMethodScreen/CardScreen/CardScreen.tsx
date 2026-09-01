import { CardPayment } from '@mercadopago/sdk-react';
import { useCallback, useEffect } from 'react';
import type { Order } from '../../../../types/Order.type';
import type { ICardPaymentBrickPayer, ICardPaymentFormData } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';
import { UseCardScreenController } from './UseCardScreenController';
import DoneScreen from '../../DoneScreen/DoneScreen';
import { PaymentSevice } from '../../../../api/services/payment.service';
import { Alert, Button, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import { moneyMask } from '../../../../utils/masks/mask';
import { CreditCard } from '@mui/icons-material';
interface PaymentFormProps {
  amount: number;
  order: Order
  onNext: () => void;
  setDisabeHeader: (value: boolean) => void;
}

const REJECTION_MESSAGES: Record<string, string> = {
  cc_rejected_bad_filled_card_number: 'Número do cartão inválido. Confira e tente novamente.',
  cc_rejected_bad_filled_date: 'Data de validade inválida.',
  cc_rejected_bad_filled_security_code: 'Código de segurança inválido.',
  cc_rejected_bad_filled_other: 'Dados do cartão incorretos.',
  cc_rejected_insufficient_amount: 'Saldo insuficiente no cartão.',
  cc_rejected_call_for_authorize: 'Seu banco não autorizou a compra. Entre em contato com o banco.',
  cc_rejected_card_disabled: 'Cartão desabilitado. Ligue para o seu banco.',
  cc_rejected_duplicated_payment: 'Já existe um pagamento com esse valor. Aguarde ou use outro cartão.',
  cc_rejected_high_risk: 'Pagamento recusado. Verifique os dados digitados ou tente outro cartão.',
  cc_rejected_max_attempts: 'Limite de tentativas excedido. Tente outro cartão ou use Pix.',
};

const MAX_ATTEMPTS = 3;

function getRejectionMessage(statusDetail: string | null): string {
  if (!statusDetail) return 'Pagamento recusado. Tente novamente.';
  return REJECTION_MESSAGES[statusDetail] ?? 'Pagamento recusado. Tente novamente.';
}

export function CardScreen({ amount, order, onNext, setDisabeHeader}: PaymentFormProps) {

  const c = UseCardScreenController({order})

  const isApproved = c.paymentStatus === 'approved';
  const isInProcess = c.paymentStatus === 'in_process' || c.paymentStatus === 'pending';
  const isRejected = c.paymentStatus === 'rejected';
  const reachedMaxAttempts = c.attempts >= MAX_ATTEMPTS;

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
      const result = await PaymentSevice.createCardPayment(order.restaurant.id, {
        ...cardFormData,
        orderId: order.id,
      });

      c.handlePaymentResult(result);
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

      {!isApproved && !isInProcess && !isRejected && (
      <Stack spacing={2} sx={{ py: 1 }}>
        <Paper
          variant="outlined"
          sx={{ p: 1.5, borderRadius: 2, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.50" }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <CreditCard fontSize="small" color="action" />
            <Typography variant="body2" color="success.main">Total a pagar</Typography>
          </Stack>
          <Typography sx={{ fontWeight: 700, fontSize: "1.4rem" }}>{moneyMask(order.orderTotal)}</Typography>
        </Paper>

        <Divider sx={{ my: 0.5 }} />

        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
          Dados do cartão
        </Typography>

        <CardPayment
          key={c.brickKey}
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
          />
      </Stack>
    )}

      {isInProcess && (
        <Stack spacing={2} sx={{ py: 4, alignItems: "center" }}>
          <CircularProgress color="warning" />
          <Typography sx={{ fontWeight: 600 }}>Pagamento em análise...</Typography>
          <Typography variant="body2" color="text.secondary">Isso pode levar alguns instantes.</Typography>
        </Stack>
      )}

      {isRejected && (
        <Stack spacing={2} sx={{ py: 2 }}>
          <Alert severity="error" sx={{ alignItems: "center" }}>{getRejectionMessage(c.statusDetail)}</Alert>

          {!reachedMaxAttempts && (
            <Button size='small' onClick={c.retry} variant="contained" color="success" fullWidth sx={{ py: 1.2, fontWeight: 700, textTransform: 'none'}}>
              Tentar novamente
            </Button>
          )}

          {reachedMaxAttempts && (
            <Alert severity="warning" sx={{ alignItems: "center" }}>Muitas tentativas recusadas. Que tal pagar com Pix?</Alert>
          )}
        </Stack>
      )}
    </>
  );
}