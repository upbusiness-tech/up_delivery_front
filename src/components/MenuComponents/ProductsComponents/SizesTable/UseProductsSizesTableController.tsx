import { useState } from "react";
import type { ProducSize, Product } from "../../../../types/Product.type";
import {
  useDeleteProductSize,
  useUpdateProductSize,
} from "../../../../hooks/queries/useMenuQueries";

interface Props {
  sizes: ProducSize[];
  product: Product
}

export default function UseProductsSizesTableController({ sizes, product }: Props) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const updateSizeMutation = useUpdateProductSize();
  const deleteSizeMutation = useDeleteProductSize();

  const loadingId = updateSizeMutation.isPending
    ? updateSizeMutation.variables?.productSizeId ?? null
    : deleteSizeMutation.isPending
      ? deleteSizeMutation.variables?.productSizeId ?? null
      : null;

  const isEditing = (id: string | number) => editingId === id;

  function startEdit(item: ProducSize) {
    setEditingId(item.id);
    setEditedPrice(item.price);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditedPrice(0);
  }

  function changeEditedPrice(value: number) {
    setEditedPrice(value);
  }

  // Só permite salvar se o preço realmente mudou em relação ao valor original
  function isPriceDirty(item: ProducSize) {
    return editingId === item.id && editedPrice !== item.price;
  }

  async function saveEdit(item: ProducSize) {
    if (!isPriceDirty(item)) return;

    try {
      await updateSizeMutation.mutateAsync({
        productSizeId: item.id,
        body: {
          size: item.size.id,
          price: editedPrice,
        },
      });
      setEditingId(null);
      setEditedPrice(0);
    } catch {
      return;
    }
  }

  async function deleteSize(item: ProducSize) {
    try {
      await deleteSizeMutation.mutateAsync({
        productId: product.id,
        productSizeId: item.id,
      });
    } catch {
      return;
    }
  }

  return {
    sizes,
    editingId,
    editedPrice,
    loadingId,
    isEditing,
    isPriceDirty,
    startEdit,
    cancelEdit,
    changeEditedPrice,
    saveEdit,
    deleteSize,
  };
}
