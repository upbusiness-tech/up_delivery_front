import { Box, Button, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Outlet, useParams } from "react-router-dom";
import { RestaurantService } from "../api/services/restaurant.service";
import { CheckoutProvider } from "../checkout/CheckoutContext";
import { FullPageLoader } from "../components/Loading/FullPageLoader";
import { PublicRestaurantProvider } from "../context/PublicRestaurantContext";
import { QueryCacheName, useRestaurantData } from "../hooks/useRestaurantData";

/**
 * Layout das páginas públicas do cliente.
 *
 * Responsabilidades:
 * - validar o `:slug` (restaurante inexistente deixa de renderizar o cardápio);
 * - disponibilizar o restaurante via contexto;
 * - criar o `CheckoutProvider` escopado por restaurante (ao trocar de slug o
 *   estado do pedido é remontado e não vaza de um restaurante para outro).
 */
export function PublicRestaurantLayout() {
  const { slug = "" } = useParams<{ slug: string }>();

  const { data: restaurant, isLoading } = useRestaurantData(
    () => RestaurantService.getPublicRestaurantInfos(slug),
    QueryCacheName.RESTAURANT_PUBLIC_INFOS,
    slug,
  );

  if (isLoading) return <FullPageLoader label="Carregando cardápio..." />;

  if (!restaurant) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 3,
          textAlign: "center",
        }}
      >
        <StorefrontIcon sx={{ fontSize: 64, color: "grey.400" }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Restaurante não encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          Confira o link que você recebeu. O endereço <strong>/r/{slug}</strong> não corresponde a nenhum restaurante ativo.
        </Typography>
        <Button variant="outlined" color="success" href="/" sx={{ textTransform: "none", borderRadius: 999 }}>
          Ir para o início
        </Button>
      </Box>
    );
  }

  return (
    <PublicRestaurantProvider slug={slug} restaurant={restaurant}>
      <CheckoutProvider key={slug}>
        <Outlet />
      </CheckoutProvider>
    </PublicRestaurantProvider>
  );
}
