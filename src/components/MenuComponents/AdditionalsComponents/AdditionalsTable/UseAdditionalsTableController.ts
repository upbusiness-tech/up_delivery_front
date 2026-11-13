import { useMemo, useState } from "react";
import type { Additionals } from "../../../../types/Product.type";
import {
  useAdditionals,
  useCategories,
  useDeleteAdditional,
} from "../../../../hooks/queries/useMenuQueries";
import { normalizeSearchText } from "../../../../utils/search/search";

export default function UseAdditionalsTableController() {
  const additionalsQuery = useAdditionals();
  const categoriesQuery = useCategories();
  const deleteAdditionalMutation = useDeleteAdditional();

  const additionals = additionalsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const [search, setSearch] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
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

  const deletingId = deleteAdditionalMutation.isPending
    ? deleteAdditionalMutation.variables ?? null
    : null;

  async function deleteAdditional(additional: Additionals) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o adicional "${additional.additionalName}"?`,
    );

    if (!confirmed) return;

    setDeleteError(null);

    try {
      await deleteAdditionalMutation.mutateAsync(additional.id);
    } catch {
      setDeleteError(
        "Não foi possível excluir o adicional. Ele pode estar em uso por produtos ou pedidos.",
      );
    }
  }

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
    deleteAdditional,
    deletingId,
    deleteError,
    clearDeleteError: () => setDeleteError(null),
  };
}
