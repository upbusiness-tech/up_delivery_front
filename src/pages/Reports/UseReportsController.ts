import { useEffect, useMemo, useState } from "react";
import { useOrderReports } from "../../hooks/queries/useOrdersQueries";
import type {
  OrderReportFilters,
  OrderReportSummary,
} from "../../types/Report.type";

type ReportFilterState = {
  startDate: string;
  endDate: string;
  paymentMethod: string;
  type: "" | "delivery" | "pickup";
  status: string;
};

const EMPTY_SUMMARY: OrderReportSummary = {
  totalOrders: 0,
  totalRevenue: 0,
  averageTicket: 0,
  deliveryOrders: 0,
  pickupOrders: 0,
  paymentMethods: [],
};

function toDateInput(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getInitialFilters(): ReportFilterState {
  const today = new Date();
  return {
    startDate: toDateInput(addDays(today, -29)),
    endDate: toDateInput(today),
    paymentMethod: "",
    type: "",
    status: "",
  };
}

function formatPeriodDate(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export default function UseReportsController() {
  const [filters, setFilters] = useState<ReportFilterState>(getInitialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tab, setTab] = useState(0);
  const [productPage, setProductPage] = useState(0);
  const [productRowsPerPage, setProductRowsPerPage] = useState(10);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
      setProductPage(0);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const queryFilters = useMemo<OrderReportFilters>(
    () => ({
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      paymentMethod: filters.paymentMethod || undefined,
      type: filters.type || undefined,
      status: filters.status || undefined,
      search: search || undefined,
      page: page + 1,
      limit: rowsPerPage,
      sort: "desc",
    }),
    [filters, page, rowsPerPage, search],
  );

  const { data, isFetching, error, refetch } = useOrderReports(queryFilters);

  const orders = data?.orders ?? [];
  const products = data?.products ?? [];
  const summary = data?.summary ?? EMPTY_SUMMARY;
  const totalOrders = data?.pagination.total ?? 0;

  const safeProductPage = Math.min(
    productPage,
    Math.max(0, Math.ceil(products.length / productRowsPerPage) - 1),
  );
  const visibleProducts = products.slice(
    safeProductPage * productRowsPerPage,
    safeProductPage * productRowsPerPage + productRowsPerPage,
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.paymentMethod) count += 1;
    if (filters.type) count += 1;
    if (filters.status) count += 1;
    if (search) count += 1;
    return count;
  }, [filters.paymentMethod, filters.type, filters.status, search]);

  const periodLabel = `${formatPeriodDate(filters.startDate)} a ${formatPeriodDate(filters.endDate)}`;

  function updateFilter<K extends keyof ReportFilterState>(
    key: K,
    value: ReportFilterState[K],
  ) {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(0);
    setProductPage(0);
  }

  function resetFilters() {
    setFilters(getInitialFilters());
    setSearchInput("");
    setSearch("");
    setPage(0);
    setProductPage(0);
  }

  function handleRowsPerPageChange(value: number) {
    setRowsPerPage(value);
    setPage(0);
  }

  function handleProductRowsPerPageChange(value: number) {
    setProductRowsPerPage(value);
    setProductPage(0);
  }

  return {
    filters,
    updateFilter,
    filtersOpen,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
    activeFilterCount,
    periodLabel,
    searchInput,
    setSearchInput,
    resetFilters,
    page,
    setPage,
    rowsPerPage,
    handleRowsPerPageChange,
    tab,
    setTab,
    productPage: safeProductPage,
    setProductPage,
    productRowsPerPage,
    handleProductRowsPerPageChange,
    orders,
    products,
    visibleProducts,
    summary,
    totalOrders,
    isFetching,
    error,
    refetch,
  };
}
