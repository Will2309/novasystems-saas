import { NextRequest, NextResponse } from 'next/server';
import { OtpService } from '@/services/otpService';

export async function POST(request: NextRequest) {
  try {
    const { tempToken, totpCode } = await request.json();

    if (!tempToken) {
      return NextResponse.json(
        { success: false, error: 'Sesión temporal ausente o expirada. Vuelve a iniciar sesión.' },
        { status: 400 }
      );
    }

    if (!totpCode || typeof totpCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa el código de 6 dígitos.' },
        { status: 400 }
      );
    }

    // Verify OTP using OtpService (Cryptographic check + TTL + Max Attempts)
    const verification = OtpService.verifyOTP(tempToken, totpCode);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Código inválido o expirado' },
        { status: 401 }
      );
    }

    // Authentication Successful! Issue HttpOnly Cookie
    const response = NextResponse.json({
      success: true,
      message: 'Autenticación exitosa. Bienvenido al Panel de Control de NovaSystems.',
      admin: {
        name: 'SysAdmin / Arquitecto Principal',
        role: 'SuperAdmin',
        email: verification.email || 'admin@novasystems.io',
      },
    });

    response.cookies.set('nova_admin_token', 'jwt_sec_' + Date.now() + '_' + Math.random().toString(36).substring(2), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours active session
    });

    return response;
  } catch (error) {
    console.error('[API 2FA Verify Error]:', error);
    return NextResponse.json({ success: false, error: 'Error interno verificando código 2FA' }, { status: 500 });
  }
}
