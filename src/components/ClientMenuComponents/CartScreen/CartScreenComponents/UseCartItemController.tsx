import { usePublicRestaurant } from "../../../../context/PublicRestaurantContext";

export function UseCartItemController() {
  const { products } = usePublicRestaurant();

  const getFlavorName = (flavorId: string) => products?.find((p) => p.sizes.some((ps) => ps.id === flavorId))?.productName ?? "Sabor não encontrado";

  const getFlavorLines = (flavors: string[] = [], itemName = "") => {
    const names = flavors.map(getFlavorName);
    if (names.length === 1 && names[0].trim().toLowerCase() === itemName.trim().toLowerCase()) return [];
    return names.map((n) => names.length === 1 ? n : `1/${names.length} ${n}`);
  };

  return { getFlavorLines };
}