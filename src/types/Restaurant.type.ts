export interface Restaurant {
  id: string;
  restaurantName: string;
  restaurantEmail: string;
  restaurantPhone: string;
  restaurantAddress: string;
  businessHours: Record<string, BusinessHourInterval[]>;
  /** Horário diário em que as entregas deixam de aceitar novos pedidos. */
  deliveryCutoffTime?: string | null;
  /** Horário diário em que as retiradas deixam de aceitar novos pedidos. */
  pickupCutoffTime?: string | null;
  slug: string;
  image: string;
  description: string;
  isOpen: boolean;
  isOpenOverrideUntil?: string | null;
  active: boolean;
}

export interface BusinessHourInterval {
  openTime: string | null;
  closeTime: string | null;
}

export interface Neighborhood {
  id: string;
  neighborhoodName: string
  deliveryFee: number
}

export interface NeighborhoodDTO {
  neighborhoodName: string;
  deliveryFee: number;
}

export type BusinessHours = Record<string, BusinessHourInterval[]>;

export interface OrderModeCutoffs {
  deliveryCutoffTime: string | null;
  pickupCutoffTime: string | null;
}

export interface UpdateBusinessHoursPayload extends OrderModeCutoffs {
  businessHours: BusinessHours;
}

export const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const DAYS_LABEL: Record<string, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};