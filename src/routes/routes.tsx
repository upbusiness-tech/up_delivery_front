import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES_ENUM } from './routes.enum'
import Orders from '../pages/Orders/Orders'
import Login from '../pages/Login/Login'
import Layout from '../layout/Layout'
import { EnterprisePage } from '../pages/Enterprise/EnterprisePage'
import { PublicRestaurantProvider } from '../context/PublicRestaurantContext'
import PublicMenu from '../pages/PublicMenu/PublicMenu'
import { ProtectedRoute } from './ProtectedRoute'
import Menu from '../pages/Menu/Menu'
import { AddressStep, CartStep, CustomerStep, FlavorCountStep, MenuStep, PaymentMethodStep, PaymentStep, RedirectToMenu, SizeProductsStep } from '../pages/PublicMenu/PublicMenuSteps'

export default function ReactRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_ENUM.LOGIN} element={<Login />} />
          <Route path={ROUTES_ENUM.PUBLIC_MENU} element={<PublicRestaurantProvider><PublicMenu /></PublicRestaurantProvider>}>
            <Route index element={<MenuStep />} />
            <Route path="flavorCount" element={<FlavorCountStep />} />
            <Route path="sizeProducts" element={<SizeProductsStep />} />
            <Route path="cart" element={<CartStep />} />
            <Route path="customer" element={<CustomerStep />} />
            <Route path="address" element={<AddressStep />} />
            <Route path="payment" element={<PaymentStep />} />
            <Route path="paymentMethod" element={<PaymentMethodStep />} />
            <Route path="*" element={<RedirectToMenu />} />
          </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path={ROUTES_ENUM.HOME} element={<Orders />} />
            <Route path={ROUTES_ENUM.ORDERS} element={<Orders />} />
            <Route path={ROUTES_ENUM.ENTERPRISE} element={<EnterprisePage />} />
            <Route path={ROUTES_ENUM.CARDAPIO} element={<Menu />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}