export enum MethodPayment { PIX = 'pix', CARD = 'card', CASH = 'cash', }

export interface PixData {
  orderId: string;
  qrCode: string;
  qrCodeBase64: string;
  expiresAt: string;
}

export interface CreatePayment {
  amount: number;
  paymentMethod: 'pix';
  payerEmail: string;
  description: string;
  orderInternalId: string;
}