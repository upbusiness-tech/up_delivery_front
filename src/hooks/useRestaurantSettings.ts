import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "../api/services/settings.service";
import type { Restaurant } from "../types/Restaurant.type";
import type { RestaurantSettingUsage } from "../types/Settings.type";
import { isOrderModeCutoffReached } from "../utils/restaurant/orderModeAvailability";
import { queryKeys } from "./queries/queryKeys";

type ResolvedSettings = Record<string, Record<string, boolean>>;
type OrderModeSchedule = Pick<
  Restaurant,
  "deliveryCutoffTime" | "pickupCutoffTime"
>;

/** Reavalia o corte automático sem gerar requisições. */
const CUTOFF_REFRESH_INTERVAL = 30_000;

export function useRestaurantSettings(
  restaurantId: string,
  modeSchedule?: OrderModeSchedule,
) {
  const [now, setNow] = useState(() => new Date());
  const queryClient = useQueryClient();
  const queryKey = queryKeys.settings.byRestaurant(restaurantId);

  const {
    data: settings = [],
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => SettingsService.getSettings(restaurantId),
    enabled: Boolean(restaurantId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const hasCutoff = Boolean(
    modeSchedule?.deliveryCutoffTime || modeSchedule?.pickupCutoffTime,
  );

  useEffect(() => {
    if (!hasCutoff) return;

    const refresh = () => setNow(new Date());
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    refresh();
    const intervalId = window.setInterval(refresh, CUTOFF_REFRESH_INTERVAL);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [hasCutoff]);

  const toggleSettingMutation = useMutation({
    mutationFn: (usageId: string) => SettingsService.toggleActive(usageId),
    onMutate: async (usageId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousSettings =
        queryClient.getQueryData<RestaurantSettingUsage[]>(queryKey);

      queryClient.setQueryData<RestaurantSettingUsage[]>(
        queryKey,
        (currentSettings) =>
          currentSettings?.map((usage) =>
            String(usage.id) === usageId
              ? { ...usage, isActive: !usage.isActive }
              : usage,
          ),
      );

      return { previousSettings };
    },
    onError: (_error, _usageId, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(queryKey, context.previousSettings);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  async function toggleSetting(key: string) {
    const usage = settings.find((item) => item.setting.key === key);
    if (!usage) return false;

    try {
      await toggleSettingMutation.mutateAsync(String(usage.id));
      return true;
    } catch {
      return false;
    }
  }

  const resolved = useMemo<ResolvedSettings>(
    () =>
      settings.reduce((acc, usage) => {
        const { module, key, default: defaultValue } = usage.setting;

        acc[module] = {
          ...acc[module],
          [key]: usage.isActive ?? defaultValue,
        };

        return acc;
      }, {} as ResolvedSettings),
    [settings],
  );

  async function togglePaymentMode(key: string, otherKey: string) {
    const current = resolved.Payment?.[key] ?? false;
    const other = resolved.Payment?.[otherKey] ?? false;

    if (current) {
      await toggleSetting(key);
      return;
    }

    if (other) {
      const toggled = await toggleSetting(otherKey);
      if (!toggled) return;
    }

    await toggleSetting(key);
  }

  const manualAllowDelivery = resolved.Restaurant?.allow_delivery ?? false;
  const manualAllowPickup = resolved.Restaurant?.allow_pickup ?? false;
  const deliveryCutoffReached = isOrderModeCutoffReached(
    modeSchedule?.deliveryCutoffTime,
    now,
  );
  const pickupCutoffReached = isOrderModeCutoffReached(
    modeSchedule?.pickupCutoffTime,
    now,
  );

  return {
    settings,
    resolved,
    // Permissões manuais, usadas na tela de configurações.
    manualAllowDelivery,
    manualAllowPickup,
    // Disponibilidade efetiva, usada pelo cardápio/checkout: a modalidade
    // precisa estar permitida e o corte automático do dia não pode ter chegado.
    allowDelivery: manualAllowDelivery && !deliveryCutoffReached,
    allowPickup: manualAllowPickup && !pickupCutoffReached,
    deliveryCutoffReached,
    pickupCutoffReached,
    deliveryCutoffTime: modeSchedule?.deliveryCutoffTime ?? null,
    pickupCutoffTime: modeSchedule?.pickupCutoffTime ?? null,
    separetePayments: resolved.Payment?.separete_payments ?? false,
    paymentsPlatform: resolved.Payment?.payments_via_the_platform ?? false,
    allowPixPayment: resolved.Payment?.allow_pix_payment ?? false,
    allowCardPayment: resolved.Payment?.allow_card_payment ?? false,
    loading: isPending && Boolean(restaurantId),
    error,
    isToggling: toggleSettingMutation.isPending,
    toggleSetting,
    refetch,
    togglePaymentMode,
  };
}
