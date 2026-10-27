import { QueryCacheName } from "../useRestaurantData";

const ordersRoot = [QueryCacheName.ORDERS] as const;
const restaurantRoot = [QueryCacheName.RESTAURANT] as const;
const productsRoot = [QueryCacheName.PRODUCTS] as const;
const categoriesRoot = [QueryCacheName.CATEGORIES] as const;
const additionalsRoot = [QueryCacheName.ADDITIONALS] as const;
const sizesRoot = [QueryCacheName.SIZES] as const;
const settingsRoot = [QueryCacheName.SETTINGS] as const;

/**
 * Chaves centralizadas das consultas do painel.
 *
 * Use sempre `queryKeys.*.all` para invalidar um domínio inteiro e
 * `queryKeys.*.list()` para ler/atualizar a lista em cache.
 */
export const queryKeys = {
  orders: {
    all: ordersRoot,
    list: () => [...ordersRoot, "list"] as const,
  },
  restaurant: {
    all: restaurantRoot,
    me: () => [...restaurantRoot, "me"] as const,
    isOpen: () => [QueryCacheName.RESTAURANT_ISOPEN] as const,
  },
  products: {
    all: productsRoot,
    list: () => [...productsRoot, "list"] as const,
  },
  categories: {
    all: categoriesRoot,
    list: () => [...categoriesRoot, "list"] as const,
  },
  additionals: {
    all: additionalsRoot,
    list: () => [...additionalsRoot, "list"] as const,
  },
  sizes: {
    all: sizesRoot,
    list: () => [...sizesRoot, "list"] as const,
  },
  settings: {
    all: settingsRoot,
    byRestaurant: (restaurantId: string) =>
      [...settingsRoot, restaurantId] as const,
  },
};
