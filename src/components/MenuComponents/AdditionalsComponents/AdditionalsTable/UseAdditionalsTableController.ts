import { useMemo, useState } from "react";
import type { Additionals } from "../../../../types/Product.type";
import {
  useAdditionals,
  useCategories,
} from "../../../../hooks/queries/useMenuQueries";
import { normalizeSearchText } from "../../../../utils/search/search";

export default function UseAdditionalsTableController() {
  const additionalsQuery = useAdditionals();
  const categoriesQuery = useCategories();

  const additionals = additionalsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const [search, setSearch] = useState("");
  const normalizedSearch = normalizeSearchText(search);
  const isSearching = normalizedSearch.length > 0;

  const rows = useMemo<Additionals[]>(() => {
    return [...additionals].sort((a, b) => {
      const categoryComparison = (a.category?.categoryName ?? "").localeCompare(
        b.category?.categoryName ?? "",
        "pt-BR",
      );
      if (categoryComparison !== 0) return categoryComparison;
      return a.additionalName.localeCompare(b.additionalName, "pt-BR");
    });
  }, [additionals]);

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) return rows;

    return rows.filter((additional) =>
      normalizeSearchText(
        `${additional.additionalName} ${additional.category?.categoryName ?? ""}`,
      ).includes(normalizedSearch),
    );
  }, [normalizedSearch, rows]);

  const error = additionalsQuery.error ?? categoriesQuery.error;

  function refetch() {
    void additionalsQuery.refetch();
    void categoriesQuery.refetch();
  }

  return {
    additionals: filteredRows,
    totalAdditionals: additionals.length,
    hasCategories: categories.length > 0,
    search,
    setSearch,
    isSearching,
    hasSearchResults: filteredRows.length > 0,
    isLoading: additionalsQuery.isPending || categoriesQuery.isPending,
    error,
    refetch,
  };
}
