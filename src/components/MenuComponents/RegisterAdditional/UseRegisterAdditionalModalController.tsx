import { useState } from "react";
import { ProductService } from "../../../api/services/product.service";
import type { AdditionalDTO } from "../../../types/Product.type";
import { useRestaurant } from "../../../context/RestaurantContext";

export default function UseRegisterAdditionalModalController(){
  const {categories, addAdditional} = useRestaurant()
  const CATEGORIES = categories ?? [];

  const [additionalName, setAdditionalName] = useState<string>("")
  const [additionalPrice, setAdditionalPrice] = useState<number>(0)
  const [categoryId, setCategoryId] = useState<string>("")

  async function createAdditional(){
    const body: AdditionalDTO = {
      additionalName,
      additionalPrice,
      categoryId
    }

    const additionalCreated = await ProductService.createAdditional(body);
    if(!additionalCreated) return
    addAdditional(additionalCreated)
    console.log(additionalCreated)
  }

  return {
    additionalName,
    setAdditionalName,
    categoryId,
    setCategoryId,
    additionalPrice,
    setAdditionalPrice,
    createAdditional,
    CATEGORIES
  }
}