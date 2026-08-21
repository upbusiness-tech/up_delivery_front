import { useState } from "react";
import type { Product } from "../../../../types/Product.type";
import { useRestaurant } from "../../../../context/RestaurantContext";
import { ProductService } from "../../../../api/services/product.service";


export default function UseMenuController(){
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {additionals, categories, products, setProducts, sizes} = useRestaurant()
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

  async function updateActiveProduct(productId: string){
    const response = await ProductService.updateActiveProduct(productId)
    setProducts((prev) =>
    prev.map((p) =>
      p.id === productId
        ? { ...p, productActive: response.productActive }
        : p
    ))
    return response
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
    openProductDetail,
    updateActiveProduct
  }
}