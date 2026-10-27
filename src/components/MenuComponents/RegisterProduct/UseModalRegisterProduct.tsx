import { useEffect, useRef, useState } from "react";
import type { ProducSizeDTO, ProductDTO } from "../../../types/Product.type";
import {
  useCategories,
  useCreateProduct,
  useSizes,
} from "../../../hooks/queries/useMenuQueries";

interface props {
  onClose?: () => void;
}

export default function UseModalRegisterProduct({ onClose }: props = {}){
  const { data: categories = [] } = useCategories();
  const { data: sizesData = [] } = useSizes();
  const createProductMutation = useCreateProduct();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [manySizes, setManySizes] = useState<boolean>(false)
  const [productName, setProductName] = useState<string>("")
  const [productDescription, setProductDescription] = useState<string>("")
  const [productCategory, setProductCategory] = useState<string>("")
  const [productSizes, setProductSizes] = useState<ProducSizeDTO[]>([])
  const [sizePrices, setSizePrices] = useState<Record<string, number>>({});
  const [commonPrice, setCommonPrice] = useState<number>(0);


  const handleSetSizePrice = (sizeId: string, price: number) => {
    setSizePrices(prev => ({
      ...prev,
      [sizeId]: price
    }));
  };

  const handleSetManySizes = () => {
    setManySizes(prev => !prev)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  async function createProduct(){
    let sizes: ProducSizeDTO[] = [];

    if (manySizes) {
      sizes = sizesData
        .filter(size => sizePrices[size.id] !== undefined)
        .map(size => ({
          size: size.id,
          price: sizePrices[size.id]
        }));
    } else {
      const commonSize = sizesData.find((size) => size.name === "COMUM");
      if (!commonSize) return;

      sizes = [
        {
          size: commonSize.id,
          price: commonPrice
        }
      ];
    }

    const product: ProductDTO = {
      productName,
      productCategory,
      sizes,
    }

    try {
      await createProductMutation.mutateAsync({
        product,
        imageFile: imageFile ?? undefined,
      });
      resetForm();
      onClose?.();
    } catch {
      // O erro fica disponível em `createProductMutation.error`.
    }
  }

  function resetForm() {
    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setSizePrices({});
    setCommonPrice(0);
    setImageFile(null);
    setImagePreview(null);
  }


  return {
    fileInputRef,
    imagePreview,
    imageFile,
    manySizes,
    sizesData,
    categories,
    handleSetManySizes,
    setManySizes,
    handleImageClick,
    handleImageChange,
    productName,
    setProductName,
    productCategory,
    setProductCategory,
    productSizes,
    setProductSizes,
    setProductDescription,
    productDescription,
    createProduct,
    handleSetSizePrice,
    commonPrice,
    setCommonPrice,
    sizePrices,
    isCreating: createProductMutation.isPending,
    createError: createProductMutation.error,
  }
}
