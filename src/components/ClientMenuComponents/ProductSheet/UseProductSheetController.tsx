import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import type { Additionals, Product, ProductCategory } from "../../../types/Product.type";
import type { OrderItemBag } from "../../../types/Order.type";

export default function UseProductSheetController(category: ProductCategory, additionals: Additionals[]){
  // console.log(category)
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [qty, setQty] = useState(1);
  const [observation, setObservation] = useState("");
  const [checkedAdditionals, setCheckedAdditionals] = useState<Additionals[]>([]);
  const ADDITIONALS = additionals ?? []

  function additionalsByCategory() {
    return ADDITIONALS.filter((a) => a.category.id === category.id);
  }

  const toggleAdditional = (additional: Additionals) => {
    setCheckedAdditionals((prev) =>
      prev.some((a) => a.id === additional.id)
        ? prev.filter((a) => a.id !== additional.id)
        : [...prev, additional]
    );
  };

  //Essa função so vai ser usada em produtos com 1 unico tamanho 
  function toOrderItem(product: Product){
    const orderItem: OrderItemBag = {
      id: product.id,
      name: product.productName,
      quantity: qty,
      price: product.sizes[0].price,
      flavors: product.sizes.map((e) => e.id),
      observation: observation,
      additionals: checkedAdditionals
    }
    // console.log("Produto simples adicionado: ", orderItem)
    return orderItem
  }

  return {
    isDesktop,
    qty,
    setQty,
    toOrderItem,
    observation,
    setObservation,
    setCheckedAdditionals,
    additionalsByCategory,
    toggleAdditional,
    checkedAdditionals
  }
}