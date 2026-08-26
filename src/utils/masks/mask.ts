/*88981496910 -> (88) 9 8149-6910*/
export function phoneMask(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(0, 11);
  if (digits.length !== 11) return digits;
  return digits.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
}

/*100 -> R$100,00*/
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export function moneyMask(value: number): string {
  return currencyFormatter.format(value);
}

/*delivery -> Delivery/PIX -> Pix*/
export function capitalizeMask(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/*12345678900 -> 123.456.789-00*/
export function cpfMask(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cash: 'Dinheiro',
  pix: 'Pix',
  card: 'Cartão',
};

export function paymentMethodMask(method: string): string {
  return PAYMENT_METHOD_LABEL[method] ?? capitalizeMask(method);
}