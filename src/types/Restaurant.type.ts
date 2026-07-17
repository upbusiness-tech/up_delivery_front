export interface Restaurant {
  id: string;
  restaurantName: string;
  restaurantEmail: string;
  restaurantPhone: string;
  businessHours: Record<string, { openTime: string; closeTime: string }[]>;
  image: string;
  description: string;
  isOpen: boolean;
  active: boolean;
}

export interface BusinessHourInterval {
  openTime: string | null;
  closeTime: string | null;
}

export type BusinessHours = Record<string, BusinessHourInterval[]>;

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