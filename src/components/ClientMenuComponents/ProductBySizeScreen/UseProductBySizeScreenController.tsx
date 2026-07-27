import { useState } from "react";
import type { Product, Size } from "../../../types/Product.type";
import type { OrderItemBag } from "../../../types/Order.type";

export function UseProductBySizeScreenController(size: Size, categoryName: string) {

  //Preciso tranformar isso em 1 unico produto com o flavors
  const [selectedFlavors, setSelectedFlavors] = useState<(Product | null)[]>( Array.from({ length: size.limitFlavors }, () => null));
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  
  function toOrderItem(){
    //Para cada produto em selectedFlavors[], percorro os ProductSizes desse produto e para cada 
    //ProductSize verifico se o size.id é igual ao size.id do parametro do controller, se for igual, armazeno
    const getFlavors = selectedFlavors
    .filter((p): p is Product => p !== null)
    .map((p) => p.sizes.find((ps) => ps.size.id === size.id)?.id)
    .filter((id): id is string => id !== undefined);

    //Pego o valor do produto com maior preço
    const maxPrice = selectedFlavors.reduce((acc, product) => {
      if (!product) return acc;
      const price = getPriceBySize(product, size.id) ?? 0;
      return Math.max(acc, price);
    }, 0);

    const productName = `${categoryName} ${size.name}`;

    const orderItem: OrderItemBag = {
      id: crypto.randomUUID(),
      name: productName,
      quantity: 1,
      price: maxPrice,
      flavors: getFlavors,

    }
    console.log("Produto simples adicionado: ", orderItem)
    return orderItem
  }

  const selectFlavor = (product: Product) => {
    setSelectedFlavors((prev) => {
      const next = [...prev];
      next[currentFlavorIndex] =
        next[currentFlavorIndex]?.id === product.id ? null : product;
      return next;
    });
  };

  const goToNextFlavor = () => {
    setCurrentFlavorIndex((prev) => Math.min(prev + 1, size.limitFlavors - 1));
  };

  const goToFlavorTab = (index: number) => {
    setCurrentFlavorIndex(index);
  };

  function getPriceBySize(product: Product, sizeId: string) {
    return product.sizes.find(p => p.size.id === sizeId)?.price;
  }

  const isLastFlavor = currentFlavorIndex === size.limitFlavors - 1;
  const currentSelection = selectedFlavors[currentFlavorIndex];

  return {
    getPriceBySize,
    selectedFlavors,
    currentFlavorIndex,
    currentSelection,
    selectFlavor,
    goToNextFlavor,
    goToFlavorTab,
    isLastFlavor,
    toOrderItem
  };
}