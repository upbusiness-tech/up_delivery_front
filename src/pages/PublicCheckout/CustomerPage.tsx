import { useNavigate } from "react-router-dom";
import InfoScreen from "../../components/ClientMenuComponents/InfoScreen/InfoScreen";
import { CHECKOUT_TOTAL_STEPS, useCheckout } from "../../checkout/CheckoutContext";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { publicPaths } from "../../routes/paths";

/** Passo 2 do checkout: dados pessoais do cliente. */
export default function CustomerPage() {
  const navigate = useNavigate();
  const { slug } = usePublicRestaurant();
  const { customer, updateCustomer } = useCheckout();

  return (
    <InfoScreen
      name={customer.name}
      setName={(name) => updateCustomer({ name })}
      phone={customer.phone}
      setPhone={(phone) => updateCustomer({ phone })}
      email={customer.email}
      setEmail={(email) => updateCustomer({ email })}
      step={2}
      totalSteps={CHECKOUT_TOTAL_STEPS}
      onBack={() => navigate(publicPaths.cart(slug))}
      onNext={() => navigate(publicPaths.address(slug))}
    />
  );
}
