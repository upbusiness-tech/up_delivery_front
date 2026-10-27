import { useMemo } from "react";
import { RestaurantService } from "../../api/services/restaurant.service";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../../hooks/useRestaurantData";

interface UseSizeOrderDataParams {
  categoryId?: string;
  sizeId?: string;
}

/**
 * Dados compartilhados pelas telas de pedido por tamanho.
 *
 * Produtos e categorias usam as mesmas query keys do cardápio, então o React
 * Query reaproveita o cache quando o cliente sai do menu para escolher sabores.
 */
export function useSizeOrderData({ categoryId, sizeId }: UseSizeOrderDataParams) {
  const { slug } = usePublicRestaurant();

  const { data: products = [], isLoading: loadingProducts } = useRestaurantData(
    () => RestaurantService.restaurantProductsPublic(slug),
    QueryCacheName.PRODUCTS_PUBLIC,
    slug,
  );

  const { data: categories = [], isLoading: loadingCategories } = useRestaurantData(
    () => RestaurantService.restaurantCategoriesPublic(slug),
    QueryCacheName.CATEGORIES_PUBLIC,
    slug,
  );

  const { data: additionals = [], isLoading: loadingAdditionals } = useRestaurantData(
    () => RestaurantService.restaurantAdditionalsPublic(slug),
    QueryCacheName.ADDITIONALS_PUBLIC,
    slug,
  );

  const category = useMemo(
    () =>
      categories.find((item) => item.id === categoryId) ??
      products.find((product) => product.productCategory.id === categoryId)?.productCategory,
    [categories, products, categoryId],
  );

  const productsBySize = useMemo(
    () =>
      products.filter(
        (product) =>
          product.productActive &&
          product.productCategory.id === categoryId &&
          product.sizes.some((productSize) => productSize.size.id === sizeId),
      ),
    [products, categoryId, sizeId],
  );

  const size = useMemo(() => {
    for (const product of productsBySize) {
      const productSize = product.sizes.find((item) => item.size.id === sizeId);
      if (productSize) return productSize.size;
    }
    return undefined;
  }, [productsBySize, sizeId]);

  return {
    slug,
    category,
    size,
    productsBySize,
    additionals,
    isLoading: loadingProducts || loadingCategories || loadingAdditionals,
  };
}
