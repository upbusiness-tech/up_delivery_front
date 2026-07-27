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

export default function ClientMenu() {

  const c = UseClientMenuController()

  return (
    <Box sx={{ bgcolor: "#F5F6F8", minHeight: "100dvh" }}>
      {c.step === "menu" && (
        <>
          <MenuScreen onSelectSize={c.openSize} onSelectProduct={c.setSelectedProduct}/>

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
            total={c.total}
            onClick={c.nextStep}
          />
        </>
      )}

      {/* So vai ser usados para produtos com mais de 1 flavor */}
      {c.step === "sizeProducts" && (
        <ProductsBySizeScreen
          size={c.selectedSize!}
          products={c.productsBySize}
          onBack={c.previousStep}
          addProduct={c.addProduct}
          categoryName={c.catName}

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
        />
      )}

      {c.step === "customer" && (
        <InfoScreen
          name="Widney"
          phone="88981486910"
          setName={() => "Widney"}
          setPhone={() => "88981486910"}
          onBack={c.previousStep}
          onNext={c.nextStep}
        />
      )}

      {c.step === "address" && (
        <AddressScreen
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
          total={10}
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