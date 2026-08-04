// CardPaymentScreen.tsx
import { useEffect } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { Box, Typography } from "@mui/material";

interface Props {
  total: number;
  publicKey: string;
  onSubmit: (formData: any) => Promise<void>;
}

export default function CardPaymentScreen({ total, publicKey, onSubmit }: Props) {
  useEffect(() => {
    initMercadoPago(publicKey, { locale: 'pt-BR' });
  }, [publicKey]);

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Pague com cartão
      </Typography>
      <CardPayment
        initialization={{ amount: total }}
        customization={{
          paymentMethods: {
            maxInstallments: 1,
          },
        }}
        onSubmit={async (formData) => {
          await onSubmit(formData);
        }}
        onError={(error) => {
          console.error("Erro no Card Payment Brick:", error);
        }}
        onReady={() => {
          console.log("Brick pronto");
        }}
      />
    </Box>
  );
}