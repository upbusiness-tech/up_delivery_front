import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import type { Product } from "../../../types/Product.type";
import type { OrderItemBag } from "../../../types/Order.type";

export default function UseProductSheetController(){
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  //Essa função so vai ser usada em produtos com 1 unico tamanho 
  function toOrderItem(product: Product){
    const orderItem: OrderItemBag = {
      id: product.id,
      name: product.productName,
      quantity: qty,
      price: product.sizes[0].price * qty,
      flavors: product.sizes.map((e) => e.id),

    }
    console.log("Produto simples adicionado: ", orderItem)
    return orderItem
  }

  return {
    isDesktop,
    qty,
    notes,
    setNotes,
    setQty,
    toOrderItem
  }
}