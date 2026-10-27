import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Address, OrderItemBag, OrderMode } from "../types/Order.type";
import type { Neighborhood } from "../types/Restaurant.type";
import { useInfoScreenValidation } from "../hooks/useInfoScreenValidation";
import { usePublicRestaurant } from "../context/PublicRestaurantContext";

/** Passos do checkout público, na ordem em que devem ser percorridos. */
export type CheckoutStep = "cart" | "customer" | "address" | "payment";

/** Destino de um acesso bloqueado: o cardápio ou o primeiro passo pendente. */
export type CheckoutRedirect = "menu" | CheckoutStep;

export const CHECKOUT_TOTAL_STEPS = 4;

export interface CustomerData {
  name: string;
  phone: string;
  email: string;
}

const EMPTY_CUSTOMER: CustomerData = { name: "", phone: "", email: "" };
const EMPTY_ADDRESS: Address = { city: "", number: 0, streetName: "", complement: "" };

interface CheckoutContextValue {
  // Carrinho
  products: OrderItemBag[];
  addProduct: (product: OrderItemBag) => void;
  updateProduct: (product: OrderItemBag) => void;
  decrementProduct: (product: OrderItemBag) => void;
  removeProduct: (id: string) => void;
  clearCart: () => void;
  subtotal: number;

  // Dados pessoais
  customer: CustomerData;
  updateCustomer: (patch: Partial<CustomerData>) => void;

  // Entrega
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  address: Address;
  updateAddress: (patch: Partial<Address>) => void;
  neighborhood: Neighborhood | undefined;
  setNeighborhood: (neighborhood: Neighborhood | undefined) => void;

  // Pagamento
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  // Validação / navegação
  hasProducts: boolean;
  hasCustomer: boolean;
  hasAddress: boolean;
  hasPaymentMethod: boolean;
  /** Retorna o destino para onde o usuário deve ir se tentar acessar `step` agora. */
  getBlockedRedirect: (step: CheckoutStep) => CheckoutRedirect | null;

  total: number;
  /** Limpa o pedido em andamento (usado após finalizar). */
  reset: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

interface PersistedCheckout {
  products?: OrderItemBag[];
  customer?: CustomerData;
  address?: Address;
  neighborhood?: Neighborhood;
  mode?: OrderMode;
  paymentMethod?: string;
}

const STORAGE_PREFIX = "updelivery:checkout";
const CUSTOMER_STORAGE_KEY = "updelivery:customer";
const DELIVERY_STORAGE_PREFIX = "updelivery:delivery";

interface PersistedDelivery {
  address?: Address;
  neighborhood?: Neighborhood;
}

function readCheckout(storageKey: string): PersistedCheckout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as PersistedCheckout) : null;
  } catch {
    return null;
  }
}

function readLocalStorage<T>(storageKey: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocalStorage(storageKey: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // localStorage indisponível (modo privado, cota cheia...) — segue sem salvar.
  }
}

function removeLocalStorage(storageKey: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // ignora
  }
}

function hasCustomerData(customer: Partial<CustomerData> | null | undefined) {
  return Boolean(customer?.name?.trim() || customer?.phone?.trim() || customer?.email?.trim());
}

function hasAddressData(address: Partial<Address> | null | undefined, neighborhood: Neighborhood | null | undefined) {
  return Boolean(
    neighborhood ||
      address?.city?.trim() ||
      address?.streetName?.trim() ||
      Number(address?.number) > 0 ||
      address?.complement?.trim(),
  );
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { slug } = usePublicRestaurant();
  const storageKey = `${STORAGE_PREFIX}:${slug}`;
  const deliveryStorageKey = `${DELIVERY_STORAGE_PREFIX}:${slug}`;

  const [saved] = useState<PersistedCheckout | null>(() => readCheckout(storageKey));
  const [savedCustomer] = useState<CustomerData | null>(() => readLocalStorage<CustomerData>(CUSTOMER_STORAGE_KEY));
  const [savedDelivery] = useState<PersistedDelivery | null>(() =>
    readLocalStorage<PersistedDelivery>(deliveryStorageKey),
  );

  const [products, setProducts] = useState<OrderItemBag[]>(() =>
    Array.isArray(saved?.products) ? saved.products : [],
  );
  const [customer, setCustomer] = useState<CustomerData>(() => {
    if (hasCustomerData(saved?.customer)) return { ...EMPTY_CUSTOMER, ...saved?.customer };
    if (hasCustomerData(savedCustomer)) return { ...EMPTY_CUSTOMER, ...savedCustomer };
    return { ...EMPTY_CUSTOMER };
  });
  const [mode, setMode] = useState<OrderMode>(saved?.mode ?? "delivery");
  const [address, setAddress] = useState<Address>(() => {
    if (hasAddressData(saved?.address, saved?.neighborhood)) return { ...EMPTY_ADDRESS, ...saved?.address };
    if (hasAddressData(savedDelivery?.address, savedDelivery?.neighborhood)) {
      return { ...EMPTY_ADDRESS, ...savedDelivery?.address };
    }
    return { ...EMPTY_ADDRESS };
  });
  const [neighborhood, setNeighborhood] = useState<Neighborhood | undefined>(() => {
    if (hasAddressData(saved?.address, saved?.neighborhood)) return saved?.neighborhood;
    if (hasAddressData(savedDelivery?.address, savedDelivery?.neighborhood)) return savedDelivery?.neighborhood;
    return undefined;
  });
  const [paymentMethod, setPaymentMethod] = useState(saved?.paymentMethod ?? "");

  // Mantém o carrinho e o progresso do checkout ao recarregar a página.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        storageKey,
        JSON.stringify({ products, customer, address, neighborhood, mode, paymentMethod }),
      );
    } catch {
      // sessionStorage indisponível (modo privado, cota cheia...) — segue sem persistir.
    }
  }, [storageKey, products, customer, address, neighborhood, mode, paymentMethod]);

  // Dados pessoais são salvos entre visitas para não serem digitados novamente.
  useEffect(() => {
    if (hasCustomerData(customer)) {
      writeLocalStorage(CUSTOMER_STORAGE_KEY, customer);
    } else {
      removeLocalStorage(CUSTOMER_STORAGE_KEY);
    }
  }, [customer]);

  // O endereço fica salvo por restaurante porque os bairros/IDs são específicos de cada um.
  useEffect(() => {
    if (hasAddressData(address, neighborhood)) {
      writeLocalStorage(deliveryStorageKey, { address, neighborhood });
    } else {
      removeLocalStorage(deliveryStorageKey);
    }
  }, [deliveryStorageKey, address, neighborhood]);

  const { isValid: hasCustomer } = useInfoScreenValidation(customer.name, customer.phone, customer.email);
  const hasProducts = products.length > 0;
  const hasPaymentMethod = paymentMethod.trim().length > 0;

  const hasAddress = useMemo(() => {
    if (mode === "pickup") return true;
    return (
      address.streetName.trim().length >= 3 &&
      Number(address.number) > 0 &&
      address.city.trim().length > 0 &&
      Boolean(neighborhood)
    );
  }, [mode, address, neighborhood]);

  const subtotal = useMemo(
    () =>
      products.reduce((total, product) => {
        const additionals = (product.additionals ?? []).reduce((sum, item) => sum + item.additionalPrice, 0);
        return total + (product.price + additionals) * product.quantity;
      }, 0),
    [products],
  );

  const total = subtotal + (mode === "delivery" ? neighborhood?.deliveryFee ?? 0 : 0);

  function addProduct(product: OrderItemBag) {
    setProducts((previous) => {
      const existing = previous.find((item) => item.id === product.id);
      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, observation: product.observation }
            : item,
        );
      }
      return [...previous, { ...product, quantity: 1 }];
    });
  }

  /** Substitui um item existente, usado ao editar configurações do carrinho. */
  function updateProduct(product: OrderItemBag) {
    setProducts((previous) =>
      previous.map((item) => (item.id === product.id ? product : item)),
    );
  }

  function decrementProduct(product: OrderItemBag) {
    setProducts((previous) =>
      previous
        .map((item) => (item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function removeProduct(id: string) {
    setProducts((previous) => previous.filter((item) => item.id !== id));
  }

  function clearCart() {
    setProducts([]);
  }

  function updateCustomer(patch: Partial<CustomerData>) {
    setCustomer((previous) => ({ ...previous, ...patch }));
  }

  function updateAddress(patch: Partial<Address>) {
    setAddress((previous) => ({ ...previous, ...patch }));
  }

  function getBlockedRedirect(step: CheckoutStep): CheckoutRedirect | null {
    // Sem produtos, somente o cardápio é acessível.
    if (!hasProducts) return "menu";

    // Carrinho e dados pessoais exigem apenas que exista algo no carrinho.
    if (step === "cart" || step === "customer") return null;

    // Endereço exige os dados pessoais preenchidos.
    if (!hasCustomer) return "customer";

    if (step === "address") return null;

    // Pagamento exige o endereço preenchido (ou retirada selecionada).
    if (!hasAddress) return "address";

    return null;
  }

  function reset() {
    // Mantém os dados pessoais e o endereço para o próximo pedido.
    setProducts([]);
    setPaymentMethod("");
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // ignora
    }
  }

  return (
    <CheckoutContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        decrementProduct,
        removeProduct,
        clearCart,
        subtotal,
        customer,
        updateCustomer,
        mode,
        setMode,
        address,
        updateAddress,
        neighborhood,
        setNeighborhood,
        paymentMethod,
        setPaymentMethod,
        hasProducts,
        hasCustomer,
        hasAddress,
        hasPaymentMethod,
        getBlockedRedirect,
        total,
        reset,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout deve ser usado dentro de <CheckoutProvider>");
  }
  return context;
}
