/**
 * Fonte única de verdade das rotas.
 *
 * - Rotas do painel (admin) são estáticas.
 * - O cardápio público vive em `/r/:slug` para não colidir com as rotas do painel.
 *   (Antes o menu público ocupava `/:slug` e qualquer URL desconhecida virava cardápio.)
 * - Nunca monte URL na mão: use os builders `publicPaths.*`.
 */

export const PUBLIC_ROOT = '/r'

export const PATHS = {
  login: '/login',
  orders: '/orders',
  enterprise: '/enterprise',
  menu: '/cardapio',
} as const

/** Segmentos relativos usados dentro de `/r/:slug`. */
export const PUBLIC_SEGMENTS = {
  cart: 'cart',
  customer: 'customer',
  address: 'address',
  payment: 'payment',
  category: 'category',
  size: 'size',
  flavors: 'flavors',
} as const

export const publicPaths = {
  menu: (slug: string) => `${PUBLIC_ROOT}/${slug}`,
  cart: (slug: string) => `${PUBLIC_ROOT}/${slug}/${PUBLIC_SEGMENTS.cart}`,
  customer: (slug: string) => `${PUBLIC_ROOT}/${slug}/${PUBLIC_SEGMENTS.customer}`,
  address: (slug: string) => `${PUBLIC_ROOT}/${slug}/${PUBLIC_SEGMENTS.address}`,
  payment: (slug: string) => `${PUBLIC_ROOT}/${slug}/${PUBLIC_SEGMENTS.payment}`,
  /** Escolha de quantos sabores o tamanho permite. */
  size: (slug: string, categoryId: string, sizeId: string) =>
    `${PUBLIC_ROOT}/${slug}/${PUBLIC_SEGMENTS.category}/${categoryId}/${PUBLIC_SEGMENTS.size}/${sizeId}`,
  /** Seleção dos sabores (e adicionais) de um tamanho. */
  sizeFlavors: (slug: string, categoryId: string, sizeId: string, flavorCount: number) =>
    `${PUBLIC_ROOT}/${slug}/${PUBLIC_SEGMENTS.category}/${categoryId}/${PUBLIC_SEGMENTS.size}/${sizeId}/${PUBLIC_SEGMENTS.flavors}/${flavorCount}`,
} as const
