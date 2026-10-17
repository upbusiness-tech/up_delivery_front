import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES_ENUM } from './routes.enum'
import Orders from '../pages/Orders/Orders'
import Login from '../pages/Login/Login'
import Layout from '../layout/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import Menu from '../pages/Menu/Menu'
import { EnterprisePage } from '../pages/Enterprise/EnterprisePage'
import MenuScreen from '../components/ClientMenuComponents/MenuScreen/MenuScreen'
import { PublicRestaurantProvider } from '../context/PublicRestaurantContext'
import { CartScreen } from '../components/ClientMenuComponents/CartScreen/CartScreen'
// import AddressScreen from '../components/ClientMenuComponents/AddressScreen/AddressScren'

export default function ReactRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_ENUM.LOGIN} element={<Login />} />

        <Route element={<PublicRestaurantProvider />}>
          <Route path={ROUTES_ENUM.PUBLIC_MENU} element={<MenuScreen />} />
          <Route path={ROUTES_ENUM.PUBLIC_CART} element={<CartScreen />} />
          {/* <Route path={ROUTES_ENUM.PUBLIC_ADDRESS} element={<AddressScreen />} /> */}
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