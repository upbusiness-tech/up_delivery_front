import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { usePublicRestaurant } from "../../context/PublicRestaurantContext";
import { UsePublicMenuController } from "./UsePublicMenuController";
import { Outlet } from "react-router-dom";

export default function PublicMenu() {
  const { restaurant, products, categories, additionals, neighborhoods, isLoading, notFound } = usePublicRestaurant();
  const c = UsePublicMenuController({ restaurant, products, categories, additionals, neighborhoods });

  if (isLoading) {
    return (
      <Stack sx={{ minHeight: "100dvh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (notFound) {
    return (
      <Stack sx={{ minHeight: "100dvh", alignItems: "center", justifyContent: "center", px: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Restaurante não encontrado</Typography>
        <Typography variant="body2" color="text.secondary">Confira se o link está correto.</Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: "100dvh" }}>
      <Outlet context={{ c, restaurant, products, categories, additionals, neighborhoods }} />
    </Box>
  );
}