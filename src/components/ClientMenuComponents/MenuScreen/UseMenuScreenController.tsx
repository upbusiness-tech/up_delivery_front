import { useRestaurant } from "../../../context/RestaurantContext";
import type { Size } from "../../../types/Product.type";

export function UseMenuScreenController() {
  const { restaurant, categories, products } = useRestaurant();
  const PRODUCTS = products ?? [];
  const CATEGORIES = categories ?? [];

  function produtosPorCategoria(catId: string) {
  return PRODUCTS.filter((p) => p.productCategory.id === catId);
  }

  function produtosComuns(catId: string) {
    return produtosPorCategoria(catId).filter(
      product =>
        product.sizes.length === 1 &&
        product.sizes[0].size.name === "COMUM"
    );
  }

  function produtosComTamanhos(catId: string) {
    return produtosPorCategoria(catId).filter(
      product =>
        !(
          product.sizes.length === 1 &&
          product.sizes[0].size.name === "COMUM"
        )
    );
  }

  function tamanhosDaCategoria(catId: string) {
    const products = produtosComTamanhos(catId);

    const sizesMap = new Map<string, Size>();

    products.forEach(product => {
      product.sizes.forEach(productSize => {
        sizesMap.set(productSize.size.id, productSize.size);
      });
    });

    return Array.from(sizesMap.values());
  }

  return {
    restaurant,
    CATEGORIES,
    products,
    produtosPorCategoria,
    tamanhosDaCategoria,
    produtosComuns,
  };
}