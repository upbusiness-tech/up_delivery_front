import { useEffect, useMemo, useState } from "react";
import type { Restaurant } from "../types/Restaurant.type";
import { isRestaurantOpenAt } from "../utils/restaurant/isRestaurantOpenAt";

/** Reavalia o status localmente; não gera nenhuma requisição. */
const STATUS_REFRESH_INTERVAL = 60_000;

type RestaurantOpenStatusSource = Pick<
  Restaurant,
  "businessHours" | "isOpen" | "isOpenOverrideUntil"
>;

/**
 * Status de funcionamento calculado no navegador.
 *
 * Considera o horário de funcionamento e o eventual abrir/fechar manual.
 * O relógio interno faz o status mudar sozinho nos limites da agenda, sem
 * polling na API.
 */
export function useRestaurantOpenStatus(
  restaurant: RestaurantOpenStatusSource | null | undefined,
) {
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
    () => (restaurant ? isRestaurantOpenAt(restaurant, now) : false),
    [restaurant, now],
  );
}
