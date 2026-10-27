import { Outlet, ScrollRestoration } from "react-router-dom";

/** Layout raiz: restaura o scroll entre navegações e hospeda as rotas. */
export function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
