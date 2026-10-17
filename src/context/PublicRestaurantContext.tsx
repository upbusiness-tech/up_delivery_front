import { createContext, useContext } from "react";
import { Outlet, useParams } from "react-router-dom";

interface PublicRestaurantContextValue {
  slug: string | undefined;
}

export const PublicRestaurantContext = createContext<PublicRestaurantContextValue | undefined>(undefined);

export function PublicRestaurantProvider() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <PublicRestaurantContext.Provider value={{ slug }}>
      <Outlet />
    </PublicRestaurantContext.Provider>
  );
}

export function usePublicRestaurant() {
  const ctx = useContext(PublicRestaurantContext);
  if (!ctx) throw new Error("usePublicRestaurant deve ser usado dentro de <PublicRestaurantProvider>");
  return ctx;
}