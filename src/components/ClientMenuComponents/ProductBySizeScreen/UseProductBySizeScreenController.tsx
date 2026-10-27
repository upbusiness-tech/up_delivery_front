import { useEffect, useMemo, useState } from "react";
import type { Additionals, Product, ProductCategory, Size } from "../../../types/Product.type";
import type { OrderItemBag } from "../../../types/Order.type";

export function UseProductBySizeScreenController(
  size: Size,
  category: ProductCategory,
  additionals: Additionals[],
  products: Product[] = [],
  initialItem?: OrderItemBag,
) {
  const flavorCount = Math.max(1, size.limitFlavors);

  const buildInitialFlavors = () =>
    Array.from({ length: flavorCount }, (_, index) => {
      const productSizeId = initialItem?.flavors[index];
      if (!productSizeId) return null;
      return (
        products.find((product) =>
          product.sizes.some((productSize) => productSize.id === productSizeId),
        ) ?? null
      );
    });

  const initialAdditionals = initialItem?.additionals ?? [];
  const initialSingle =
    initialAdditionals.find((additional) => additional.additionalType === "single") ?? null;
  const initialMultiple = initialAdditionals.filter(
    (additional) => additional.additionalType !== "single",
  );

  const [selectedFlavors, setSelectedFlavors] = useState<(Product | null)[]>(() =>
    buildInitialFlavors(),
  );
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const [observation, setObservation] = useState(initialItem?.observation ?? "");
  const [screenStep, setScreenStep] = useState<"flavors" | "extras">(
    initialItem ? "extras" : "flavors",
  );
  const [checkedSingle, setCheckedSingle] = useState<Additionals | null>(initialSingle);
  const [checkedMultiple, setCheckedMultiple] =
    useState<Additionals[]>(initialMultiple);

  const checkedAdditionals = useMemo(
    () => (checkedSingle ? [checkedSingle, ...checkedMultiple] : checkedMultiple),
    [checkedSingle, checkedMultiple],
  );

  const FLAVOR_LABELS = useMemo(
    () => Array.from({ length: flavorCount }, (_, index) => `${index + 1}º sabor`),
    [flavorCount],
  );

  const OBSERVATION_SUGGESTIONS = [
    "Sem cebola",
    "Sem azeitona",
    "Sem pimenta",
    "Molho à parte",
    "Cortar em 8 pedaços",
  ];

  const ADDITIONALS = additionals ?? [];

  // Garante que o estado seja reiniciado se o tamanho, a quantidade de sabores
  // ou o item editado mudar.
  useEffect(() => {
    const nextFlavors = Array.from({ length: flavorCount }, (_, index) => {
      const productSizeId = initialItem?.flavors[index];
      if (!productSizeId) return null;
      return (
        products.find((product) =>
          product.sizes.some((productSize) => productSize.id === productSizeId),
        ) ?? null
      );
    });
    const nextAdditionals = initialItem?.additionals ?? [];

    setSelectedFlavors(nextFlavors);
    setCurrentFlavorIndex(0);
    setObservation(initialItem?.observation ?? "");
    setScreenStep(initialItem ? "extras" : "flavors");
    setCheckedSingle(
      nextAdditionals.find((additional) => additional.additionalType === "single") ?? null,
    );
    setCheckedMultiple(
      nextAdditionals.filter((additional) => additional.additionalType !== "single"),
    );
  }, [size.id, flavorCount, initialItem, products]);

  function additionalsByCategory() {
    return ADDITIONALS.filter((additional) => additional.category.id === category.id);
  }

  const additionalsByType = (type: Additionals["additionalType"]) =>
    additionalsByCategory().filter((additional) => additional.additionalType === type);

  const toggleSingle = (additional: Additionals) =>
    setCheckedSingle((previous) => (previous?.id === additional.id ? null : additional));

  const toggleMultiple = (additional: Additionals) =>
    setCheckedMultiple((previous) =>
      previous.some((item) => item.id === additional.id)
        ? previous.filter((item) => item.id !== additional.id)
        : [...previous, additional],
    );

  const addSuggestion = (text: string) => {
    setObservation((previous) =>
      previous.includes(text)
        ? previous
        : previous.trim().length
          ? `${previous.trim()}, ${text}`
          : text,
    );
  };

  function getPriceBySize(product: Product, sizeId: string) {
    return product.sizes.find((productSize) => productSize.size.id === sizeId)?.price;
  }

  const isFlavorSelectedElsewhere = (productId: string) =>
    selectedFlavors.some(
      (product, index) => index !== currentFlavorIndex && product?.id === productId,
    );

  const selectFlavor = (product: Product) => {
    setSelectedFlavors((previous) => {
      // Um mesmo sabor não pode ocupar duas fatias.
      if (previous.some((item, index) => index !== currentFlavorIndex && item?.id === product.id)) {
        return previous;
      }

      const next = [...previous];
      next[currentFlavorIndex] = next[currentFlavorIndex]?.id === product.id ? null : product;
      return next;
    });
  };

  const goToNextFlavor = () => {
    setCurrentFlavorIndex((previous) => Math.min(previous + 1, flavorCount - 1));
  };

  const goToFlavorTab = (index: number) => {
    setCurrentFlavorIndex(Math.min(Math.max(index, 0), flavorCount - 1));
  };

  const selectedFlavorProducts = selectedFlavors.filter(
    (product): product is Product => product !== null,
  );

  const unitPrice = selectedFlavorProducts.reduce(
    (highest, product) => Math.max(highest, getPriceBySize(product, size.id) ?? 0),
    0,
  );

  const additionalsTotal = checkedAdditionals.reduce(
    (total, additional) => total + additional.additionalPrice,
    0,
  );

  const totalPrice = unitPrice + additionalsTotal;
  const allFlavorsSelected = selectedFlavors.every((product) => product !== null);
  const isLastFlavor = currentFlavorIndex === flavorCount - 1;
  const currentSelection = selectedFlavors[currentFlavorIndex];

  function toOrderItem(): OrderItemBag {
    const flavorIds = selectedFlavorProducts
      .map((product) => product.sizes.find((productSize) => productSize.size.id === size.id)?.id)
      .filter((id): id is string => Boolean(id));

    return {
      id: initialItem?.id ?? crypto.randomUUID(),
      name: `${category.categoryName} ${size.name}`,
      quantity: initialItem?.quantity ?? 1,
      price: unitPrice,
      flavors: flavorIds,
      flavorNames: selectedFlavorProducts.map((product) => product.productName),
      observation,
      additionals: checkedAdditionals,
      image: selectedFlavorProducts[0]?.image ?? "",
      minQuantity: 1,
      categoryId: category.id,
      sizeId: size.id,
    };
  }

  return {
    getPriceBySize,
    selectedFlavors,
    selectedFlavorProducts,
    currentFlavorIndex,
    currentSelection,
    selectFlavor,
    isFlavorSelectedElsewhere,
    goToNextFlavor,
    goToFlavorTab,
    isLastFlavor,
    allFlavorsSelected,
    toOrderItem,
    observation,
    setObservation,
    addSuggestion,
    screenStep,
    setScreenStep,
    checkedAdditionals,
    additionalsByType,
    checkedSingle,
    checkedMultiple,
    toggleSingle,
    toggleMultiple,
    FLAVOR_LABELS,
    OBSERVATION_SUGGESTIONS,
    ADDITIONALS,
    additionalsByCategory,
    flavorCount,
    unitPrice,
    additionalsTotal,
    totalPrice,
  };
}
