import { useMemo } from "react";
import { RestaurantService } from "../../api/services/restaurant.service";
import { usePublicMenuData } from "../../hooks/usePublicMenuData";
import { QueryCacheName, useRestaurantData } from "../../hooks/useRestaurantData";

interface UseSizeOrderDataParams {
  categoryId?: string;
  sizeId?: string;
}

/**
 * Dados compartilhados pelas telas de pedido por tamanho.
 *
 * Produtos e categorias vêm do mesmo cache do cardápio. A categoria é
 * derivada dos próprios produtos, sem uma requisição separada.
 */
export function useSizeOrderData({ categoryId, sizeId }: UseSizeOrderDataParams) {
  const {
    slug,
    products,
    categories,
    isLoading: loadingMenu,
  } = usePublicMenuData();

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
    isLoading: loadingMenu || loadingAdditionals,
  };
}
