import { AttachMoney, CreditCard, Pix as PixIcon } from "@mui/icons-material";

interface UsePaymentControllerProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export function UsePaymentController({ paymentMethod, setPaymentMethod }: UsePaymentControllerProps) {

  const opts = [
    { id: "pix" as const, label: "Pix", desc: "Aprovação imediata", Icon: PixIcon },
    { id: "card" as const, label: "Cartão crédito/débito", desc: "Crédito ou débito", Icon: CreditCard },
    { id: "cash" as const, label: "Dinheiro", desc: "Pagar na entrega", Icon: AttachMoney },
  ];

  return {
    opts,
    paymentMethod,
    setPaymentMethod
  };
}