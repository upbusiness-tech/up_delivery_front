import { useState } from "react";
import { ProductService } from "../../../../api/services/product.service";
import type { ProducSize, Product } from "../../../../types/Product.type";
// import { ProductService } from "../../../../api/services/product.service";

interface Props {
  sizes: ProducSize[];
  product: Product
}

export default function UseProductsSizesTableController({ sizes, product }: Props) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

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

    setLoadingId(item.id);
    const response = await ProductService.updateProductSize(item.id, { size: item.size.id, price: editedPrice });
    setLoadingId(null);

    if (!response) return;
    console.log(response);
    setEditingId(null);
  }

  async function deleteSize(item: ProducSize) {
    setLoadingId(item.id);
    const response = await ProductService.deleteProductSize(product.id, item.id);
    setLoadingId(null);

    if (!response) return;
    console.log(response);
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