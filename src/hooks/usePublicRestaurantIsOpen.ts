import { useEffect, useMemo, useState } from "react";
import { usePublicRestaurant } from "../context/PublicRestaurantContext";
import { isRestaurantOpenAt } from "../utils/restaurant/isRestaurantOpenAt";

/** Reavalia o horário localmente; não gera nenhuma requisição. */
const STATUS_REFRESH_INTERVAL = 60_000;

/**
 * Status de funcionamento do restaurante público.
 *
 * O `businessHours` já vem no carregamento do restaurante e fica no contexto
 * público. O status é apenas uma conta de horário, então não precisa de
 * endpoint próprio nem de polling.
 */
export function usePublicRestaurantIsOpen() {
  const { restaurant } = usePublicRestaurant();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    const intervalId = window.setInterval(refresh, STATUS_REFRESH_INTERVAL);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  return useMemo(
    () => isRestaurantOpenAt(restaurant, now),
    [restaurant, now],
  );
}
