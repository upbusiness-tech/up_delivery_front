import { Outlet } from "react-router-dom";
import AppShell from "../components/Sidbar/AppShell";
import { RestaurantProvider } from "../context/RestaurantContext";

export default function Layout() {
  return (
    <RestaurantProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </RestaurantProvider>
  );
}