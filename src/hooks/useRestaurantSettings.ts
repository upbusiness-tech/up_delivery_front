import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "../api/services/settings.service";
import type { RestaurantSettingUsage } from "../types/Settings.type";
import { queryKeys } from "./queries/queryKeys";

type ResolvedSettings = Record<string, Record<string, boolean>>;

export function useRestaurantSettings(restaurantId: string) {
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

  return {
    settings,
    resolved,
    allowDelivery: resolved.Restaurant?.allow_delivery ?? false,
    allowPickup: resolved.Restaurant?.allow_pickup ?? false,
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
