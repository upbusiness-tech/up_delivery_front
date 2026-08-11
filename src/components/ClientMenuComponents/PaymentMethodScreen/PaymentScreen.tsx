import { Box, Container } from "@mui/material";
import { BackHeader } from "../BackHeader/BackHeader";
import { MethodPayment } from "../../../types/Payment.type";
import type { Order } from "../../../types/Order.type";
import PixScreen from "./PixScreen/PixScreen";
import { CardScreen } from "./CardScreen/CardScreen";

interface PaymentMethodScreenProps {
  order: Order;
  total: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  paymentMethod: string,
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentMethodScreen({ order, total, paymentMethod, userEmail, onBack, onNext }: PaymentMethodScreenProps) {
  
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <BackHeader onBack={onBack} title="Voltar" />
      <Container maxWidth="sm" sx={{ py: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        {paymentMethod === MethodPayment.PIX && (
          <PixScreen
            total={total}
            order={order}
            userEmail={userEmail}
            onNext={onNext}
          />
        )}
        {paymentMethod === MethodPayment.CARD && ( 
          <CardScreen
            amount={total}
            order={order}
          />
        )}
      </Container>
    </Box>
  );
}