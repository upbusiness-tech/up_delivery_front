import { useState } from "react";
import { ProductService } from "../../../api/services/product.service";

export default function UseRegisterCategory(){
  const [categoryName, setCategoryName] = useState<string>()

  async function createCategory(){
    const body = {
      categoryName
    }

    const categoryCreated = await ProductService.createCategory(body);
    if(!categoryCreated) return
    console.log(categoryCreated)
  }

  return {
    categoryName,
    setCategoryName,
    createCategory
  }
}