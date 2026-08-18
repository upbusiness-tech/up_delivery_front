import { useState } from "react";
import type { Product } from "../../../../types/Product.type";
import { useRestaurant } from "../../../../context/RestaurantContext";


export default function UseMenuController(){
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {additionals, categories, products, sizes} = useRestaurant()
  const CATEGORIAS  = categories ?? []
  const PRODUCTS = products ?? []
  const ADDITIONALS = additionals ?? []
  const SIZES = sizes ?? []
  
  function openProductDetail(product: Product) {
    setSelectedProduct(product);
  }

  function closeProductDetail() {
    setSelectedProduct(null);
  }
  
  function produtosPorCategoria(catId: string) {
    return PRODUCTS.filter((p) => p.productCategory.id === catId);
  }
  function additionalsByCategory(catId: string) {
    return ADDITIONALS.filter((a) => a.category.id === catId);
  }


  
  return {
    CATEGORIAS,
    PRODUCTS,
    ADDITIONALS,
    selectedProduct,
    SIZES,
    produtosPorCategoria,
    additionalsByCategory,
    closeProductDetail,
    openProductDetail
  }
}