import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoader } from "../../components/Loading/FullPageLoader";
import { PATHS } from "../paths";

/**
 * Protege as rotas do painel. Guarda o destino original em `state.from`
 * para que o login possa devolver o usuário ao local que ele tentou abrir.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader label="Verificando sua sessão..." />;

  if (!user) {
    return <Navigate to={PATHS.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
