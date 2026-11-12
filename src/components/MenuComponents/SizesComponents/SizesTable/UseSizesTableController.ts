import { useMemo, useState } from "react";
import type { Size } from "../../../../types/Product.type";
import { useDeleteSize, useSizes } from "../../../../hooks/queries/useMenuQueries";

export default function UseSizesTableController() {
  const sizesQuery = useSizes();
  const deleteSizeMutation = useDeleteSize();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sizes = useMemo(
    () =>
      [...(sizesQuery.data ?? [])].sort((first, second) =>
        first.name.localeCompare(second.name, "pt-BR"),
      ),
    [sizesQuery.data],
  );

  const deletingId = deleteSizeMutation.isPending
    ? deleteSizeMutation.variables ?? null
    : null;

  async function deleteSize(size: Size) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o tamanho "${size.name}"?`,
    );

    if (!confirmed) return;

    setDeleteError(null);

    try {
      await deleteSizeMutation.mutateAsync(size.id);
    } catch {
      setDeleteError(
        "Não foi possível excluir o tamanho. Ele pode estar em uso por algum produto.",
      );
    }
  }

  return {
    sizes,
    isLoading: sizesQuery.isPending,
    error: sizesQuery.error,
    refetch: () => void sizesQuery.refetch(),
    deleteSize,
    deletingId,
    deleteError,
    clearDeleteError: () => setDeleteError(null),
  };
}
