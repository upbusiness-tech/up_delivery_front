import { AttachMoney, CreditCard, Pix as PixIcon } from "@mui/icons-material";
import { useState } from "react";

export function UsePaymentController() {

  const [paymentMethod, setPaymentMethod] = useState("pix")

  const opts = [
    { id: "pix" as const, label: "Pix", desc: "Aprovação imediata", Icon: PixIcon },
    { id: "card" as const, label: "Cartão", desc: "Crédito ou débito", Icon: CreditCard },
    { id: "cash" as const, label: "Dinheiro", desc: "Pagar na entrega", Icon: AttachMoney },
  ];
  
  
  return {
    opts,
    paymentMethod,
    setPaymentMethod
  };
}