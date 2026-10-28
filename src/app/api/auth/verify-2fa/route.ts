import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tempToken, totpCode } = await request.json();

    if (!tempToken) {
      return NextResponse.json({ success: false, error: 'Sesión temporal expirada' }, { status: 400 });
    }

    // Default valid TOTP code for demonstration: "849201" or any 6 digits
    // In production, verify against authenticator app secret (RFC 6238)
    if (totpCode === '849201' || totpCode === '123456') {
      const response = NextResponse.json({
        success: true,
        message: 'Acceso autorizado. Bienvenido al Panel de Control de NovaSystems.',
        admin: {
          name: 'Arquitecto Principal / SysAdmin',
          role: 'SuperAdmin',
          email: 'admin@novasystems.io',
        },
      });

      // Set HttpOnly Secure SameSite cookie
      response.cookies.set('nova_admin_token', 'jwt_sec_' + Date.now(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Código 2FA / TOTP incorrecto. Verifique su aplicación autenticadora.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API 2FA Verify Error]:', error);
    return NextResponse.json({ success: false, error: 'Error verificando 2FA' }, { status: 500 });
  }
}
