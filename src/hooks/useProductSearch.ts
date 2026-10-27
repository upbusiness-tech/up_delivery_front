import { useMemo, useState } from "react";
import type { Product } from "../types/Product.type";
import { normalizeSearchText } from "../utils/search/search";

export function UseProductSearch(products: Product[], includeCategoryAndSizes = false) {
  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => {
    const query = normalizeSearchText(search);

    if (!query) return products;

    return products.filter((product) => {
      const searchableText = [
        product.productName,
        product.productDescription ?? "",
        ...(includeCategoryAndSizes
          ? [
              product.productCategory?.categoryName ?? "",
              ...product.sizes.map((productSize) => productSize.size.name),
            ]
          : []),
      ].join(" ");

      return normalizeSearchText(searchableText).includes(query);
    });
  }, [products, search, includeCategoryAndSizes]);

  return { search, setSearch, filteredProducts };
}
