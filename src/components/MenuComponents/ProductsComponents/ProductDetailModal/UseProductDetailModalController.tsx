import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Product } from "../../../../types/Product.type";
import {
  useAdditionals,
  useDeleteProduct,
  useUpdateProduct,
} from "../../../../hooks/queries/useMenuQueries";
import { getProductImageError } from "../../../../lib/firebaseStorage";

interface props {
  product: Product;
  onClose: () => void;
}

function sameIds(first: string[], second: string[]) {
  if (first.length !== second.length) return false;
  const sortedFirst = [...first].sort();
  const sortedSecond = [...second].sort();
  return sortedFirst.every((id, index) => id === sortedSecond[index]);
}

export default function UseProductDetailModalController({ product, onClose }: props){
  const [productName, setProductName] = useState(product.productName);
  const [productDescription, setProductDescription] = useState(product.productDescription ?? "");
  const [openNewOptionProductSize, setOpenNewOptionProductSize] = useState(false);
  const [useCategoryAdditionals, setUseCategoryAdditionals] = useState(
    product.useCategoryAdditionals ?? true,
  );
  const [selectedAdditionalIds, setSelectedAdditionalIds] = useState<string[]>(
    () => (product.additionals ?? []).map((additional) => additional.id),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const additionalsQuery = useAdditionals();

  const additionals = additionalsQuery.data ?? [];
  const categoryAdditionals = additionals.filter(
    (additional) => additional.category?.id === product.productCategory.id,
  );
  const initialAdditionalIds = (product.additionals ?? []).map(
    (additional) => additional.id,
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleOpenNewOptionProductSize = () => setOpenNewOptionProductSize(true)
  const handleCloseNewOptionProductSize = () => setOpenNewOptionProductSize(false)

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const additionalsDirty =
    useCategoryAdditionals !== (product.useCategoryAdditionals ?? true) ||
    (!useCategoryAdditionals &&
      !sameIds(selectedAdditionalIds, initialAdditionalIds));

  const isDirty =
    productName.trim() !== product.productName ||
    productDescription !== (product.productDescription ?? "") ||
    imageFile !== null ||
    additionalsDirty;

  const isSaving = updateProductMutation.isPending;
  const isDeleting = deleteProductMutation.isPending;

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = getProductImageError(file);

    if (error) {
      setImageError(error);
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleUseCategoryAdditionalsChange(checked: boolean) {
    setUseCategoryAdditionals(checked);

    if (!checked && selectedAdditionalIds.length === 0) {
      setSelectedAdditionalIds(
        categoryAdditionals.map((additional) => additional.id),
      );
    }
  }

  function toggleAdditional(additionalId: string) {
    setSelectedAdditionalIds((previous) =>
      previous.includes(additionalId)
        ? previous.filter((id) => id !== additionalId)
        : [...previous, additionalId],
    );
  }

  function handleCancel(){
    onClose();
  }

  async function deleteProduct(){
    const confirmed = window.confirm("Deseja realmente excluir este produto?");

    if (!confirmed) return;

    try {
      await deleteProductMutation.mutateAsync({
        productId: product.id,
        image: product.image,
      });
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
        body: {
          productName: productName.trim(),
          productDescription,
          useCategoryAdditionals,
          additionalIds: useCategoryAdditionals
            ? undefined
            : selectedAdditionalIds,
        },
        imageFile: imageFile ?? undefined,
        previousImage: product.image,
      });

      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
    additionals,
    additionalsLoading: additionalsQuery.isPending,
    useCategoryAdditionals,
    handleUseCategoryAdditionalsChange,
    selectedAdditionalIds,
    toggleAdditional,
    additionalsError: additionalsQuery.error,
    imageFile,
    imagePreview,
    imageError,
    fileInputRef,
    handleImageClick,
    handleImageChange,
  }
}
