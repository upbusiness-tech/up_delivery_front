import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { BackHeader } from "../BackHeader/BackHeader";
import PixScreen from "./methodComponents/PixScreen";
import { UsePaymentMethodScreenController } from "./UsePaymentMethodScreenController";
import { MethodPayment } from "../../../types/Payment.type";
import type { Order } from "../../../types/Order.type";
import DoneScreen from "../DoneScreen/DoneScreen";

interface PaymentMethodScreenProps {
  order: Order;
  total: number;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentMethodScreen({ order, total, onNext, onBack }: PaymentMethodScreenProps) {
  const c = UsePaymentMethodScreenController({ order, total });

  const isApproved = c.paymentStatus === "approved"

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!c.loading && !isApproved && (
        <BackHeader onBack={onBack} title="Voltar" />
      )}
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
        
        {!c.loading && !isApproved && order.paymentMethod === MethodPayment.PIX && (
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