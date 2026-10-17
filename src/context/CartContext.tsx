import { createContext, useContext, useState, type ReactNode } from "react";
import type { OrderItemBag } from "../types/Order.type";

interface CartContextType  {  
  products: OrderItemBag[];
  addProduct: (product: OrderItemBag) => void;
  decrementProduct: (id: OrderItemBag) => void
  removeProduct: (id: string) => void;
  clearCart: () => void;
  subtotal: number
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<OrderItemBag[]>([]);

  const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

  function addProduct(product: OrderItemBag) {
    setProducts((prev) => {
      //Verifica se esse produto ja existe no array de adicionados
      const existing = prev.find((p) => p.id === product.id);
      //Se existir 
      if (existing) {
        //Percorre o array dos produtos do carrinho
        return prev.map((p) => p.id === product.id //verifica se é o produto selecionado.
          ? { 
              ...p, quantity: p.quantity + 1,
              observation: product.observation,
            }//copia todas as propriedades do produto e atualiza sua quantidade.
          : p //se não for o produto selecionado, mantém ele como está.
        );
      }
      //adiciona um novo produto ao carrinho com quantidade inicial igual a 1.
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function decrementProduct(product: OrderItemBag){
    setProducts((prev) =>
      prev
        .map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setProducts([]);
  }

  return (
    <CartContext.Provider 
      value={{ products, addProduct, removeProduct, clearCart, decrementProduct, subtotal}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context  = useContext(CartContext);
  if (!context ) 
    throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}