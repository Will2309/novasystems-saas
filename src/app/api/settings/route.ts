import { NextRequest, NextResponse } from 'next/server';
import { SettingsService } from '@/services/settingsService';
import { CurrencyCode } from '@/types';

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
    const { currency } = body;

    const validCurrencies: CurrencyCode[] = ['USD', 'EUR', 'MXN', 'PEN', 'COP'];
    if (!currency || !validCurrencies.includes(currency)) {
      return NextResponse.json(
        { success: false, error: 'Moneda no soportada. Use USD, EUR, MXN, PEN o COP.' },
        { status: 400 }
      );
    }

    const updated = await SettingsService.updateCurrency(currency);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API Settings PATCH Error]:', error);
    return NextResponse.json({ success: false, error: 'Error actualizando configuración' }, { status: 500 });
  }
}
