import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import type { Additionals, Product } from "../../../types/Product.type";
import type { OrderItemBag } from "../../../types/Order.type";
import { RestaurantService } from "../../../api/services/restaurant.service";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";

export default function UseProductSheetController(
  item: Product | undefined,
  initialItem?: OrderItemBag,
){
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [qty, setQty] = useState(initialItem?.quantity ?? item?.minQuantity ?? 1);
  const [observation, setObservation] = useState(initialItem?.observation ?? "");
  const [checkedAdditionals, setCheckedAdditionals] = useState<Additionals[]>(
    initialItem?.additionals ?? [],
  );

  const { slug } = usePublicRestaurant()
  const { data: additionals = []} = useRestaurantData(() => RestaurantService.restaurantAdditionalsPublic(slug!), QueryCacheName.ADDITIONALS_PUBLIC, slug)
  
  const ADDITIONALS = additionals ?? []

  useEffect(() => {
    setQty(initialItem?.quantity ?? item?.minQuantity ?? 1);
    setObservation(initialItem?.observation ?? "");
    setCheckedAdditionals(initialItem?.additionals ?? []);
  }, [item?.id, initialItem?.id]);

  function additionalsByCategory() {
    return ADDITIONALS.filter((a) => a.category.id === item?.productCategory.id);
  }

  const additionalsByType = (type: Additionals['additionalType']) => additionalsByCategory().filter((a) => a.additionalType === type);

  const toggleAdditional = (additional: Additionals) => {
    setCheckedAdditionals((prev) => {
      if (prev.some((a) => a.id === additional.id)) return prev.filter((a) => a.id !== additional.id);
      return additional.additionalType === 'single' ? [...prev.filter((a) => a.additionalType !== 'single'), additional] : [...prev, additional];
    });
  };

  //Essa função so vai ser usada em produtos com 1 unico tamanho 
  function toOrderItem(product: Product){
    const orderItem: OrderItemBag = {
      id: initialItem?.id ?? product.id,
      name: product.productName,
      quantity: qty,
      price: product.sizes[0].price,
      flavors: product.sizes.map((e) => e.id),
      observation: observation,
      additionals: checkedAdditionals,
      image: product.image,
      minQuantity: product.minQuantity ?? 1,
      categoryId: product.productCategory.id,
      sizeId: product.sizes[0].size.id,
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
    checkedAdditionals,
    additionalsByType
  }
}