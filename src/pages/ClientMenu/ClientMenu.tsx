import { Box } from "@mui/material";
import MenuScreen from "../../components/ClientMenuComponents/MenuScreen/MenuScreen";
import { UseClientMenuController } from "./UseClientMenuController";
import ProductsBySizeScreen from "../../components/ClientMenuComponents/ProductBySizeScreen/ProductBySizeScreen";
import ProductSheet from "../../components/ClientMenuComponents/ProductSheet/ProductSheet";
import { CartBar } from "../../components/ClientMenuComponents/CartBar/CartBar";
import { CartScreen } from "../../components/ClientMenuComponents/CartScreen/CartScreen";
import InfoScreen from "../../components/ClientMenuComponents/InfoScreen/InfoScreen";
import AddressScreen from "../../components/ClientMenuComponents/AddressScreen/AddressScren";
import PaymentScreen from "../../components/ClientMenuComponents/PaymentScreen/PaymentScreen";
import DoneScreen from "../../components/ClientMenuComponents/DoneScreen/DoneScreen";
import { useRestaurant } from "../../context/RestaurantContext";

export default function ClientMenu() {

  const { restaurant, products, categories, additionals, neighborhoods } = useRestaurant();
  
  const safeProducts = products ?? [];
  const safeCategories = categories ?? [];
  const safeAdditionals = additionals ?? [];
  const safeNeighborhoods = neighborhoods ?? [];

  const c = UseClientMenuController({
    restaurant,
    products: safeProducts,
    categories: safeCategories,
    additionals: safeAdditionals,
    neighborhoods: safeNeighborhoods,
  });
  
  return (
    <Box sx={{ minHeight: "100dvh" }}>
      {c.step === "menu" && (
        <>
          <MenuScreen
            restaurant={restaurant}
            products={safeProducts}
            categories={safeCategories}
            onSelectSize={c.openSize}
            onSelectProduct={c.setSelectedProduct}
            onSelectCategory={c.setCategory}
          />
          {/* 
          So vai ser usados para produtos com 1 flavor 
          Clica no ProductCard que esta dentro do MenuScreen  -> Abre o ProductSheet -> 
          dentro do ProductSheet -> Se o usuario confirmar -> Tranforma o Product em um OrderItemBag ->
          Adicona o produto como OrderItemBag no array de itens para requisição */}
          <ProductSheet
            item={c.selectedProduct}
            addProduct={c.addProduct}
            onClose={() => c.setSelectedProduct(undefined)}
          />

          <CartBar
            itemCount={c.productsAdded.length}
            total={c.subtotal}
            onClick={c.nextStep}
          />
        </>
      )}

      {/* So vai ser usados para produtos com mais de 1 flavor */}
      {c.step === "sizeProducts" && c.selectedSize && c.category && (
        <ProductsBySizeScreen
          size={c.selectedSize}
          products={c.productsBySize}
          additionals={safeAdditionals}
          onBack={c.previousStep}
          addProduct={c.addProduct}
          category={c.category}
          //Provalvelmente vou ter que fazer uma logica para 
          //selecionar o primeiro produto com o size ja filtrado
          //e adicionar o segundo produto tambem com o size ja filtrado
          //depois juntar os dois em um unico OrderItemBag e enviar para o addProduct={c.addProduct}
          // addProduct={c.addProduct}
        />
      )}

      {c.step === "cart" && (
        <CartScreen
          items={c.productsAdded}
          onBack={c.previousStep}
          onNext={c.nextStep}
          removeItem={c.removeItem}
          increaseQuantity={c.increaseQuantity}
          decreaseQuantity={c.decreaseQuantity}
        />
      )}

      {c.step === "customer" && (
        <InfoScreen
          name={c.costumerName}
          phone={c.costumerPhone}
          setName={c.setCostumerName}
          setPhone={c.setCostumerPhone}
          onBack={c.previousStep}
          onNext={c.nextStep}
        />
      )}

      {c.step === "address" && (
        <AddressScreen
          type={c.type}
          setType={c.setType}
          address={c.address}
          setAddress={c.setAddress}
          neighborhood={c.neighborhood}
          setNeighborhood={c.setNeighborhood}
          neighborhoods={safeNeighborhoods}
          restaurant={restaurant}
          onBack={c.previousStep}
          onNext={c.nextStep}
        /> 
      )}
     

      {c.step === "payment" && (
        <PaymentScreen
          onBack={c.previousStep}
          onNext={c.nextStep}
          changeFor="0"
          payment="pix"
          total={c.total}
          relaizarPedido={c.createOrder}
        />
      )}

      {c.step === "confirmation" && (
        <DoneScreen
          total={10}
          mode="delivery"
          code="1234"
        />
      )}
    </Box>
  );
}