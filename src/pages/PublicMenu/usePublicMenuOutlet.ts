import { useOutletContext } from "react-router-dom";
import type { MenuData } from "../../types/Product.type";

export const usePublicMenuOutlet = () => 
  useOutletContext<MenuData & { 
    c: ReturnType<typeof import("./UsePublicMenuController")
    .UsePublicMenuController> 
  }>();