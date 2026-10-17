import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { UsePublicMenuController } from "./UsePublicMenuController";

export default function PublicMenu() {
  const c = UsePublicMenuController();

  if (c.isLoading) return <Box>Carregando cardápio...</Box>;

  if (!c.restaurant) return <Box>Restaurante não encontrado.</Box>;

  return (
    <Box sx={{ minHeight: "100dvh" }}>
      <Outlet context={{
        c,
        restaurant: c.restaurant,
        products: c.products,
        categories: c.categories,
        additionals: c.additionals,
        neighborhoods: c.neighborhoods
      }} />
    </Box>
  );
}