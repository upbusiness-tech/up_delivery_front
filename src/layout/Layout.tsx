import { Outlet } from "react-router-dom";
import AppShell from "../components/Sidbar/AppShell";
import { PrintQueueProvider } from "../context/PrintQueueContext";

export default function Layout() {
  return (
    <PrintQueueProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </PrintQueueProvider>
  );
}