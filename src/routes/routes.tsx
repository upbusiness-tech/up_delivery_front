import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ROUTES_ENUM } from './routes.enum'
import Orders from '../pages/Orders/Orders'
import Login from '../pages/Login/Login'
import Layout from '../layout/Layout'
import { EnterprisePage } from '../pages/Enterprise/EnterprisePage'

export default function ReactRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES_ENUM.LOGIN} element={<Login />} />
        <Route element={<Layout />}>
          <Route path={ROUTES_ENUM.HOME} element={<Orders />} />
          <Route path={ROUTES_ENUM.ORDERS} element={<Orders />} />
          <Route path={ROUTES_ENUM.ENTERPRISE} element={<EnterprisePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}