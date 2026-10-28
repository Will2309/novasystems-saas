import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyCode, CurrencyConfig } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'Dólares (USD)', exchangeRateFromUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euros (EUR)', exchangeRateFromUSD: 0.92 },
  MXN: { code: 'MXN', symbol: '$', name: 'Pesos Mexicanos (MXN)', exchangeRateFromUSD: 18.5 },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Soles Peruanos (PEN)', exchangeRateFromUSD: 3.75 },
  COP: { code: 'COP', symbol: '$', name: 'Pesos Colombianos (COP)', exchangeRateFromUSD: 4100 },
};

export function formatCurrency(amountUSD: number, currency: CurrencyCode = 'USD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const converted = Math.round(amountUSD * config.exchangeRateFromUSD);

  if (currency === 'PEN') {
    return `S/ ${new Intl.NumberFormat('es-PE').format(converted)}`;
  }
  if (currency === 'EUR') {
    return `${new Intl.NumberFormat('es-ES').format(converted)} €`;
  }
  if (currency === 'COP') {
    return `$ ${new Intl.NumberFormat('es-CO').format(converted)} COP`;
  }
  if (currency === 'MXN') {
    return `$ ${new Intl.NumberFormat('es-MX').format(converted)} MXN`;
  }
  return `$ ${new Intl.NumberFormat('en-US').format(converted)} USD`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function buildWhatsAppLink(phone: string, systemTitle?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const text = systemTitle
    ? `Hola equipo NovaSystems, estoy interesado en solicitar una cotización y ver la demo técnica del sistema *${systemTitle}*. ¿Podrían brindarme asesoría personalizada?`
    : `Hola equipo NovaSystems, deseo información comercial sobre su catálogo de software preconstruido y opciones de licenciamiento llave en mano.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
