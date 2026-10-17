import { useEffect, useRef, useState } from "react";
import type { Product, Size } from "../../../types/Product.type";
import { RestaurantService } from "../../../api/services/restaurant.service";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";

export function UseMenuScreenController() {
  
  const { slug } = usePublicRestaurant()
  const {data: productsData = [] } = useRestaurantData(() => RestaurantService.restaurantProductsPublic(slug!), QueryCacheName.PRODUCTS_PUBLIC)
  const {data: categoriesData = [] } = useRestaurantData(() => RestaurantService.restaurantCategoriesPublic(slug!), QueryCacheName.CATEGORIES_PUBLIC)

  const [productSelected, setProductSelected] = useState<Product>()
  
  const PRODUCTS = productsData;
  const CATEGORIES = categoriesData;
  
  const visibleCategories = CATEGORIES.filter((cat) => produtosComuns(cat.id).length + tamanhosDaCategoria(cat.id).length > 0).sort((a, b) => a.sortOrder - b.sortOrder);  
  const [activeTab, setActiveTab] = useState(visibleCategories[0]?.id ?? false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isClickScrolling = useRef(false);


  function produtosPorCategoria(catId: string) {
    return PRODUCTS.filter((p) => p.productCategory.id === catId);
  }

  function produtosComuns(catId: string) {
    return produtosPorCategoria(catId).filter(
      product =>
        product.sizes.length === 1 &&
        product.sizes[0].size.name === "COMUM"
    );
  }

  function produtosComTamanhos(catId: string) {
    return produtosPorCategoria(catId).filter((p) => p.productActive && !(p.sizes.length === 1 && p.sizes[0].size.name === "COMUM"));
  }

  function tamanhosDaCategoria(catId: string) {
    const products = produtosComTamanhos(catId);

    const sizesMap = new Map<string, Size>();

    products.forEach(product => {
      product.sizes.forEach(productSize => {
        sizesMap.set(productSize.size.id, productSize.size);
      });
    });

    return Array.from(sizesMap.values());
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveTab(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 }
    );

    visibleCategories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleCategories]);

  const handleTabClick = (catId: string) => {
    setActiveTab(catId);
    isClickScrolling.current = true;
    sectionRefs.current[catId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isClickScrolling.current = false; }, 700);
  };

  const onSelectProduct = (product: Product) => setProductSelected(product)
  const handleCloseProductSheet = () => setProductSelected(undefined); //Pra fechar o ProductSheet


  return {
    CATEGORIES,
    PRODUCTS,
    produtosPorCategoria,
    tamanhosDaCategoria,
    produtosComuns,
    handleTabClick,
    activeTab,
    visibleCategories,
    sectionRefs,
    onSelectProduct,
    productSelected,
    handleCloseProductSheet
  };
}