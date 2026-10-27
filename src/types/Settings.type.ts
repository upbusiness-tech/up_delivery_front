export interface RestaurantSettingUsage {
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
}
