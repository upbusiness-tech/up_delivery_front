import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCheckout, type CheckoutStep } from "../../checkout/CheckoutContext";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { publicPaths } from "../paths";

interface CheckoutStepGuardProps {
  /** Passo que a rota representa. O guard valida todos os passos anteriores. */
  step: CheckoutStep;
  children: ReactNode;
}

/**
 * Aplica a ordem do checkout:
 *
 *   cardápio -> carrinho -> dados pessoais -> endereço -> pagamento
 *
 * - Sem produtos, o carrinho (e todo o resto) volta para o cardápio.
 * - Sem dados pessoais, endereço/pagamento voltam para os dados pessoais.
 * - Sem endereço, o pagamento volta para o endereço.
 */
export function CheckoutStepGuard({ step, children }: CheckoutStepGuardProps) {
  const { slug } = usePublicRestaurant();
  const { getBlockedRedirect } = useCheckout();
  const location = useLocation();
  const redirect = getBlockedRedirect(step);

  if (redirect) {
    const to = redirect === "menu" ? publicPaths.menu(slug) : publicPaths[redirect](slug);
    return <Navigate to={to} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
