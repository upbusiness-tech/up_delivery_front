import { useEffect, useRef, useState } from "react";
import type { ProducSizeDTO, ProductDTO } from "../../../types/Product.type";
import {
  useCategories,
  useCreateProduct,
  useSizes,
} from "../../../hooks/queries/useMenuQueries";

const COMUM_SIZE_ID = "0146a23d-5554-47b4-aa76-e16c0244597f";

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
  const [sizePrices, setSizePrices] = useState<Record<string, number | undefined>>({});
  const [commonPrice, setCommonPrice] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);


  const handleSetSizePrice = (sizeId: string, price: number | undefined) => {
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

  function resetForm() {
    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setProductSizes([]);
    setSizePrices({});
    setCommonPrice(0);
    setManySizes(false);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
  }

  function closeAndReset() {
    resetForm();
    onClose?.();
  }

  async function createProduct(){
    const name = productName.trim();
    const description = productDescription.trim();

    if (!name) {
      setFormError("Informe o nome do produto.");
      return;
    }
    if (!productCategory) {
      setFormError("Selecione a categoria do produto.");
      return;
    }
    if (manySizes && sizesData.length === 0) {
      setFormError("Nenhum tamanho cadastrado. Cadastre um tamanho antes de criar o produto.");
      return;
    }
    if (createProductMutation.isPending) return;

    let sizes: ProducSizeDTO[] = [];

    if (manySizes) {
      const selectedSizes = sizesData.filter(
        (size) => size.name !== "COMUM" && sizePrices[size.id] !== undefined,
      );

      if (selectedSizes.length === 0) {
        setFormError("Informe o preço de pelo menos um tamanho.");
        return;
      }

      const hasInvalidPrice = selectedSizes.some((size) => {
        const price = sizePrices[size.id];
        return price === undefined || !Number.isFinite(price) || price < 0;
      });

      if (hasInvalidPrice) {
        setFormError("Informe preços válidos para os tamanhos selecionados.");
        return;
      }

      sizes = selectedSizes.map(size => ({
        size: size.id,
        price: sizePrices[size.id] as number,
      }));
    } else {
      if (!Number.isFinite(commonPrice) || commonPrice < 0) {
        setFormError("Informe um preço válido.");
        return;
      }

      sizes = [
        {
          size: COMUM_SIZE_ID,
          price: commonPrice,
        },
      ];
    }

    setFormError(null);

    try {
      const product: ProductDTO = {
        productName: name,
        productDescription: description || undefined,
        productCategory,
        sizes,
      };

      await createProductMutation.mutateAsync({
        product,
        imageFile: imageFile ?? undefined,
      });
      resetForm();
      onClose?.();
    } catch {
      setFormError("Não foi possível salvar o produto. Confira os dados e tente novamente.");
    }
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
    formError,
    closeAndReset,
  }
}
