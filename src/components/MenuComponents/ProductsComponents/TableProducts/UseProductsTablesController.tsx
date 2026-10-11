import { useState } from "react";
import type { Product } from "../../../../types/Product.type";
import { QueryCacheName, useRestaurantData } from "../../../../hooks/useRestaurantData";
import { RestaurantService } from "../../../../api/services/restaurant.service";


export default function UseProductsTablesController(){

  const { data: products = [] } = useRestaurantData(RestaurantService.restaurantProducts, QueryCacheName.PRODUCTS);
  const { data: categories = [] } = useRestaurantData(RestaurantService.restaurantCategories, QueryCacheName.CATEGORIES);
  const { data: additionals = [] } = useRestaurantData(RestaurantService.restaurantAdditionals, QueryCacheName.ADDITIONALS);
  const { data: sizes = [] } = useRestaurantData(RestaurantService.restaurantSizes, QueryCacheName.SIZES);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  function openProductDetail(product: Product) {
    setSelectedProduct(product);
  }

  function closeProductDetail() {
    setSelectedProduct(null);
  }
  
  function produtosPorCategoria(catId: string) {
    return products.filter((p) => p.productCategory.id === catId);
  }
  function additionalsByCategory(catId: string) {
    return additionals.filter((a) => a.category?.id === catId);
  }


  
  return {
    categories,
    products,
    additionals,
    selectedProduct,
    sizes,
    produtosPorCategoria,
    additionalsByCategory,
    closeProductDetail,
    openProductDetail,
  }
}