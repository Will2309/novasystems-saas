import { PlatformSettings, CurrencyCode } from '@/types';

let currentSettings: PlatformSettings = {
  currency: 'USD',
  companyName: 'NovaSystems',
  companyTagline: 'Software Preconstruido',
  logoUrl: '',
  updatedAt: new Date().toISOString(),
};

export const SettingsService = {
  async getSettings(): Promise<PlatformSettings> {
    return { ...currentSettings };
  },

  async updateSettings(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
    currentSettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...currentSettings };
  },

  async updateCurrency(currency: CurrencyCode): Promise<PlatformSettings> {
    return this.updateSettings({ currency });
  },
};
