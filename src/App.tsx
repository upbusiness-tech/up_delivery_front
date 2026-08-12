import { AuthProvider } from './context/AuthContext'
import ReactRouter from './routes/routes'

function App() {

  return (
    <AuthProvider>
      <ReactRouter />
    </AuthProvider>
  )
}

export default App
