import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES_ENUM } from "./routes.enum";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES_ENUM.LOGIN} replace />;
  }

  return <Outlet />;
}