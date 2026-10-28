import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { OtpService } from '@/services/otpService';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';
    
    // Strict rate limiter for admin login: max 5 attempts per 5 minutes per IP
    const rateCheck = checkRateLimit(`admin-login:${ip}`, { maxRequests: 5, intervalMs: 300000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: `Demasiados intentos. Bloqueado temporalmente por ${rateCheck.resetInSec} segundos.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Configured admin credentials (reads from .env or defaults)
    const expectedAdminEmail = (process.env.ADMIN_EMAIL || 'admin@novasystems.io').trim().toLowerCase();
    const expectedAdminPassword = process.env.ADMIN_PASSWORD || 'NovaEnterprise2026!';

    const cleanInputEmail = (email || '').trim().toLowerCase();

    if (cleanInputEmail === expectedAdminEmail && password === expectedAdminPassword) {
      // Step 1 Success: Generate OTP and send strictly to the email inbox
      const { tempToken, maskedEmail, emailSent } = await OtpService.generateAndSendOTP(
        cleanInputEmail,
        userAgent,
        ip
      );

      // SECURITY RULE: Never return the OTP code in the network/JSON response
      return NextResponse.json({
        success: true,
        requires2FA: true,
        tempToken,
        maskedEmail,
        emailSent,
        message: `Código de seguridad confidencial enviado a ${maskedEmail}. Válido por 10 minutos.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Credenciales administrativas incorrectas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API Auth Login Error]:', error);
    return NextResponse.json({ success: false, error: 'Error del servidor de autenticación' }, { status: 500 });
  }
}
