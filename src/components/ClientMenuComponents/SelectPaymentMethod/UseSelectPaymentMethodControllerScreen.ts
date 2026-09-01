import { AttachMoney, CreditCard, Pix as PixIcon } from "@mui/icons-material";

interface UsePaymentControllerProps {
  setPaymentMethod: (method: string) => void;
  allowPixPayment: boolean;
  allowCardPayment: boolean;
}

export function UsePaymentController({setPaymentMethod, allowPixPayment, allowCardPayment }: UsePaymentControllerProps) {
  const allOpts = [
    { id: "pix" as const, label: "Pix", desc: "Aprovação imediata", Icon: PixIcon, enabled: allowPixPayment },
    { id: "card" as const, label: "Cartão crédito/débito", desc: "Crédito ou débito", Icon: CreditCard, enabled: allowCardPayment },
    { id: "cash" as const, label: "Dinheiro", desc: "Pagar na entrega", Icon: AttachMoney, enabled: true },
  ];

  const opts = allOpts.filter((o) => o.enabled);

  return {
    opts,
    setPaymentMethod
  };
}