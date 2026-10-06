import {useEffect, useState } from "react";
import { type Address, type CreateOrder, type CreateOrderItem, type Order, type OrderItemBag, type OrderMode } from "../../types/Order.type";
import type { MenuData, Product, ProductCategory, Size } from '../../types/Product.type';
import { RestaurantService } from "../../api/services/restaurant.service";
import type { Neighborhood } from "../../types/Restaurant.type";
import { OrderService } from "../../api/services/order.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type CheckoutStep =
| "menu"
| "flavorCount"
| "sizeProducts"
| "cart"
| "customer"
| "address"
| "payment"
| "paymentMethod"

const STORAGE_KEY = "updelivery:customer";
const DEFAULT_ADDRESS: Address = { city: "Quixadá-CE", number: 0, streetName: "", complement: "" };
const loadCustomer = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; } };

export function UsePublicMenuController({ restaurant, products, neighborhoods }: MenuData) {

  const [saved] = useState(loadCustomer);

  const navigate = useNavigate(); const { slug } = useParams(); const { pathname } = useLocation();
  const step = (pathname.split("/")[2] || "menu") as CheckoutStep;
  const setStep = (s: CheckoutStep) => navigate(s === "menu" ? `/${slug}` : `/${slug}/${s}`);
  const sheetOpen = Boolean(useLocation().state?.sheet);

  const [flavorCount, setFlavorCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [productsBySize, setProductsBySize] = useState<Product[]>([]);
  const [category, setCategory] = useState<ProductCategory>();
  //Produto selecionado
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  //Produtos adicionados no pedido, o produto tem que ser adicionado ja com os flavors escolhidos 
  const [productsAdded, setProductsAdded] = useState<OrderItemBag[]>([])
  const [type, setType] = useState<OrderMode>("delivery");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [changeFor, setChangeFor] = useState<number>(0);
  const [observation, setObservation] = useState("");
  const [costumerName, setCostumerName] = useState<string>(saved.costumerName ?? "");
  const [costumerPhone, setCostumerPhone] = useState<string>(saved.costumerPhone ?? "");
  const [costumerEmail, setCostumerEmail] = useState<string>(saved.costumerEmail ?? "");
  const [address, setAddress] = useState<Address>({ ...DEFAULT_ADDRESS, ...saved.address });
  const [neighborhood, setNeighborhood] = useState<Neighborhood>();
  const [orderCreated, setOrderCreated] = useState<Order>()

  const [restauranteClosed, setRestauranteClosed] = useState(false)
  const handleOpenRestauranteClosed = () => setRestauranteClosed(true)
  const handleCloseRestauranteClosed = () => setRestauranteClosed(false)
  const openProduct = (p: Product) => { setSelectedProduct(p); navigate(pathname, { state: { sheet: true } }); };
  const closeProduct = () => { if (sheetOpen) navigate(-1); else setSelectedProduct(undefined); };

  useEffect(() => { if (!sheetOpen) setSelectedProduct(undefined); }, [sheetOpen]);
  
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ costumerName, costumerPhone, costumerEmail, address, neighborhoodId: neighborhood?.id ?? saved.neighborhoodId })); } catch { /* storage indisponível */ }
  }, [costumerName, costumerPhone, costumerEmail, address, neighborhood, saved.neighborhoodId]);

  useEffect(() => {
    if (neighborhood || !saved.neighborhoodId) return;
    setNeighborhood(neighborhoods?.find((n) => n.id === saved.neighborhoodId));
  }, [neighborhoods]);

  useEffect(() => {
    setOrderCreated(undefined);
  }, [productsAdded, address, neighborhood, type]);

  const openSize = (size: Size) => {
    setSelectedSize(size);
    if (!products) return;
    setProductsBySize(products.filter(product => product.sizes.some(s => s.size.id === size.id)));
    setFlavorCount(1);
    setStep(size.limitFlavors > 1 ? "flavorCount" : "sizeProducts");
  };

  const chooseFlavorCount = (n: number) => { setFlavorCount(n); setStep("sizeProducts"); };
  const goToMenu = () => navigate((selectedSize?.limitFlavors ?? 1) > 1 ? -2 : -1);
  const sizeWithFlavors = selectedSize ? { ...selectedSize, limitFlavors: flavorCount } : undefined;

  function nextStep() {
    switch (step) {
      case "menu":
        setStep("cart");
        break;
      case "sizeProducts":
        setStep("menu");
        break;
      case "flavorCount": 
        setStep("sizeProducts"); 
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
      case "paymentMethod": navigate(-5); break;
    }
  }

  const previousStep = () => navigate(-1);

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
        ? { ...item, quantity: Math.max(item.minQuantity ?? 1, item.quantity - 1)}
        : item
      )
    );
    setOrderCreated(undefined);
  }

  async function createOrder() {

    if(!restaurant) return

    const restaurantIsOpen = await RestaurantService.restaurantOpen(restaurant.id)
    if(!restaurantIsOpen?.data){
      console.log('RESTAURANTE FECHADO AGR')
      navigate(-4)
      handleOpenRestauranteClosed()
      return
    }

    if (type === "delivery" && (!address || !neighborhood)) return;
    
    if (orderCreated) {
      const updated = await OrderService.updateOrderPaymentMethod(orderCreated.id, paymentMethod)
      setOrderCreated(updated)
      return
    }

    const orderItens = productsAdded.map((e) => {
      const item: CreateOrderItem = {
        name: e.name,
        observation: e.observation,
        quantity: e.quantity,
        flavors: e.flavors,
        additionals: e.additionals?.map((ad) => ad.id)
      }
      return item;
    })

    console.log("PRDUTOS: ", orderItens)

    // const observations = productsAdded
    //   .map((e) => e.observation)
    //   .filter(Boolean)
    //   .join(" | ");
    
    const newOrder: CreateOrder = {
      type: type,
      paymentMethod: paymentMethod,
      changeFor: changeFor,
      items: orderItens,
      // observation: observations,
      costumerName: costumerName,
      costumerPhone: costumerPhone,
      ...(type === "delivery" && { address, neighborhoodId: neighborhood!.id }),
    };


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
    setPaymentMethod, changeFor, setChangeFor, createOrder, handleCloseRestauranteClosed, restauranteClosed,
    subtotal, total, category, setCategory, orderCreated, costumerEmail, setCostumerEmail,
    flavorCount, chooseFlavorCount, goToMenu, sizeWithFlavors, openProduct, closeProduct
  };
}