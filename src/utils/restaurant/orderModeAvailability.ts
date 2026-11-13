/** Mesmo fuso usado pela API para validar horários do restaurante. */
const RESTAURANT_TIME_ZONE = "America/Sao_Paulo";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: RESTAURANT_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function getRestaurantMinutes(date: Date) {
  const parts = timeFormatter.formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  return hour * 60 + minute;
}

/**
 * Informa se o corte diário de uma modalidade já foi atingido.
 *
 * O horário é interpretado no fuso do restaurante, não no fuso do dispositivo.
 * Sem corte configurado, a modalidade continua seguindo apenas a permissão
 * manual do restaurante.
 */
export function isOrderModeCutoffReached(
  cutoffTime: string | null | undefined,
  date = new Date(),
) {
  if (!cutoffTime) return false;

  const [hour, minute] = cutoffTime.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false;

  const nowInMinutes = getRestaurantMinutes(date);
  if (nowInMinutes === null) return false;

  return nowInMinutes >= hour * 60 + minute;
}
