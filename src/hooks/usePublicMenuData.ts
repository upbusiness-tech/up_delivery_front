import { useMemo } from "react";
import { RestaurantService } from "../api/services/restaurant.service";
import { usePublicRestaurant } from "../context/PublicRestaurantContext";
import type { ProductCategory } from "../types/Product.type";
import { QueryCacheName, useRestaurantData } from "./useRestaurantData";

/**
 * Dados básicos do cardápio público.
 *
 * As categorias já vêm dentro de cada produto, então são derivadas localmente.
 * Isso evita uma requisição extra por sessão e mantém uma única fonte de cache
 * para o menu, as telas de tamanho e o carrinho.
 */
export function usePublicMenuData() {
  const { slug } = usePublicRestaurant();

  const { data: products = [], isLoading } = useRestaurantData(
    () => RestaurantService.restaurantProductsPublic(slug),
    QueryCacheName.PRODUCTS_PUBLIC,
    slug,
  );

  const categories = useMemo(() => {
    const byId = new Map<string, ProductCategory>();

    products.forEach((product) => {
      if (product.productCategory) {
        byId.set(product.productCategory.id, product.productCategory);
      }
    });

    return Array.from(byId.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [products]);

  return { slug, products, categories, isLoading };
}
