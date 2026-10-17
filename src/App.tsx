import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ReactRouter from './routes/routes'

function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <ReactRouter />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
