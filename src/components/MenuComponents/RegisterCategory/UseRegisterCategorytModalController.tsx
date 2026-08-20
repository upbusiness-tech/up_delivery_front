import { useState } from "react";
import { ProductService } from "../../../api/services/product.service";
import { useRestaurant } from "../../../context/RestaurantContext";

export default function UseRegisterCategory(){
  const { addCategory } = useRestaurant()
  const [categoryName, setCategoryName] = useState<string>()

  async function createCategory(){
    const body = {
      categoryName
    }

    const categoryCreated = await ProductService.createCategory(body);
    if(!categoryCreated) return
    console.log(categoryCreated)
    addCategory(categoryCreated);
  }

  return {
    categoryName,
    setCategoryName,
    createCategory
  }
}