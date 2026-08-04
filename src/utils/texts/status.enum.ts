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

