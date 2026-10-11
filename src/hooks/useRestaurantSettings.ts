import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "../api/services/settings.service";
import { QueryCacheName } from "./useRestaurantData";

type RestaurantSettingUsage = {
  id: number;
  isActive: boolean;
  restaurantId: string;
  settingId: number;
  setting: {
    id: number;
    module: string;
    key: string;
    description: string;
    default: boolean;
  };
};

type ResolvedSettings = Record<string, Record<string, boolean>>;

export function useRestaurantSettings(restaurantId: string) {
  const queryClient = useQueryClient();

  const queryKey = [QueryCacheName.SETTINGS, restaurantId];

  const {
    data: settings = [],
    isLoading,
    refetch,
  } = useQuery<RestaurantSettingUsage[]>({
    queryKey,
    queryFn: async () => {
      const res = await SettingsService.getSettings(restaurantId);
      return res?.data ?? [];
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const toggleSetting = async (key: string) => {
    const currentSettings =
      queryClient.getQueryData<RestaurantSettingUsage[]>(queryKey) ?? [];

    const usage = currentSettings.find(
      (s) => s.setting.key === key
    );

    if (!usage) return;

    try {
      await SettingsService.toggleActive(String(usage.id));

      queryClient.setQueryData<RestaurantSettingUsage[]>(
        queryKey,
        (oldSettings) =>
          oldSettings?.map((s) =>
            s.id === usage.id
              ? { ...s, isActive: !s.isActive }
              : s
          )
      );
    } catch (error) {
      console.error("Erro ao alterar configuração:", error);
      throw error;
    }
  };

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
    [settings]
  );

  const togglePaymentMode = async (
    key: string,
    otherKey: string
  ) => {
    const current = resolved.Payment?.[key] ?? false;
    const other = resolved.Payment?.[otherKey] ?? false;

    if (current) {
      await toggleSetting(key);
      return;
    }

    if (other) {
      await toggleSetting(otherKey);
    }

    await toggleSetting(key);
  };

  return {
    settings,
    resolved,
    allowDelivery: resolved.Restaurant?.allow_delivery ?? false,
    allowPickup: resolved.Restaurant?.allow_pickup ?? false,
    separetePayments: resolved.Payment?.separete_payments ?? false,
    paymentsPlatform: resolved.Payment?.payments_via_the_platform ?? false,
    allowPixPayment: resolved.Payment?.allow_pix_payment ?? false,
    allowCardPayment: resolved.Payment?.allow_card_payment ?? false,
    loading: isLoading,
    toggleSetting,
    refetch: () => refetch(),
    togglePaymentMode,
  };
}
