import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Strict rate limiter for admin login: max 5 attempts per 5 minutes
    const rateCheck = checkRateLimit(`admin-login:${ip}`, { maxRequests: 5, intervalMs: 300000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Demasiados intentos fallidos. Bloqueado temporalmente por ${rateCheck.resetInSec}s.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Default admin credentials for the demonstration environment
    // In production, compare with Argon2id / bcrypt hashed password in PostgreSQL
    if (email === 'admin@novasystems.io' && password === 'NovaEnterprise2026!') {
      // Step 1 Success: Requires Step 2 (2FA/TOTP)
      return NextResponse.json({
        success: true,
        requires2FA: true,
        tempToken: 'tmp_sess_' + Math.random().toString(36).substring(2),
        message: 'Credenciales validadas. Ingrese el código de doble factor (2FA/TOTP).',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Credenciales administrativas inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API Auth Login Error]:', error);
    return NextResponse.json({ success: false, error: 'Error del servidor de autenticación' }, { status: 500 });
  }
}
