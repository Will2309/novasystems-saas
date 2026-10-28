import { NextRequest, NextResponse } from 'next/server';
import { SettingsService } from '@/services/settingsService';
import { CurrencyCode, PlatformSettings } from '@/types';
import { sanitizeString } from '@/lib/sanitize';

export async function GET() {
  try {
    const settings = await SettingsService.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('[API Settings GET Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const updates: Partial<PlatformSettings> = {};

    if (body.currency) {
      const validCurrencies: CurrencyCode[] = ['USD', 'EUR', 'MXN', 'PEN', 'COP'];
      if (!validCurrencies.includes(body.currency)) {
        return NextResponse.json(
          { success: false, error: 'Moneda no soportada. Use USD, EUR, MXN, PEN o COP.' },
          { status: 400 }
        );
      }
      updates.currency = body.currency;
    }

    if (typeof body.companyName === 'string') {
      updates.companyName = sanitizeString(body.companyName) || 'NovaSystems';
    }

    if (typeof body.companyTagline === 'string') {
      updates.companyTagline = sanitizeString(body.companyTagline);
    }

    if (typeof body.logoUrl === 'string') {
      updates.logoUrl = body.logoUrl.trim();
    }

    const updated = await SettingsService.updateSettings(updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API Settings PATCH Error]:', error);
    return NextResponse.json({ success: false, error: 'Error actualizando configuración' }, { status: 500 });
  }
}
