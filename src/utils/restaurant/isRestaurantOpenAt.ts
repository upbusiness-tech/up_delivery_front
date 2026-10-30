import type { Restaurant } from "../../types/Restaurant.type";

/**
 * Mesmo fuso usado pela API para validar o horário de funcionamento.
 * Como o status agora é calculado no navegador, manter esta regra alinhada
 * evita divergência entre o cardápio e a criação do pedido.
 */
const RESTAURANT_TIME_ZONE = "America/Sao_Paulo";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: RESTAURANT_TIME_ZONE,
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function toMinutes(time: string | null | undefined) {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  return hours * 60 + minutes;
}

/**
 * Calcula se o restaurante está aberto em um determinado instante.
 *
 * A regra é a mesma da API hoje: verifica apenas os intervalos de
 * `businessHours` do dia atual, no fuso de São Paulo. O campo `isOpen` não
 * participa do cálculo.
 */
export function isRestaurantOpenAt(
  restaurant: Pick<Restaurant, "businessHours">,
  date = new Date(),
) {
  const parts = dateTimeFormatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value.toLowerCase();
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  if (!weekday || !Number.isFinite(hour) || !Number.isFinite(minute)) {
    return false;
  }

  const nowInMinutes = hour * 60 + minute;
  const todayHours = restaurant.businessHours?.[weekday] ?? [];

  return todayHours.some(({ openTime, closeTime }) => {
    const openInMinutes = toMinutes(openTime);
    const closeInMinutes = toMinutes(closeTime);

    if (openInMinutes === null || closeInMinutes === null) return false;

    return nowInMinutes >= openInMinutes && nowInMinutes <= closeInMinutes;
  });
}
