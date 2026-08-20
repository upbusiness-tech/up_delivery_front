import { useMemo, useState } from "react";
import { ProductService } from "../../../../api/services/product.service";
import type { Product } from "../../../../types/Product.type";
import { useRestaurant } from "../../../../context/RestaurantContext";

interface props {
  product: Product;
  onClose: () => void;
}

interface UpdateProductPayload {
  productName?: string;
  productDescription?: string;
}

export default function UseProductDetailModalController({product, onClose}: props){

  const { onUpdateProduct, removeProduct } = useRestaurant()

  const [productName, setProductName] = useState(product.productName);
  const [productDescription, setProductDescription] = useState(product.productDescription);
  const [openLoading, setOpenLoading] = useState(false);
  const [openNewOptionProductSize, setOpenNewOptionProductSize] = useState(false);
  const handleOpenNewOptionProductSize = () => setOpenNewOptionProductSize(true)
  const handleCloseNewOptionProductSize = () => setOpenNewOptionProductSize(false)

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";


  const isDirty = useMemo(() => {
    return (
      productName !== product.productName ||
      productDescription !== product.productDescription
    );
  }, [productName, productDescription, product.productName, product.productDescription]);

  function handleCancel(){
    // Reseta os campos para os valores originais ao cancelar
    setProductName(product.productName);
    setProductDescription(product.productDescription);
    onClose();
  }

  async function deleteProduct(){
    setOpenLoading(true);
    try {
      await ProductService.deleteProduct(product.id);
      removeProduct(product.id); 
    } catch (e) {
      console.log(e);
    } finally {
      setOpenLoading(false);
    }
  }

  async function updateProduct(payload: UpdateProductPayload){
    setOpenLoading(true);
    try {
      const response = await ProductService.updateProduct(product.id, payload);
      onUpdateProduct(response); 
    } catch (e) {
      console.log(e);
    } finally {
      setOpenLoading(false);
    }
  }
  function handleSaveChanges(){
    if (!isDirty) return;
    updateProduct({ productName, productDescription });
  }

  
  return {
    formattedDate,
    deleteProduct,
    openLoading,
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
  }
}