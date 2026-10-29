import { AttachMoney, CreditCard, Pix as PixIcon } from "@mui/icons-material";

interface UsePaymentControllerProps {
  setPaymentMethod: (method: string) => void;
  allowPixPayment: boolean;
  allowCardPayment: boolean;
}

interface PaymentOption {
  id: "pix" | "card" | "cash";
  label: string;
  desc: string;
  Icon: typeof PixIcon;
  enabled: boolean;
  /** Recebe destaque visual mesmo quando ainda não está selecionado. */
  highlight?: boolean;
  /** Cor de destaque da opção (ex.: azul claro do Pix). */
  accent?: string;
  /** Selo exibido ao lado do nome. */
  tag?: string;
  /** Informação adicional exibida abaixo da descrição. */
  badge?: string;
}

export function UsePaymentController({ setPaymentMethod, allowPixPayment, allowCardPayment }: UsePaymentControllerProps) {
  const allOpts: PaymentOption[] = [
    {
      id: "pix",
      label: "Pix",
      desc: "Aprovação imediata",
      Icon: PixIcon,
      enabled: allowPixPayment,
      highlight: true,
      accent: "#32BCAD",
      tag: "Recomendado",
    },
    {
      id: "card",
      label: "Via Cartão",
      desc: "Crédito ou débito",
      Icon: CreditCard,
      enabled: allowCardPayment,
      badge: "Processado pelo Mercado Pago",
    },
    {
      id: "cash",
      label: "Dinheiro",
      desc: "Pagar na entrega",
      Icon: AttachMoney,
      enabled: true,
    },
  ];

  const opts = allOpts.filter((o) => o.enabled);

  return {
    opts,
    setPaymentMethod,
  };
}
