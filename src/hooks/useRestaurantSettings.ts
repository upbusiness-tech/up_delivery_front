import { useEffect, useState, useMemo } from 'react'
import { SettingsService } from '../api/services/settings.service';

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
    default: boolean
  }
}

type ResolvedSettings = Record<string, Record<string, boolean>>;

export function useRestaurantSettings(restaurantId: string) {
  const [settings, setSettings] = useState<RestaurantSettingUsage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSettings() }, [restaurantId])

  //Retorna as configs do restaurant
  async function fetchSettings() {
    setLoading(true)
    const res = await SettingsService.getSettings(restaurantId)
    if (!res) return;
    setSettings(res.data)
    console.log(res)
    setLoading(false)
  }

  async function toggleSetting(key: string) {
    const usage = settings.find((s) => s.setting.key === key);
    if (!usage) return;
    console.log(usage.id)
    await SettingsService.toggleActive(String(usage.id));
    await fetchSettings();
  }

  async function togglePaymentMode(key: string, otherKey: string) {
    const current = resolved.Payment?.[key] ?? false;
    const other = resolved.Payment?.[otherKey] ?? false;
    if (!current && other) await toggleSetting(otherKey);
    await toggleSetting(key);
  }

  const resolved = useMemo<ResolvedSettings>(() => settings.reduce((acc, usage) => {
    const { module, key, default: defaultValue } = usage.setting;
    acc[module] = { ...acc[module], [key]: usage.isActive ?? defaultValue };
    return acc;
  }, {} as ResolvedSettings), [settings]);

  const allowDelivery = resolved.Restaurant?.allow_delivery ?? false;
  const allowPickup = resolved.Restaurant?.allow_pickup ?? false;
  const separetePayments = resolved.Payment?.separete_payments ?? false;
  const paymentsPlatform = resolved.Payment?.payments_via_the_platform ?? false;
  const allowPixPayment = resolved.Payment?.allow_pix_payment ?? false;
  const allowCardPayment = resolved.Payment?.allow_card_payment ?? false;

  return {
    settings, resolved, allowDelivery, allowPickup,
    separetePayments, paymentsPlatform, allowCardPayment, allowPixPayment,
    loading, toggleSetting, refetch: fetchSettings, togglePaymentMode
  }
}