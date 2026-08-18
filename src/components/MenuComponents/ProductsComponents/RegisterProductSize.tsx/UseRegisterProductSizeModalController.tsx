import { useState } from "react";
import type { ProducSizeDTO, Product } from "../../../../types/Product.type";
import { ProductService } from "../../../../api/services/product.service";
import { useRestaurant } from "../../../../context/RestaurantContext";

interface props {
  product: Product
}


export default function UseRegisterProductSizeModalController({product}: props){
  const {sizes} = useRestaurant()
  const SIZES = sizes ?? [];

  const [size, setSize] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [openLoading, setOpenLoading] = useState(false);


  async function handleSetSizePrice(sizeId: string, price: number ){
    setSize(sizeId);
    setPrice(price)
  }

  async function addProductSize(){
    const body: ProducSizeDTO = {price, size}
    console.log(body)

    setOpenLoading(true)
    const productSizeCreated = await ProductService.addProductSize(product.id, body);
    setOpenLoading(false)
    if(!productSizeCreated) return
    console.log(productSizeCreated)
  }

  return {
    addProductSize,
    setPrice,
    setSize,
    openLoading,
    SIZES,
    handleSetSizePrice
  }
}