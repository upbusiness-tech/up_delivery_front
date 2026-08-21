import { Box, Container } from "@mui/material";
import { MethodPayment } from "../../../types/Payment.type";
import type { Order } from "../../../types/Order.type";
import PixScreen from "./PixScreen/PixScreen";
import { CardScreen } from "./CardScreen/CardScreen";
import { CashScreen } from "./CashScreen/CashScreen";
import { BackHeader } from "../BackHeader/BackHeader";
import { useState } from "react";

interface PaymentMethodScreenProps {
  order: Order;
  total: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  paymentMethod: string;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentMethodScreen({ order, total, paymentMethod, userEmail, onBack, onNext }: PaymentMethodScreenProps) {
  const [disabeHeader, setDisabeHeader] = useState(false)
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!disabeHeader && (
        <BackHeader onBack={onBack} title="Voltar"/>
      )}
      <Container maxWidth="sm" sx={{flex: 1, display: "flex", flexDirection: "column" }}>
        {paymentMethod === MethodPayment.PIX && (
          <PixScreen
            total={total}
            order={order}
            userEmail={userEmail}
            onNext={onNext}
            onBack={onBack}
            setDisabeHeader={setDisabeHeader}
            />
          )}
        {paymentMethod === MethodPayment.CARD && ( 
          <CardScreen
          amount={total}
          order={order}
          onNext={onNext}
          setDisabeHeader={setDisabeHeader}
          />
        )}
        {paymentMethod === MethodPayment.CASH && ( 
          <CashScreen
            order={order}
            total={total}
            onBack={onBack}
            onNext={onNext}
            setDisabeHeader={setDisabeHeader}
            />
        )}
      </Container>
    </Box>
  );
}