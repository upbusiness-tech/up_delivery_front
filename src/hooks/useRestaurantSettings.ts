import { useEffect, useState, useMemo } from 'react'
import api from '../api/axios';

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

  async function fetchSettings() {
    setLoading(true)
    const res = await api.get(`/restaurant-setting-usage/${restaurantId}/restaurant`)
    setSettings(res.data)
    setLoading(false)
  }

  const resolved = useMemo<ResolvedSettings>(() => settings.reduce((acc, usage) => {
    const { module, key, default: defaultValue } = usage.setting;
    acc[module] = { ...acc[module], [key]: usage.isActive ?? defaultValue };
    return acc;
  }, {} as ResolvedSettings), [settings]);

  const allowDelivery = resolved.Restaurant?.allow_delivery ?? false;
  const allowPickup = resolved.Restaurant?.allow_pickup ?? false;
  const separetePayments = resolved.Restaurant?.separete_payments ?? false;
  const paymentsPlatform = resolved.Restaurant?.payments_via_the_platform ?? false;
  const allowPixPayment = resolved.Restaurant?.allow_pix_payment ?? false;
  const allowCardPayment = resolved.Restaurant?.allow_card_payment ?? false;

  return { 
    settings, resolved, allowDelivery, allowPickup, 
    separetePayments, paymentsPlatform, allowCardPayment, allowPixPayment,  
    loading, refetch: fetchSettings 
  }
}