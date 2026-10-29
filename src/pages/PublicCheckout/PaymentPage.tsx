import { useRef, useState } from "react";
import { Backdrop, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RestaurantService } from "../../api/services/restaurant.service";
import PaymentMethodScreen from "../../components/ClientMenuComponents/PaymentMethodScreen/PaymentMethodScreen";
import SelectMethodPaymentScreen from "../../components/ClientMenuComponents/SelectPaymentMethod/SelectMethodPaymentScreen";
import { CHECKOUT_TOTAL_STEPS, useCheckout } from "../../checkout/CheckoutContext";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { publicPaths } from "../../routes/paths";
import type { CreateOrder, Order } from "../../types/Order.type";

/** Passo 4 do checkout: forma de pagamento e finalização do pedido. */
export default function PaymentPage() {
  const navigate = useNavigate();
  const { slug, restaurant } = usePublicRestaurant();
  const checkout = useCheckout();
  const [order, setOrder] = useState<Order>();
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const submitting = useRef(false);

  async function handleCreateOrder() {
    // Não cria o pedido antes de saber se entrega/retirada estão liberadas.
    if (submitting.current || checkout.settingsLoading) return;
    submitting.current = true;
    setError(null);
    setIsCreatingOrder(true);

    try {
      const payload: CreateOrder = {
        type: checkout.mode,
        paymentMethod: checkout.paymentMethod,
        changeFor: 0,
        items: checkout.products.map((product) => ({
          name: product.name,
          observation: product.observation,
          quantity: product.quantity,
          flavors: product.flavors,
          additionals: product.additionals?.map((additional) => additional.id),
        })),
        costumerName: checkout.customer.name,
        costumerPhone: checkout.customer.phone,
        ...(checkout.mode === "delivery" && checkout.neighborhood
          ? { address: checkout.address, neighborhoodId: checkout.neighborhood.id }
          : {}),
      };

      const created = await RestaurantService.createOrder(slug, payload);

      if (!created) {
        setError("Não foi possível criar o pedido. Tente novamente.");
        return;
      }

      const createdOrder = created as Order;

      // O endpoint de criação pode devolver o pedido sem a relação `restaurant`
      // (por exemplo, ao criar um segundo pedido após voltar da tela de Pix).
      // Como o restaurante já está carregado no contexto público, garante a
      // relação para que as telas de pagamento não quebrem.
      setOrder({
        ...createdOrder,
        restaurant: createdOrder.restaurant?.id
          ? createdOrder.restaurant
          : { id: restaurant.id },
      });
    } catch {
      setError("Não foi possível criar o pedido. Tente novamente.");
    } finally {
      submitting.current = false;
      setIsCreatingOrder(false);
    }
  }

  function handleFinish() {
    checkout.reset();
    navigate(publicPaths.menu(slug), { replace: true });
  }

  return (
    <>
      {order ? (
        <PaymentMethodScreen
          order={order}
          total={order.orderTotal}
          userName={checkout.customer.name}
          userPhone={checkout.customer.phone}
          userEmail={checkout.customer.email}
          paymentMethod={checkout.paymentMethod}
          onBack={() => setOrder(undefined)}
          onNext={handleFinish}
        />
      ) : (
        <SelectMethodPaymentScreen
          total={checkout.total}
          paymentMethod={checkout.paymentMethod}
          setPaymentMethod={checkout.setPaymentMethod}
          onCreateOrder={handleCreateOrder}
          restaurant={restaurant}
          step={4}
          totalSteps={CHECKOUT_TOTAL_STEPS}
          onBack={() => navigate(publicPaths.address(slug))}
          loading={isCreatingOrder}
        />
      )}

      <Backdrop
        open={isCreatingOrder}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1, bgcolor: "rgba(255, 255, 255, 0.82)", color: "text.primary" }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress color="success" />
          <Typography sx={{ fontWeight: 600 }}>Carregando...</Typography>
        </Stack>
      </Backdrop>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} message={error ?? ""} />
    </>
  );
}
