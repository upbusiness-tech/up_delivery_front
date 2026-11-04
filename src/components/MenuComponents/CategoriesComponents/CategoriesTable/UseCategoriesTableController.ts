import { useMemo, useState } from "react";
import type { ProductCategory } from "../../../../types/Product.type";
import {
  useAdditionals,
  useCategories,
  useProducts,
} from "../../../../hooks/queries/useMenuQueries";
import { normalizeSearchText } from "../../../../utils/search/search";

export type CategoryTableRow = ProductCategory & {
  productCount: number;
  additionalCount: number;
};

export default function UseCategoriesTableController() {
  const categoriesQuery = useCategories();
  const productsQuery = useProducts();
  const additionalsQuery = useAdditionals();

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const additionals = additionalsQuery.data ?? [];

  const [search, setSearch] = useState("");
  const normalizedSearch = normalizeSearchText(search);
  const isSearching = normalizedSearch.length > 0;

  const rows = useMemo<CategoryTableRow[]>(() => {
    return categories
      .map((category) => ({
        ...category,
        productCount: products.filter(
          (product) => product.productCategory.id === category.id,
        ).length,
        additionalCount: additionals.filter(
          (additional) => additional.category?.id === category.id,
        ).length,
      }))
      .sort(
        (a, b) =>
          Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0) ||
          a.categoryName.localeCompare(b.categoryName, "pt-BR"),
      );
  }, [additionals, categories, products]);

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return rows;

    return rows.filter((category) =>
      normalizeSearchText(category.categoryName).includes(normalizedSearch),
    );
  }, [normalizedSearch, rows]);

  const error =
    categoriesQuery.error ?? productsQuery.error ?? additionalsQuery.error;

  function refetch() {
    void categoriesQuery.refetch();
    void productsQuery.refetch();
    void additionalsQuery.refetch();
  }

  return {
    categories: filteredRows,
    totalCategories: categories.length,
    search,
    setSearch,
    isSearching,
    hasSearchResults: filteredRows.length > 0,
    isLoading:
      categoriesQuery.isPending ||
      productsQuery.isPending ||
      additionalsQuery.isPending,
    error,
    refetch,
  };
}
