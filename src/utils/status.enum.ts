export enum STATUS {
  PENDENTE = 'PENDENTE',
  EM_PREPARO = 'EM_PREPARO',
  EM_ROTA = 'EM_ROTA',
  PRONTO_RETIRADA = 'PRONTO_RETIRADA',
  CANCELADO = 'CANCELADO',
  FINALIZADO = 'FINALIZADO'
}

export const STATUS_LABEL: Record<STATUS, string> = {
  [STATUS.PENDENTE]: "Pendente",
  [STATUS.EM_PREPARO]: "Em preparo",
  [STATUS.EM_ROTA]: "Em rota",
  [STATUS.PRONTO_RETIRADA]: "Pronto para retirar",
  [STATUS.CANCELADO]: "Cancelado",
  [STATUS.FINALIZADO]: "Finalizado",
};

export default function STATUS_COLOR(status: string): string {
  switch (status) {
    case STATUS.PENDENTE:
      return "#fc8c30d3";
    case STATUS.EM_PREPARO:
      return "#60A5FA";
    case STATUS.EM_ROTA:
      return "#fddb52";
    case STATUS.PRONTO_RETIRADA:
      return "#fddb52";
    case STATUS.CANCELADO:
      return "#F87171";
    case STATUS.FINALIZADO:
      return "#4ADE80";
    default:
      return "#9CA3AF";
  }
}