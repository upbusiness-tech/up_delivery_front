import { STATUS } from "../texts/status.enum";

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