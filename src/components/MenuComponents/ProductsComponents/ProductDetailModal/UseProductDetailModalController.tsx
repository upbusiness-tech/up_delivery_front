import { useState } from "react";
import type { Product } from "../../../../types/Product.type";
import {
  useDeleteProduct,
  useUpdateProduct,
} from "../../../../hooks/queries/useMenuQueries";

interface props {
  product: Product;
  onClose: () => void;
}

export default function UseProductDetailModalController({ product, onClose }: props){

  const [productName, setProductName] = useState(product.productName);
  const [productDescription, setProductDescription] = useState(product.productDescription ?? "");
  const [openNewOptionProductSize, setOpenNewOptionProductSize] = useState(false);

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleOpenNewOptionProductSize = () => setOpenNewOptionProductSize(true)
  const handleCloseNewOptionProductSize = () => setOpenNewOptionProductSize(false)

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const isDirty =
    productName !== product.productName ||
    productDescription !== (product.productDescription ?? "");

  const isSaving = updateProductMutation.isPending;
  const isDeleting = deleteProductMutation.isPending;

  function handleCancel(){
    onClose();
  }

  async function deleteProduct(){
    const confirmed = window.confirm("Deseja realmente excluir este produto?");

    if (!confirmed) return;

    try {
      await deleteProductMutation.mutateAsync(product.id);
      onClose();
    } catch {
      return;
    }
  }

  async function handleSaveChanges(){
    if (!isDirty) return;

    try {
      await updateProductMutation.mutateAsync({
        productId: product.id,
        body: { productName, productDescription },
      });
    } catch {
      return;
    }
  }

  return {
    formattedDate,
    deleteProduct,
    openNewOptionProductSize,
    handleCloseNewOptionProductSize,
    handleOpenNewOptionProductSize,
    productName,
    setProductName,
    productDescription,
    setProductDescription,
    isDirty,
    handleCancel,
    handleSaveChanges,
    isSaving,
    isDeleting,
    isBusy: isSaving || isDeleting,
    error: updateProductMutation.error ?? deleteProductMutation.error,
  }
}
