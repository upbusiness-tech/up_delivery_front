export const ORDER_TIME_ZONE = "America/Fortaleza";

/**
 * A API grava `created_at` em UTC em uma coluna `timestamp` sem fuso. O driver
 * do Postgres devolve esse valor interpretado no fuso do servidor, o que
 * acrescenta 3 horas ao horário local. Enquanto a API não corrige a origem,
 * normalizamos aqui para manter o mesmo horário usado na impressão.
 */
const API_DATE_OFFSET_MS = 3 * 60 * 60 * 1000;

export function parseOrderDate(value?: string | Date | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getTime() - API_DATE_OFFSET_MS);
}

export function formatOrderDate(
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = {},
) {
  const date = parseOrderDate(value);
  if (!date) return null;

  return date.toLocaleString("pt-BR", {
    timeZone: ORDER_TIME_ZONE,
    ...options,
  });
}
