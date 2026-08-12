import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import MenuScreen from "../../components/ClientMenuComponents/MenuScreen/MenuScreen";
import ProductsBySizeScreen from "../../components/ClientMenuComponents/ProductBySizeScreen/ProductBySizeScreen";
import ProductSheet from "../../components/ClientMenuComponents/ProductSheet/ProductSheet";
import { CartBar } from "../../components/ClientMenuComponents/CartBar/CartBar";
import { CartScreen } from "../../components/ClientMenuComponents/CartScreen/CartScreen";
import InfoScreen from "../../components/ClientMenuComponents/InfoScreen/InfoScreen";
import AddressScreen from "../../components/ClientMenuComponents/AddressScreen/AddressScren";
import PaymentScreen from "../../components/ClientMenuComponents/SelectPaymentMethod/SelectMethodPaymentScreen";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import PaymentMethodScreen from "../../components/ClientMenuComponents/PaymentMethodScreen/PaymentScreen";
import { UsePublicMenuController } from "./UsePublicMenuController";

export default function PublicMenu() {
  const { restaurant, products, categories, additionals, neighborhoods, isLoading, notFound } = usePublicRestaurant();
  const c = UsePublicMenuController({ restaurant, products, categories, additionals, neighborhoods });

  if (isLoading) {
    return (
      <Stack sx={{ minHeight: "100dvh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (notFound) {
    return (
      <Stack sx={{ minHeight: "100dvh", alignItems: "center", justifyContent: "center", px: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Restaurante não encontrado</Typography>
        <Typography variant="body2" color="text.secondary">Confira se o link está correto.</Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: "100dvh" }}>
      {c.step === "menu" && (
        <>
          <MenuScreen
            restaurant={restaurant}
            products={products}
            categories={categories}
            onSelectSize={c.openSize}
            onSelectProduct={c.setSelectedProduct}
            onSelectCategory={c.setCategory}
          />
          {c.category && (
           <ProductSheet item={c.selectedProduct} category={c.category} additionals={additionals} addProduct={c.addProduct} onClose={() => c.setSelectedProduct(undefined)} />
          )}
          
          <CartBar itemCount={c.productsAdded.length} total={c.subtotal} onClick={c.nextStep} />
        </>
      )}

      {c.step === "sizeProducts" && c.selectedSize && c.category && (
        <ProductsBySizeScreen
          size={c.selectedSize}
          products={c.productsBySize}
          additionals={additionals}
          onBack={c.previousStep}
          addProduct={c.addProduct}
          category={c.category}
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
          total={c.total}
        />
      )}

      {c.step === "customer" && (
        <InfoScreen
          name={c.costumerName}
          phone={c.costumerPhone}
          setName={c.setCostumerName}
          setPhone={c.setCostumerPhone}
          email={c.costumerEmail}
          setEmail={c.setCostumerEmail}
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
          neighborhoods={neighborhoods}
          restaurant={restaurant}
          onBack={c.previousStep}
          onNext={c.nextStep}
        />
      )}

      {/* Tela para selecionar o metodo de pagamento */}
      {c.step === "payment" && (
        <PaymentScreen
          onBack={c.previousStep}
          onNext={c.nextStep}
          paymentMethod={c.paymentMethod}    
          setPaymentMethod={c.setPaymentMethod}
          onCreateOrder={c.createOrder}
          total={c.total}
        />
      )}

      {c.step === "paymentMethod" && c.orderCreated && (
        <PaymentMethodScreen
          order={c.orderCreated}
          userEmail={c.costumerEmail}
          userName={c.costumerName}
          userPhone={c.costumerPhone}
          paymentMethod={c.paymentMethod}
          total={c.total}
          onNext={c.nextStep}
          onBack={c.previousStep}

        />
      )}
    </Box>
  );
}