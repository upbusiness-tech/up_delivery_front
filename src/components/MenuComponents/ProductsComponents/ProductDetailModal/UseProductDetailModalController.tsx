import { useState } from "react";
import { ProductService } from "../../../../api/services/product.service";
import type { Product } from "../../../../types/Product.type";

interface props {
  product: Product;
}

export default function UseProductDetailModalController({product}: props){

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
  
  async function deleteProduct(){
    setOpenLoading(true)
    const response = await ProductService.deleteProduct(product.id)
    setOpenLoading(false)
    if(!response) return;
    console.log(response)
  }
  
  return {
    formattedDate,
    deleteProduct,
    openLoading,
    openNewOptionProductSize,
    handleCloseNewOptionProductSize,
    handleOpenNewOptionProductSize
  }
}