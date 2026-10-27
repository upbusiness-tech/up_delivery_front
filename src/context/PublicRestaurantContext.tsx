import { createContext, useContext, type ReactNode } from "react";
import type { Restaurant } from "../types/Restaurant.type";

interface PublicRestaurantContextValue {
  /** Slug da URL (`/r/:slug`). Sempre definido dentro do layout público. */
  slug: string;
  /** Restaurante já carregado pelo `PublicRestaurantLayout`. */
  restaurant: Restaurant;
}

const PublicRestaurantContext = createContext<PublicRestaurantContextValue | undefined>(undefined);

interface PublicRestaurantProviderProps {
  slug: string;
  restaurant: Restaurant;
  children: ReactNode;
}

export function PublicRestaurantProvider({ slug, restaurant, children }: PublicRestaurantProviderProps) {
  return (
    <PublicRestaurantContext.Provider value={{ slug, restaurant }}>
      {children}
    </PublicRestaurantContext.Provider>
  );
}

export function usePublicRestaurant() {
  const context = useContext(PublicRestaurantContext);
  if (!context) {
    throw new Error("usePublicRestaurant deve ser usado dentro de <PublicRestaurantProvider>");
  }
  return context;
}
