import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { Restaurant } from "../types/Restaurant.type";
import type { Product, ProductCategory, Additionals } from "../types/Product.type";
import type { Neighborhood } from "../types/Restaurant.type";
import { RestaurantService } from "../api/services/restaurant.service";

interface PublicRestaurantContextValue {
  restaurant: Restaurant | undefined;
  products: Product[];
  categories: ProductCategory[];
  additionals: Additionals[];
  neighborhoods: Neighborhood[];
  isLoading: boolean;
  notFound: boolean;
}

export const PublicRestaurantContext = createContext<PublicRestaurantContextValue | undefined>(undefined);

export function PublicRestaurantProvider({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug: string }>();

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [additionals, setAdditionals] = useState<Additionals[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      setIsLoading(true);
      setNotFound(false);

      const restaurantData = await RestaurantService.getPublicRestaurant(slug);

      if (!restaurantData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setRestaurant(restaurantData);

      const [productsData, categoriesData, additionalsData, neighborhoodsData] = await Promise.all([
        RestaurantService.restaurantProductsPublic(restaurantData.id),
        RestaurantService.restaurantCategoriesPublic(restaurantData.id),
        RestaurantService.restaurantAdditionalsPublic(restaurantData.id),
        RestaurantService.restaurantNeighborhoodsPublic(restaurantData.id),
      ]);

      if (productsData) setProducts(productsData);
      if (categoriesData) setCategories(categoriesData);
      if (additionalsData) setAdditionals(additionalsData);
      if (neighborhoodsData) setNeighborhoods(neighborhoodsData);

      setIsLoading(false);
    })();
  }, [slug]);

  return (
    <PublicRestaurantContext.Provider value={{ restaurant, products, categories, additionals, neighborhoods, isLoading, notFound }}>
      {children}
    </PublicRestaurantContext.Provider>
  );
}

export function usePublicRestaurant() {
  const ctx = useContext(PublicRestaurantContext);
  if (!ctx) throw new Error("usePublicRestaurant deve ser usado dentro de <PublicRestaurantProvider>");
  return ctx;
}