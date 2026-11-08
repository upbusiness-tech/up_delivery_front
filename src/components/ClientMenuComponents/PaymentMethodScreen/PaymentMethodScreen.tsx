import { Box, Container } from "@mui/material";
import { MethodPayment } from "../../../types/Payment.type";
import type { Order } from "../../../types/Order.type";
import PixScreen from "./PixScreen/PixScreen";
import { CardScreen } from "./CardScreen/CardScreen";
import { CashScreen } from "./CashScreen/CashScreen";
import { BackHeader } from "../BackHeader/BackHeader";
import {useState } from "react";

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
  const isCash = paymentMethod === MethodPayment.CASH;

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {!disabeHeader && <BackHeader onBack={onBack} title="Voltar" />}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: isCash ? "hidden" : "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            py: { xs: 1, sm: 0 },
          }}
        >
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
              userEmail={userEmail}
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
    </Box>
  );
}