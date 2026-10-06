import MenuScreen from "../../components/ClientMenuComponents/MenuScreen/MenuScreen";
import ProductsBySizeScreen from "../../components/ClientMenuComponents/ProductBySizeScreen/ProductBySizeScreen";
import ProductSheet from "../../components/ClientMenuComponents/ProductSheet/ProductSheet";
import { CartBar } from "../../components/ClientMenuComponents/CartBar/CartBar";
import { CartScreen } from "../../components/ClientMenuComponents/CartScreen/CartScreen";
import InfoScreen from "../../components/ClientMenuComponents/InfoScreen/InfoScreen";
import AddressScreen from "../../components/ClientMenuComponents/AddressScreen/AddressScren";
import PaymentScreen from "../../components/ClientMenuComponents/SelectPaymentMethod/SelectMethodPaymentScreen";
import PaymentMethodScreen from "../../components/ClientMenuComponents/PaymentMethodScreen/PaymentMethodScreen";
import { usePublicMenuOutlet } from "./usePublicMenuOutlet";
import FlavorCountScreen from "../../components/ClientMenuComponents/ProductBySizeScreen/FlavorCountScreen";

export function MenuStep() {
  const { c, restaurant, products, categories, additionals } = usePublicMenuOutlet();
  return (<>
    <MenuScreen restaurant={restaurant} products={products} categories={categories} onSelectSize={c.openSize} onSelectProduct={c.openProduct} onSelectCategory={c.setCategory} handleCloseRestauranteClosed={c.handleCloseRestauranteClosed} restaurantClosedModal={c.restauranteClosed} />
    {c.category && <ProductSheet item={c.selectedProduct} category={c.category} additionals={additionals} addProduct={c.addProduct} onClose={c.closeProduct} />}
    <CartBar itemCount={c.productsAdded.length} total={c.subtotal} onClick={c.nextStep} />
  </>);
}

export function FlavorCountStep() {
  const { c } = usePublicMenuOutlet();
  return c.selectedSize ? <FlavorCountScreen size={c.selectedSize} categoryName={c.category?.categoryName} onBack={c.previousStep} onChoose={c.chooseFlavorCount} /> : null;
}

export function SizeProductsStep() {
  const { c, additionals } = usePublicMenuOutlet();
  return c.sizeWithFlavors && c.category ? <ProductsBySizeScreen size={c.sizeWithFlavors} products={c.productsBySize} additionals={additionals} onBack={c.previousStep} onFinish={c.goToMenu} addProduct={c.addProduct} category={c.category} /> : null;
}

export function CartStep() {
  const { c } = usePublicMenuOutlet();
  return <CartScreen items={c.productsAdded} onBack={c.previousStep} onNext={c.nextStep} removeItem={c.removeItem} increaseQuantity={c.increaseQuantity} decreaseQuantity={c.decreaseQuantity} total={c.total} />;
}

export function CustomerStep() {
  const { c } = usePublicMenuOutlet();
  return <InfoScreen name={c.costumerName} phone={c.costumerPhone} setName={c.setCostumerName} setPhone={c.setCostumerPhone} email={c.costumerEmail} setEmail={c.setCostumerEmail} onBack={c.previousStep} onNext={c.nextStep} />;
}

export function AddressStep() {
  const { c, restaurant, neighborhoods } = usePublicMenuOutlet();
  return <AddressScreen type={c.type} setType={c.setType} address={c.address} setAddress={c.setAddress} neighborhood={c.neighborhood} setNeighborhood={c.setNeighborhood} neighborhoods={neighborhoods} restaurant={restaurant} onBack={c.previousStep} onNext={c.nextStep} />;
}

export function PaymentStep() {
  const { c, restaurant } = usePublicMenuOutlet();
  return <PaymentScreen onBack={c.previousStep} onNext={c.nextStep} paymentMethod={c.paymentMethod} setPaymentMethod={c.setPaymentMethod} onCreateOrder={c.createOrder} restaurant={restaurant} total={c.total} />;
}

export function PaymentMethodStep() {
  const { c } = usePublicMenuOutlet();
  return c.orderCreated ? <PaymentMethodScreen order={c.orderCreated} userEmail={c.costumerEmail} userName={c.costumerName} userPhone={c.costumerPhone} paymentMethod={c.paymentMethod} total={c.total} onNext={c.nextStep} onBack={c.previousStep} /> : null;
}