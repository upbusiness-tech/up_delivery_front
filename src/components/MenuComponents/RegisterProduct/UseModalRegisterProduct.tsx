import { useEffect, useRef, useState } from "react";
import { useRestaurant } from "../../../context/RestaurantContext";
import type {ProducSizeDTO, ProductDTO } from "../../../types/Product.type";
import { ProductService } from "../../../api/services/product.service";

export default function UseModalRegisterProduct(){
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

  const {sizes, categories} = useRestaurant()
  const SIZES = sizes ?? [];
  const CATEGORIES = categories ?? [];
  
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
      sizes = SIZES
        .filter(size => sizePrices[size.id] !== undefined)
        .map(size => ({
          size: size.id,
          price: sizePrices[size.id]
        }));
    } else {
      sizes = [
        {
          size: "b316a702-927c-4864-8dad-e224a4019629",
          price: commonPrice
        }
      ];
    }

    const product: ProductDTO = {
      productName,
      productCategory,
      sizes
    }

    const productCreated = await ProductService.createProduct(product)
    console.log(productCreated)
  }


  return {
    fileInputRef,
    imagePreview,
    imageFile,
    manySizes,
    SIZES,
    CATEGORIES,
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
    sizePrices

  }
}