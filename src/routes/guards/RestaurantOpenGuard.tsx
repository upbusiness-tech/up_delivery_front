import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { usePublicRestaurantIsOpen } from "../../hooks/usePublicRestaurantIsOpen";
import { publicPaths } from "../paths";

/**
 * Impede o cliente de avançar no cardápio/checkout com o restaurante fechado.
 *
 * O cardápio inicial continua acessível para consulta. Qualquer tentativa de
 * abrir produtos, sacola ou etapas do checkout volta para o menu e o
 * `MenuScreen` exibe o aviso de restaurante fechado.
 */
export function RestaurantOpenGuard() {
  const { slug } = usePublicRestaurant();
  const restaurantIsOpen = usePublicRestaurantIsOpen();
  const location = useLocation();

  if (!restaurantIsOpen) {
    return (
      <Navigate
        to={publicPaths.menu(slug)}
        replace
        state={{ restaurantClosed: true, from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
