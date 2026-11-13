import { useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import type { Order } from "../../types/Order.type";
import { useOrders } from "../../hooks/queries/useOrdersQueries";
import { normalizeSearchText, onlyDigits } from "../../utils/search/search";
import { STATUS } from "../../utils/texts/status.enum";

export type OrderStatusFilter = "ALL" | STATUS;

export default function UseOrdersController(){

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");

  const {
    data: orders = [],
    isPending,
    error,
    refetch,
  } = useOrders();

  const hasSearch = searchTerm.trim().length > 0;
  const hasStatusFilter = statusFilter !== "ALL";
  const hasActiveFilters = hasSearch || hasStatusFilter;

  const filteredOrders = useMemo(() => {
    const normalizedQuery = hasSearch ? normalizeSearchText(searchTerm) : "";
    const phoneQuery = hasSearch ? onlyDigits(searchTerm) : "";

    return orders.filter((order) => {
      if (hasStatusFilter && order.status !== statusFilter) {
        return false;
      }

      if (!hasSearch) return true;

      const matchesName =
        normalizedQuery.length > 0 &&
        normalizeSearchText(order.costumerName).includes(normalizedQuery);

      const matchesPhone =
        phoneQuery.length > 0 &&
        onlyDigits(order.costumerPhone).includes(phoneQuery);

      return matchesName || matchesPhone;
    });
  }, [hasSearch, hasStatusFilter, orders, searchTerm, statusFilter]);

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
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    isLoading: isPending,
    error,
    refetch,
    selectedOrder,
    openOrderDetail,
    closeOrderDetail,
    deliveryFee,
  }
}
