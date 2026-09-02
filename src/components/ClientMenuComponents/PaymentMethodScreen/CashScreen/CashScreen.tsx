import { Box, Paper, Stack, TextField, Typography, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Order } from '../../../../types/Order.type';
import { moneyMask } from '../../../../utils/masks/mask';
import { ScreenFooterActions } from '../../ScreenFooterActions/ScreenFooterActions';
import { useCashScreenController } from './UseCashScreenController';
import DoneScreen from '../../DoneScreen/DoneScreen';
import { useEffect } from 'react';

interface Props {
  order: Order;
  total: number;
  onBack: () => void;
  onNext: () => void;
  setDisabeHeader: (value: boolean) => void;
}

export function CashScreen({ order, total, onBack, onNext, setDisabeHeader}: Props) {
  const {
    changeFor,
    noChange,
    touched,
    troco,
    insufficient,
    canConfirm,
    formattedChangeFor,
    handleChangeForInput,
    handleBlur,
    handleNoChangeToggle,
    handleConfirm,
    status
  } = useCashScreenController({ order, total, onBack });

  useEffect(() => {
    if (status) setDisabeHeader(true);
  }, [status]);

  return (
    <Paper elevation={0} sx={{p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      {!status && (
      <>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Pagamento em Dinheiro</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              O entregador levará troco caso necessário.
            </Typography>
          </Box>

          <Box sx={{ borderRadius: 3, bgcolor: 'surface.secondary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 600 }}>Total do pedido:</Typography>
            <Typography color='success' variant='h6' sx={{ fontWeight: 700 }}>{moneyMask(total)}</Typography>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={noChange}
                onChange={(e) => handleNoChangeToggle(e.target.checked)}
              />
            }
            label='Não vou precisar de troco'
          />

          {!noChange && (
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                label='Troco para quanto?'
                placeholder='R$ 0,00'
                value={formattedChangeFor}
                onChange={(e) => {
                  handleChangeForInput(e.target.value)
                }
                }
                onBlur={handleBlur}
                error={insufficient}
                helperText={
                  insufficient
                    ? `O valor deve ser maior que o total do pedido (${moneyMask(total)})`
                    : ' '
                }
                slotProps={{
                  htmlInput: { inputMode: 'numeric' },
                  input: {
                    startAdornment: <InputAdornment position='start'>R$</InputAdornment>,
                    endAdornment: touched && changeFor > 0 && !insufficient && (
                      <InputAdornment position='end'>
                        <CheckCircleIcon color='success' fontSize='small' />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          )}

          {/* Bloco de troco: só aparece quando faz sentido mostrar, evita "R$ 0,00" confuso */}
          {noChange ? (
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'surface.secondary', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircleIcon color='success' />
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Pagamento com valor exato
              </Typography>
            </Box>
          ) : insufficient ? (
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'error.light', color: 'error.contrastText', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Valor insuficiente para cobrir o pedido
              </Typography>
            </Box>
          ) : changeFor > total ? (
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <Typography variant='body2' sx={{ opacity: 0.9 }}>Troco estimado</Typography>
              <Typography variant='h5' sx={{ fontWeight: 700 }}>{moneyMask(troco)}</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'surface.secondary' }}>
              <Typography variant='body2' color='text.secondary'>
                Informe o valor que você tem em mãos para calcularmos o troco
              </Typography>
            </Box>
          )}

          <Box sx={{ pb: 2, borderRadius: 3, bgcolor: 'surface.secondary', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.contrastText', fontWeight: 700 }}>
              $
            </Box>
            <Box>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>Pagamento na entrega</Typography>
              <Typography variant='caption' color='text.secondary'>O pedido será pago ao receber.</Typography>
            </Box>
          </Box>
        </Stack>

        <ScreenFooterActions
          onNext={handleConfirm}
          onBack={onBack}
          backLabel='Voltar'
          nextLabel='Confirmar Pedido'
          nextDisabled={!canConfirm}
        />
      </>
      )}
      
      {status && (
        <DoneScreen total={total} onNext={onNext} order={order}/>
      )}
    </Paper>
  );
}