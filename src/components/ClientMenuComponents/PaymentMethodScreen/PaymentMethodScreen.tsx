import { Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { BackHeader } from "../BackHeader/BackHeader";
import { UsePaymentMethodScreenController } from "./UsePaymentMethodScreenController";
import { MethodPayment } from "../../../types/Payment.type";
import type { Order } from "../../../types/Order.type";
import DoneScreen from "../DoneScreen/DoneScreen";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CancelIcon from '@mui/icons-material/Cancel';
import PixScreen from "./methodComponents/pixPayment/PixScreen";

interface PaymentMethodScreenProps {
  order: Order;
  total: number;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentMethodScreen({ order, total, onNext, onBack }: PaymentMethodScreenProps) {
  const c = UsePaymentMethodScreenController({ order, total });

  const isApproved = c.paymentStatus === "approved"
  const isRejected = c.paymentStatus === "rejected";
  const isCancelled = c.paymentStatus === "cancelled";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Voltar" />
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Pagamento
        </Typography>

        {c.loading && (
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 4, gap: 2 }}>
            <CircularProgress size={32} />
            <Typography color="text.secondary">Gerando pagamento PIX...</Typography>
          </Stack>
        )}

        {!c.loading && isApproved && (
            <DoneScreen order={order} onNext={onNext}/>
        )}

        {!c.loading && !isApproved && c.expired && (
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 6, gap: 2.5 }}>
            <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "error.dark", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
              <TimerOffIcon sx={{ fontSize: 36, color: "white" }} />
            </Box>

            <Stack sx={{ alignItems: "center", gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                O código Pix expirou!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 280 }}>
                O tempo para pagamento acabou. Gere um novo código para continuar.
              </Typography>
            </Stack>

            <Button endIcon={<SettingsBackupRestoreIcon/>} variant="contained" color="success" size="large" onClick={c.handleRetry} sx={{ mt: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
              Gerar novo PIX
            </Button>
          </Stack>
        )}

        {!c.loading && !c.expired && isRejected && (
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 6, gap: 2.5 }}>
            <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "error.dark", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
              <HighlightOffIcon sx={{ fontSize: 36, color: "white" }} />
            </Box>

            <Stack sx={{ alignItems: "center", gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                Pagamento rejeitado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 280 }}>
                Não foi possível processar o pagamento. Tente novamente.
              </Typography>
            </Stack>

            <Button endIcon={<SettingsBackupRestoreIcon />} variant="contained" color="success" size="large" onClick={c.handleRetry} sx={{ mt: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
              Tentar novamente
            </Button>
          </Stack>
        )}

        {!c.loading && !c.expired && isCancelled && (
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 6, gap: 2.5 }}>
            <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "grey.700", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
              <CancelIcon sx={{ fontSize: 36, color: "white" }} />
            </Box>

            <Stack sx={{ alignItems: "center", gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                Pagamento cancelado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", maxWidth: 280 }}>
                O pagamento foi cancelado. Você pode gerar um novo código para continuar.
              </Typography>
            </Stack>

            <Button endIcon={<SettingsBackupRestoreIcon />} variant="contained" color="success" size="large" onClick={c.handleRetry} sx={{ mt: 1, px: 4, borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
              Gerar novo PIX
            </Button>
          </Stack>
        )}

        
        {!c.loading && !isApproved && !c.expired && !isRejected && !isCancelled && order.paymentMethod === MethodPayment.PIX && (
          <PixScreen
            total={total}
            qrCodeBase64={c.qrCodeBase64}
            qrCode={c.qrCode}
            loading={c.loading}
            formattedTime={c.formattedTime}
            progress={c.progress}
            copied={c.copied}
            onCopy={c.handleCopy}
          />
        )}
      </Container>
    </Box>
  );
}