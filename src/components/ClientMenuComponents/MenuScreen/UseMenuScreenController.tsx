import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, Size } from "../../../types/Product.type";
import { RestaurantService } from "../../../api/services/restaurant.service";
import { usePublicRestaurant } from "../../../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../../../hooks/useRestaurantData";
import { UseProductSearch } from "../../../hooks/useProductSearch";

export interface SizeOption {
  size: Size;
  priceFrom: number;
  image?: string;
}

export function UseMenuScreenController() {
  
  const { slug } = usePublicRestaurant()
  const {data: productsData = [] } = useRestaurantData(() => RestaurantService.restaurantProductsPublic(slug), QueryCacheName.PRODUCTS_PUBLIC, slug)
  const {data: categoriesData = [] } = useRestaurantData(() => RestaurantService.restaurantCategoriesPublic(slug), QueryCacheName.CATEGORIES_PUBLIC, slug)

  const [productSelected, setProductSelected] = useState<Product>()
  
  const PRODUCTS = productsData;
  const CATEGORIES = categoriesData;
  const { search, setSearch, filteredProducts } = UseProductSearch(PRODUCTS, true);
  
  const visibleCategories = useMemo(
    () =>
      CATEGORIES.filter(
        (cat) => produtosComuns(cat.id).length + sizesByCategory(cat.id).length > 0,
      ).sort((a, b) => a.sortOrder - b.sortOrder),
    [CATEGORIES, filteredProducts],
  );
  const [activeTab, setActiveTab] = useState(visibleCategories[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isClickScrolling = useRef(false);


  function produtosPorCategoria(catId: string) {
    return filteredProducts.filter((p) => p.productCategory.id === catId);
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

  /**
   * Um card por tamanho da categoria (ex.: Pizza P, Pizza M), com o menor preço
   * entre os sabores disponíveis naquele tamanho e uma imagem de referência.
   */
  function sizesByCategory(catId: string): SizeOption[] {
    const sizesMap = new Map<string, SizeOption>();

    produtosComTamanhos(catId).forEach((product) => {
      product.sizes.forEach((productSize) => {
        if (productSize.size.name === "COMUM") return;

        const current = sizesMap.get(productSize.size.id);

        sizesMap.set(productSize.size.id, {
          size: productSize.size,
          priceFrom: Math.min(current?.priceFrom ?? productSize.price, productSize.price),
          image: current?.image ?? product.image,
        });
      });
    });

    return Array.from(sizesMap.values()).sort((a, b) => a.priceFrom - b.priceFrom);
  }

  // As categorias chegam de forma assíncrona; seleciona a primeira quando a lista aparecer.
  // Também corrige a aba ativa quando a busca esconde a categoria selecionada.
  useEffect(() => {
    if (visibleCategories.length === 0) return;
    if (!visibleCategories.some((cat) => cat.id === activeTab)) {
      setActiveTab(visibleCategories[0].id);
    }
  }, [activeTab, visibleCategories]);

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

  const activeTabId = visibleCategories.some((cat) => cat.id === activeTab)
    ? activeTab
    : visibleCategories[0]?.id ?? "";

  return {
    CATEGORIES,
    PRODUCTS,
    produtosPorCategoria,
    sizesByCategory,
    produtosComuns,
    handleTabClick,
    activeTab: activeTabId,
    visibleCategories,
    sectionRefs,
    onSelectProduct,
    productSelected,
    handleCloseProductSheet,
    search,
    setSearch,
  };
}