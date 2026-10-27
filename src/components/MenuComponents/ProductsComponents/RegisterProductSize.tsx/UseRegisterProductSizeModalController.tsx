import { useMemo, useState } from "react";
import type { Product } from "../../../../types/Product.type";
import {
  useAddProductSizes,
  useSizes,
} from "../../../../hooks/queries/useMenuQueries";

interface props {
  product: Product;
  onClose: () => void;
}

export default function UseRegisterProductSizeModalController({ product, onClose }: props){
  const sizesQuery = useSizes();
  const addProductSizesMutation = useAddProductSizes();
  const sizes = sizesQuery.data ?? [];

  const [sizePrices, setSizePrices] = useState<Record<string, number>>({});

  const availableSizes = useMemo(() => {
    const existingSizeIds = new Set(product.sizes.map((productSize) => productSize.size.id));
    const hasRegisteredSizes = product.sizes.length > 0;

    return sizes.filter(
      (size) =>
        !existingSizeIds.has(size.id) &&
        (!hasRegisteredSizes || size.name !== "COMUM"),
    );
  }, [product.sizes, sizes]);

  const selectedSizes = useMemo(
    () =>
      availableSizes.filter((size) => {
        const price = sizePrices[size.id];
        return typeof price === "number" && Number.isFinite(price) && price > 0;
      }),
    [availableSizes, sizePrices],
  );

  function handleSetSizePrice(sizeId: string, price: number){
    setSizePrices((current) => ({
      ...current,
      [sizeId]: Number.isNaN(price) ? 0 : price,
    }));
  }

  function handleClose(){
    setSizePrices({});
    onClose();
  }

  async function addProductSize(){
    if (selectedSizes.length === 0) return;

    try {
      await addProductSizesMutation.mutateAsync({
        productId: product.id,
        sizes: selectedSizes.map((size) => ({
          size: size.id,
          price: sizePrices[size.id],
        })),
      });
      setSizePrices({});
      onClose();
    } catch {
      return;
    }
  }

  return {
    availableSizes,
    sizePrices,
    selectedCount: selectedSizes.length,
    handleSetSizePrice,
    handleClose,
    addProductSize,
    isLoadingSizes: sizesQuery.isPending,
    isSaving: addProductSizesMutation.isPending,
    error: addProductSizesMutation.error,
    canSubmit: selectedSizes.length > 0,
  }
}
