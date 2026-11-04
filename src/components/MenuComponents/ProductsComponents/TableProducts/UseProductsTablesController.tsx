import { useMemo, useState } from "react";
import type { Product } from "../../../../types/Product.type";
import {
  useCategories,
  useProducts,
  useUpdateProductActive,
} from "../../../../hooks/queries/useMenuQueries";
import { normalizeSearchText } from "../../../../utils/search/search";

export default function UseProductsTablesController(){

  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const updateActiveProductMutation = useUpdateProductActive();

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const normalizedSearch = normalizeSearchText(search);
  const isSearching = normalizedSearch.length > 0;

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return products;

    return products.filter((product) =>
      normalizeSearchText(
        `${product.productName} ${product.productDescription ?? ""} ${product.productCategory.categoryName}`,
      ).includes(normalizedSearch),
    );
  }, [normalizedSearch, products]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      filteredProducts.some(
        (product) => product.productCategory.id === category.id,
      ),
    );
  }, [categories, filteredProducts]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  const hasSearchResults = filteredProducts.length > 0;

  function openProductDetail(product: Product) {
    setSelectedProductId(product.id);
  }

  function closeProductDetail() {
    setSelectedProductId(null);
  }

  function produtosPorCategoria(catId: string) {
    return filteredProducts.filter((p) => p.productCategory.id === catId);
  }

  function updateActiveProduct(productId: string) {
    updateActiveProductMutation.mutate(productId);
  }

  function refetch() {
    void productsQuery.refetch();
    void categoriesQuery.refetch();
  }

  const error = productsQuery.error ?? categoriesQuery.error;

  return {
    categories: filteredCategories,
    products,
    search,
    setSearch,
    isSearching,
    hasSearchResults,
    selectedProduct,
    isLoading: productsQuery.isPending || categoriesQuery.isPending,
    error,
    refetch,
    produtosPorCategoria,
    closeProductDetail,
    openProductDetail,
    updateActiveProduct,
    togglingProductId: updateActiveProductMutation.isPending
      ? updateActiveProductMutation.variables
      : null,
  }
}
