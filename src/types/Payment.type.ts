export enum MethodPayment {
  PIX = 'pix',
  CARD = 'card',
  CASH = 'cash',
}

export interface PixData {
  orderId: string;
  qrCode: string;
  qrCodeBase64: string;
  expiresAt: string;
}

export interface CreatePixPayment {
  amount: number;
  paymentMethod: 'pix';
  payerEmail: string;
  description: string;
  orderInternalId: string;
}

export interface RestaurantPublicKey {
  id: string;
  mercadoPagoPublicKey: string | null;
}

export interface CardPaymentPayload {
  token: string;
  issuer_id?: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  orderId: string;
}

export interface CardPaymentResult {
  id: number;
  status: string;
  status_detail?: string;
  payment_type_id?: string;
}

export interface OrderPaymentStatusData {
  isPaid: boolean;
  paymentStatus: string;
  paymentMethod?: string;
}
