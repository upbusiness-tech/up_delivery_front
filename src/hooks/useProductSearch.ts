import { useMemo, useState } from "react";
import type { Product } from "../types/Product.type";

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function UseProductSearch(products: Product[]) {
  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => { const q = normalize(search); return q ? products.filter((p) => normalize(`${p.productName} ${p.productDescription ?? ""}`).includes(q)) : products; }, [products, search]);
  return { search, setSearch, filteredProducts };
}