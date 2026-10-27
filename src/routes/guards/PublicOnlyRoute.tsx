import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageLoader } from "../../components/Loading/FullPageLoader";
import { PATHS } from "../paths";

/** Rotas que não fazem sentido para quem já está autenticado (ex.: /login). */
export function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader label="Verificando sua sessão..." />;

  if (user) {
    // Volta para o destino que o usuário tentou abrir antes do login.
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    return <Navigate to={from ?? PATHS.orders} replace />;
  }

  return <Outlet />;
}
