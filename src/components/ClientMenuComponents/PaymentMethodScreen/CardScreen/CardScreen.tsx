import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { Order } from '../../../../types/Order.type';
import type { ICardPaymentBrickPayer, ICardPaymentFormData } from '@mercadopago/sdk-react/esm/bricks/cardPayment/type';
import type { IBrickError } from '@mercadopago/sdk-react/esm/bricks/util/types/common';
import { UseCardScreenController } from './UseCardScreenController';
import DoneScreen from '../../DoneScreen/DoneScreen';
import { PaymentSevice } from '../../../../api/services/payment.service';
import { Alert, Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import { moneyMask } from '../../../../utils/masks/mask';
import {
  CreditCard,
  LockOutlined,
  VerifiedUserOutlined,
} from '@mui/icons-material';

interface PaymentFormProps {
  amount: number;
  order: Order;
  userEmail: string;
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

function getPaymentErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.join(' ');
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === 'string' && data.error.trim()) {
      return data.error;
    }
  }

  return 'Não foi possível processar o pagamento. Confira os dados do cartão e tente novamente.';
}

function OrderTotalCard({ amount }: { amount: number }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: 'divider' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 800,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}
          >
            Total do pedido
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.2rem', sm: '1.85rem' },
              lineHeight: 1.1,
            }}
          >
            {moneyMask(amount)}
          </Typography>
        </Stack>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            bgcolor: 'rgba(46, 125, 50, 0.08)',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CreditCard />
        </Box>
      </Stack>
    </Paper>
  );
}

function MercadoPagoNotice() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.75,
        borderRadius: 3,
        borderColor: 'rgba(0, 158, 227, 0.28)',
        bgcolor: 'rgba(0, 158, 227, 0.05)',
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #009EE3 0%, #007EB9 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 6px 14px rgba(0, 158, 227, 0.22)',
          }}
        >
          <VerifiedUserOutlined sx={{ fontSize: 21 }} />
        </Box>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Pagamento seguro
            </Typography>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                px: 0.75,
                py: 0.2,
                borderRadius: 999,
                bgcolor: '#fff',
                border: '1px solid rgba(0, 158, 227, 0.28)',
                color: '#007EB9',
                fontSize: '0.65rem',
                fontWeight: 800,
                lineHeight: 1.4,
              }}
            >
              <VerifiedUserOutlined sx={{ fontSize: 12 }} />
              mercado pago
            </Box>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
            O pagamento é processado pelo Mercado Pago. Os dados do cartão são enviados
            diretamente a ele e não são salvos pela UpDelivery.
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export function CardScreen({ amount, order, userEmail, onNext, setDisabeHeader }: PaymentFormProps) {
  const c = UseCardScreenController({ order });
  const [publicKeyAttempt, setPublicKeyAttempt] = useState(0);
  const [mpReady, setMpReady] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);
  const [isBrickReady, setIsBrickReady] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isApproved = c.isPaid;
  const isInProcess = c.paymentStatus === 'in_process' || c.paymentStatus === 'pending';
  const isRejected = c.paymentStatus === 'rejected';
  const isCancelled = c.paymentStatus === 'cancelled';
  const reachedMaxAttempts = isRejected && c.attempts >= MAX_ATTEMPTS;

  useEffect(() => {
    if (isApproved) setDisabeHeader(true);
  }, [isApproved, setDisabeHeader]);

  useEffect(() => {
    setIsBrickReady(false);
  }, [c.brickKey]);

  // A chave pública é do restaurante que recebe o pagamento. Usar uma chave
  // global fazia o token do cartão ser criado em uma conta diferente da conta
  // usada para cobrar, o que fazia o Mercado Pago recusar o pagamento.
  useEffect(() => {
    let active = true;

    setMpReady(false);
    setMpError(null);
    setIsBrickReady(false);

    PaymentSevice.getRestaurantPublicKey(order.restaurant.id)
      .then((data) => {
        if (!active) return;

        if (!data.mercadoPagoPublicKey) {
          setMpError('O restaurante ainda não configurou o pagamento com cartão.');
          return;
        }

        initMercadoPago(data.mercadoPagoPublicKey, { locale: 'pt-BR' });
        setMpReady(true);
      })
      .catch((error) => {
        console.error('Erro ao carregar a chave pública do Mercado Pago:', error);
        if (active) {
          setMpError('Não foi possível carregar o pagamento com cartão. Tente novamente.');
        }
      });

    return () => {
      active = false;
    };
  }, [order.restaurant.id, publicKeyAttempt]);

  const initialization = useMemo(
    () => ({
      amount,
      ...(userEmail ? { payer: { email: userEmail } } : {}),
    }),
    [amount, userEmail],
  );

  const customization: any = useMemo(
    () => ({
      paymentMethods: {
        minInstallments: 1,
        maxInstallments: 1,
        types: {
          included: ['credit_card', 'debit_card'],
        },
      },
    }),
    [],
  );

  const onSubmit = useCallback(
    async (cardFormData: ICardPaymentFormData<ICardPaymentBrickPayer>) => {
      setSubmitError(null);

      try {
        const result = await PaymentSevice.createCardPayment(order.restaurant.id, {
          token: cardFormData.token,
          issuer_id: cardFormData.issuer_id || undefined,
          payment_method_id: cardFormData.payment_method_id,
          transaction_amount: Number(cardFormData.transaction_amount ?? amount),
          installments: Number(cardFormData.installments ?? 1),
          payer: {
            email: cardFormData.payer?.email || userEmail,
            ...(cardFormData.payer?.identification
              ? { identification: cardFormData.payer.identification }
              : {}),
          },
          orderId: order.id,
        });

        c.handlePaymentResult(result);
      } catch (error) {
        console.error('Erro ao processar o pagamento com cartão:', error);
        setSubmitError(getPaymentErrorMessage(error));
      }
    },
    [amount, c.handlePaymentResult, order.id, order.restaurant.id, userEmail],
  );

  const onError = useCallback((error: IBrickError) => {
    console.error('Erro no Payment Brick:', error);

    if (error.type === 'critical') {
      setMpError(error.message || 'Não foi possível carregar o formulário de pagamento.');
      return;
    }

    setIsBrickReady(true);
  }, []);

  const onReady = useCallback(() => {
    setIsBrickReady(true);
  }, []);

  const retryLoad = () => {
    setMpError(null);
    setSubmitError(null);
    setMpReady(false);
    setPublicKeyAttempt((prev) => prev + 1);
  };

  const failureMessage = isCancelled
    ? 'Pagamento cancelado. Tente novamente com outro cartão ou use Pix.'
    : getRejectionMessage(c.statusDetail);

  return (
    <>
      {isApproved && <DoneScreen total={amount} order={order} onNext={onNext} />}

      {!isApproved && (
        <Stack spacing={2} sx={{ py: 1.5 }}>
          <OrderTotalCard amount={amount} />
          <MercadoPagoNotice />

          {!isInProcess && !isRejected && !isCancelled && mpError && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={2}>
                <Alert severity="error" sx={{ alignItems: 'center' }}>{mpError}</Alert>
                <Button
                  size="small"
                  onClick={retryLoad}
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ py: 1.2, fontWeight: 700, textTransform: 'none' }}
                >
                  Tentar novamente
                </Button>
              </Stack>
            </Paper>
          )}

          {!isInProcess && !isRejected && !isCancelled && !mpError && (
            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CreditCard sx={{ fontSize: 19 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        Dados do cartão
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Crédito ou débito · pagamento à vista
                      </Typography>
                    </Box>
                  </Stack>
                  <LockOutlined sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} />
                </Stack>

                <Divider />

                {submitError && (
                  <Alert
                    severity="error"
                    sx={{ alignItems: 'center' }}
                    onClose={() => setSubmitError(null)}
                  >
                    {submitError}
                  </Alert>
                )}

                <Box sx={{ position: 'relative', minHeight: isBrickReady ? undefined : 220 }}>
                  {mpReady && (
                    <Box sx={{ opacity: isBrickReady ? 1 : 0, transition: 'opacity 160ms ease' }}>
                      <CardPayment
                        key={`${order.restaurant.id}-${c.brickKey}`}
                        initialization={initialization}
                        customization={customization}
                        onSubmit={onSubmit}
                        onReady={onReady}
                        onError={onError}
                      />
                    </Box>
                  )}

                  {(!mpReady || !isBrickReady) && (
                    <Stack
                      spacing={1}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                      }}
                    >
                      <CircularProgress size={28} color="success" />
                      <Typography variant="body2" color="text.secondary">
                        Carregando pagamento...
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Paper>
          )}

          {isInProcess && (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <CircularProgress color="warning" />
                <Typography sx={{ fontWeight: 700 }}>Pagamento em análise...</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', maxWidth: 360 }}
                >
                  Isso pode levar alguns instantes. Se você já pagou, aguarde a confirmação do
                  Mercado Pago.
                </Typography>
                <Button
                  size="small"
                  onClick={c.checkStatus}
                  disabled={c.checking}
                  variant="outlined"
                  color="success"
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  {c.checking ? 'Verificando...' : 'Verificar novamente'}
                </Button>
              </Stack>
            </Paper>
          )}

          {(isRejected || isCancelled) && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={2}>
                <Alert severity="error" sx={{ alignItems: 'center' }}>{failureMessage}</Alert>

                {!reachedMaxAttempts && (
                  <Button
                    size="small"
                    onClick={c.retry}
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ py: 1.2, fontWeight: 700, textTransform: 'none' }}
                  >
                    Tentar novamente
                  </Button>
                )}

                {reachedMaxAttempts && (
                  <Alert severity="warning" sx={{ alignItems: 'center' }}>
                    Muitas tentativas recusadas. Que tal pagar com Pix?
                  </Alert>
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      )}
    </>
  );
}
