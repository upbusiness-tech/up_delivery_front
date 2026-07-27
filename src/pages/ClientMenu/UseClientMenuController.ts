import {useState } from "react";
import { type Address, type CreateOrder, type CreateOrderItem, type OrderItemBag } from "../../types/Order.type";
import { useRestaurant } from '../../context/RestaurantContext';
import type { Product, Size } from '../../types/Product.type';
import { RestaurantService } from "../../api/services/restaurant.service";

type CheckoutStep =
| "menu"
| "sizeProducts"
| "cart"
| "customer"
| "address"
| "payment"
| "confirmation";

export function UseClientMenuController() {

  const { products, restaurant } = useRestaurant()

  const [step, setStep] = useState<CheckoutStep>("menu");
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [productsBySize, setProductsBySize] = useState<Product[]>([]);
  const [catName, setCatName] = useState("Pizza");
  //Produto selecionado
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  //Produtos adicionados no pedido, o produto tem que ser adicionado ja com os flavors escolhidos 
  const [productsAdded, setProductsAdded] = useState<OrderItemBag[]>([])
  const [type, setType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [changeFor, setChangeFor] = useState(0);
  const [observation, setObservation] = useState("");
  const [costumerName, setCostumerName] = useState("Widney");
  const [costumerPhone, setCostumerPhone] = useState("88981486910");
  const [address, setAddress] = useState<Address>({ city: 'Quixada', number: 2003, streetName: "Rua dos gato"});
  const [neighborhoodId, setNeighborhoodId] = useState("44b120d0-f864-4c3e-9af9-6402cd9113b8");

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
        setStep("confirmation");
        break;
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
      case "confirmation":
        setStep("payment");
        break;
    }
  }

  const total = productsAdded.reduce((tot, item) => { return tot + item.price;}, 0);;

  function addProduct(item: OrderItemBag) {
    setProductsAdded((prev) => [...prev, item]);
  }

  function removeItem(id: string) {
    setProductsAdded((prev) => prev.filter((item) => item.id !== id));
  }

  function increaseQuantity(id: string) {
    setProductsAdded((prev) =>
      prev.map((item) =>
        item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
      )
    );
  }

  function decreaseQuantity(id: string) {
    setProductsAdded((prev) =>
      prev.map((item) =>
        item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1)}
        : item
      )
    );
  }

  async function createOrder() {
    if(!address) return;

    // Antes de mandar os itens, preciso tranformar eles em OrderItens,
    // eles estão como OrderItemBag
    const orderItens = productsAdded.map((e) => {
      const item: CreateOrderItem = {
        name: e.name,
        quantity: e.quantity,
        flavors: e.flavors
      }
      return item;
    })
    console.log("Produtos tranformados para a requisição: ", orderItens)

    const newOrder: CreateOrder = {
      type: type,
      paymentMethod: paymentMethod,
      changeFor: changeFor,
      items: orderItens,
      observation: observation,
      costumerName: costumerName,
      costumerPhone: costumerPhone,
      address: address,
      neighborhoodId: neighborhoodId,
    };
    console.log(newOrder);

    if(!restaurant) return
    const order = await RestaurantService.createOrder(restaurant?.id, newOrder)
    console.log(order)
  }

  return {
    step,
    openSize,
    selectedSize,
    productsBySize,
    previousStep,
    selectedProduct,
    setSelectedProduct,
    productsAdded,
    setProductsAdded,
    addProduct,
    nextStep,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    observation,
    setObservation,
    costumerName,
    setCostumerName,
    costumerPhone,
    setCostumerPhone,
    address,
    setAddress,
    neighborhoodId,
    setNeighborhoodId,
    type,
    setType,
    paymentMethod,
    setPaymentMethod,
    changeFor,
    setChangeFor,
    createOrder,
    total,
    catName,
    setCatName
  };
}