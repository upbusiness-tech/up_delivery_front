import { useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Order } from "../../types/Order.type";
import { useOrders } from "../../hooks/queries/useOrdersQueries";
import { normalizeSearchText, onlyDigits } from "../../utils/search/search";

export default function UseOrdersController(){

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: orders = [],
    isPending,
    error,
    refetch,
  } = useOrders();

  const hasSearch = searchTerm.trim().length > 0;

  const filteredOrders = useMemo(() => {
    if (!hasSearch) return orders;

    const normalizedQuery = normalizeSearchText(searchTerm);
    const phoneQuery = onlyDigits(searchTerm);

    return orders.filter((order) => {
      const matchesName =
        normalizedQuery.length > 0 &&
        normalizeSearchText(order.costumerName).includes(normalizedQuery);

      const matchesPhone =
        phoneQuery.length > 0 &&
        onlyDigits(order.costumerPhone).includes(phoneQuery);

      return matchesName || matchesPhone;
    });
  }, [hasSearch, orders, searchTerm]);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;
  function openOrderDetail(order: Order) { setSelectedOrderId(order.id) }
  function closeOrderDetail() { setSelectedOrderId(null) }

  function deliveryFee(order: Order){
    return order.type === "delivery"
    ? Number(order.neighborhood?.deliveryFee ?? 0)
    : 0;
  }

  return{
    isDesktop,
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    hasSearch,
    isLoading: isPending,
    error,
    refetch,
    selectedOrder,
    openOrderDetail,
    closeOrderDetail,
    deliveryFee,
  }
}
