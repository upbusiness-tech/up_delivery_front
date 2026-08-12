import {useEffect, useState } from "react";
import { type Address, type CreateOrder, type CreateOrderItem, type Order, type OrderItemBag, type OrderMode } from "../../types/Order.type";
import type { MenuData, Product, ProductCategory, Size } from '../../types/Product.type';
import { RestaurantService } from "../../api/services/restaurant.service";
import type { Neighborhood } from "../../types/Restaurant.type";

type CheckoutStep =
| "menu"
| "sizeProducts"
| "cart"
| "customer"
| "address"
| "payment"
| "paymentMethod"

export function UsePublicMenuController({ restaurant, products }: MenuData) {

  const [step, setStep] = useState<CheckoutStep>("menu");
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [productsBySize, setProductsBySize] = useState<Product[]>([]);
  const [category, setCategory] = useState<ProductCategory>();
  //Produto selecionado
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  //Produtos adicionados no pedido, o produto tem que ser adicionado ja com os flavors escolhidos 
  const [productsAdded, setProductsAdded] = useState<OrderItemBag[]>([])
  const [type, setType] = useState<OrderMode>("delivery");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [changeFor, setChangeFor] = useState(0);
  const [observation, setObservation] = useState("");
  const [costumerName, setCostumerName] = useState("");
  const [costumerPhone, setCostumerPhone] = useState("");
  const [costumerEmail, setCostumerEmail] = useState("");
  const [address, setAddress] = useState<Address>({ city: "", number: 0, streetName: "" });
  const [neighborhood, setNeighborhood] = useState<Neighborhood>();
  const [orderCreated, setOrderCreated] = useState<Order>()

  useEffect(() => {
    setOrderCreated(undefined);
  }, [productsAdded, address, neighborhood, type]);

  const openSize = (size: Size) => {
    setSelectedSize(size);
    console.log("Tamanho: ", size.name, "id: ", size.id)
    if(!products) return;

    const productsS = products.filter(product =>
      product.sizes.some(s => s.size.id === size.id)
    );

    setProductsBySize(productsS);
    setStep("sizeProducts");
  };

  function nextStep() {
    switch (step) {
      case "menu":
        setStep("cart");
        break;
      case "sizeProducts":
        setStep("menu");
        break;
      case "cart":
        setStep("customer");
        break;
      case "customer":
        setStep("address");
        break;
      case "address":
        setStep("payment");
        break;
      case "payment":
        setStep("paymentMethod");
        break;
      case "paymentMethod":
        setStep("menu")
        break
    }
  }

  function previousStep() {
    switch (step) {
      case "cart":
        setStep("menu");
        break;
      case "sizeProducts":
        setStep("menu");
        break;
      case "customer":
        setStep("cart");
        break;
      case "address":
        setStep("customer");
        break;
      case "payment":
        setStep("address");
        break;
      case "paymentMethod":
        setStep("payment")
        break
    }
  }

  const subtotal = productsAdded.reduce((tot, item) => {
    const additionalsSum = (item.additionals ?? []).reduce((sum, ad) => sum + ad.additionalPrice, 0);
    return tot + (item.price + additionalsSum) * item.quantity;
  }, 0);

  const total = subtotal + (neighborhood?.deliveryFee ?? 0);

  function addProduct(item: OrderItemBag) {
    setProductsAdded((prev) => [...prev, item]);
    setOrderCreated(undefined);
  }

  function removeItem(id: string) {
    setProductsAdded((prev) => prev.filter((item) => item.id !== id));
    setOrderCreated(undefined);
  }

  function increaseQuantity(id: string) {
    setProductsAdded((prev) =>
      prev.map((item) =>
        item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
      )
    );
    setOrderCreated(undefined);
  }

  function decreaseQuantity(id: string) {
    setProductsAdded((prev) =>
      prev.map((item) =>
        item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1)}
        : item
      )
    );
    setOrderCreated(undefined);
  }

  async function createOrder() {
    // Se já existe um pedido criado, não cria de novo
    if (orderCreated) return;

    if (type === "delivery" && (!address || !neighborhood)) return;

    const orderItens = productsAdded.map((e) => {
      const item: CreateOrderItem = {
        name: e.name,
        quantity: e.quantity,
        flavors: e.flavors,
        additionals: e.additionals?.map((ad) => ad.id)
      }
      return item;
    })

    const observations = productsAdded
      .map((e) => e.observation)
      .filter(Boolean)
      .join(" | ");

    const newOrder: CreateOrder = {
      type: type,
      paymentMethod: paymentMethod,
      changeFor: changeFor,
      items: orderItens,
      observation: observations,
      costumerName: costumerName,
      costumerPhone: costumerPhone,
      ...(type === "delivery" && { address, neighborhoodId: neighborhood!.id }),
    };

    if(!restaurant) return
    const order = await RestaurantService.createOrder(restaurant.id, newOrder)
    setOrderCreated(order)
    console.log(order)
  }

  return {
    step, openSize, selectedSize, productsBySize, previousStep,
    selectedProduct, setSelectedProduct, productsAdded, setProductsAdded,
    addProduct, nextStep, removeItem, increaseQuantity, decreaseQuantity,
    observation, setObservation, costumerName, setCostumerName,
    costumerPhone, setCostumerPhone, address, setAddress,
    neighborhood, setNeighborhood, type, setType, paymentMethod,
    setPaymentMethod, changeFor, setChangeFor, createOrder,
    subtotal, total, category, setCategory, orderCreated, costumerEmail, setCostumerEmail
  };
}