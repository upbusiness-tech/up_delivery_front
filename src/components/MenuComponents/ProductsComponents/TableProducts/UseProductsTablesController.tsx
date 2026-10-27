import { useMemo, useState } from "react";
import type { Product } from "../../../../types/Product.type";
import {
  useAdditionals,
  useCategories,
  useProducts,
  useUpdateProductActive,
} from "../../../../hooks/queries/useMenuQueries";
import { normalizeSearchText } from "../../../../utils/search/search";

export default function UseProductsTablesController(){

  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const additionalsQuery = useAdditionals();
  const updateActiveProductMutation = useUpdateProductActive();

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const additionals = additionalsQuery.data ?? [];

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

  const filteredAdditionals = useMemo(() => {
    if (!normalizedSearch) return additionals;

    return additionals.filter((additional) =>
      normalizeSearchText(
        `${additional.additionalName} ${additional.category?.categoryName ?? ""}`,
      ).includes(normalizedSearch),
    );
  }, [additionals, normalizedSearch]);

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return categories;

    return categories.filter(
      (category) =>
        filteredProducts.some(
          (product) => product.productCategory.id === category.id,
        ) ||
        filteredAdditionals.some(
          (additional) => additional.category?.id === category.id,
        ),
    );
  }, [categories, filteredAdditionals, filteredProducts, normalizedSearch]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  const hasSearchResults =
    filteredProducts.length > 0 || filteredAdditionals.length > 0;

  function openProductDetail(product: Product) {
    setSelectedProductId(product.id);
  }

  function closeProductDetail() {
    setSelectedProductId(null);
  }

  function produtosPorCategoria(catId: string) {
    return filteredProducts.filter((p) => p.productCategory.id === catId);
  }

  function additionalsByCategory(catId: string) {
    return filteredAdditionals.filter((a) => a.category?.id === catId);
  }

  function updateActiveProduct(productId: string) {
    updateActiveProductMutation.mutate(productId);
  }

  function refetch() {
    void productsQuery.refetch();
    void categoriesQuery.refetch();
    void additionalsQuery.refetch();
  }

  const error =
    productsQuery.error ??
    categoriesQuery.error ??
    additionalsQuery.error;

  return {
    categories: filteredCategories,
    products,
    additionals,
    search,
    setSearch,
    isSearching,
    hasSearchResults,
    selectedProduct,
    isLoading:
      productsQuery.isPending ||
      categoriesQuery.isPending ||
      additionalsQuery.isPending,
    error,
    refetch,
    produtosPorCategoria,
    additionalsByCategory,
    closeProductDetail,
    openProductDetail,
    updateActiveProduct,
    togglingProductId: updateActiveProductMutation.isPending
      ? updateActiveProductMutation.variables
      : null,
  }
}
