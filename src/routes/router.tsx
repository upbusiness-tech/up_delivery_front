import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { PublicRestaurantLayout } from "../layouts/PublicRestaurantLayout";
import MenuScreen from "../components/ClientMenuComponents/MenuScreen/MenuScreen";
import { CartScreen } from "../components/ClientMenuComponents/CartScreen/CartScreen";
import AddressPage from "../pages/PublicCheckout/AddressPage";
import CustomerPage from "../pages/PublicCheckout/CustomerPage";
import PaymentPage from "../pages/PublicCheckout/PaymentPage";
import SizeFlavorCountPage from "../pages/PublicMenu/SizeFlavorCountPage";
import SizeFlavorsPage from "../pages/PublicMenu/SizeFlavorsPage";
import { CheckoutStepGuard } from "./guards/CheckoutStepGuard";
import { RestaurantOpenGuard } from "./guards/RestaurantOpenGuard";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { PublicOnlyRoute } from "./guards/PublicOnlyRoute";
import { NotFound } from "./NotFound";
import { PATHS, PUBLIC_ROOT, PUBLIC_SEGMENTS } from "./paths";
import { RootLayout } from "./RootLayout";
import { RouteError } from "./RouteError";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      // ---------------------------------------------------------------- público
      {
        // O cardápio público fica isolado em /r/:slug para não conflitar com as
        // rotas do painel. Qualquer URL desconhecida agora cai no 404.
        path: `${PUBLIC_ROOT}/:slug`,
        element: <PublicRestaurantLayout />,
        children: [
          {
            index: true,
            element: <MenuScreen />,
          },
          {
            // O cardápio inicial continua acessível com o restaurante fechado.
            // Qualquer passo além dele passa pela verificação de funcionamento.
            element: <RestaurantOpenGuard />,
            children: [
              {
                path: `${PUBLIC_SEGMENTS.category}/:categoryId/${PUBLIC_SEGMENTS.size}/:sizeId`,
                element: <SizeFlavorCountPage />,
              },
              {
                path: `${PUBLIC_SEGMENTS.category}/:categoryId/${PUBLIC_SEGMENTS.size}/:sizeId/${PUBLIC_SEGMENTS.flavors}/:flavorCount`,
                element: <SizeFlavorsPage />,
              },
              {
                path: PUBLIC_SEGMENTS.cart,
                element: (
                  <CheckoutStepGuard step="cart">
                    <CartScreen />
                  </CheckoutStepGuard>
                ),
              },
              {
                path: PUBLIC_SEGMENTS.customer,
                element: (
                  <CheckoutStepGuard step="customer">
                    <CustomerPage />
                  </CheckoutStepGuard>
                ),
              },
              {
                path: PUBLIC_SEGMENTS.address,
                element: (
                  <CheckoutStepGuard step="address">
                    <AddressPage />
                  </CheckoutStepGuard>
                ),
              },
              {
                path: PUBLIC_SEGMENTS.payment,
                element: (
                  <CheckoutStepGuard step="payment">
                    <PaymentPage />
                  </CheckoutStepGuard>
                ),
              },
            ],
          },
        ],
      },

      // ----------------------------------------------------------------- login
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: PATHS.login,
            lazy: async () => ({ Component: (await import("../pages/Login/Login")).default }),
          },
        ],
      },

      // ----------------------------------------------------------------- painel
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                index: true,
                element: <Navigate to={PATHS.orders} replace />,
              },
              {
                path: PATHS.orders,
                lazy: async () => ({ Component: (await import("../pages/Orders/Orders")).default }),
              },
              {
                path: PATHS.enterprise,
                lazy: async () => ({ Component: (await import("../pages/Enterprise/EnterprisePage")).EnterprisePage }),
              },
              {
                path: PATHS.menu,
                lazy: async () => ({ Component: (await import("../pages/Menu/Menu")).default }),
              },
            ],
          },
        ],
      },

      // ------------------------------------------------------------------- 404
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
