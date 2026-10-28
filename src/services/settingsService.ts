import { PlatformSettings, CurrencyCode } from '@/types';

let currentSettings: PlatformSettings = {
  currency: 'USD',
  updatedAt: new Date().toISOString(),
};

export const SettingsService = {
  async getSettings(): Promise<PlatformSettings> {
    return { ...currentSettings };
  },

  async updateCurrency(currency: CurrencyCode): Promise<PlatformSettings> {
    currentSettings = {
      ...currentSettings,
      currency,
      updatedAt: new Date().toISOString(),
    };
    return { ...currentSettings };
  },
};
