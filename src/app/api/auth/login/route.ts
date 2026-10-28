import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { OtpService } from '@/services/otpService';
import { AuthUsersService } from '@/services/authUsersService';

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
    const cleanInputEmail = (email || '').trim().toLowerCase();

    // 1. Authenticate against registered multi-user administrative accounts
    const authenticatedUser = await AuthUsersService.authenticate(cleanInputEmail, password);

    // 2. Also support direct fallback from environment variables
    const expectedEnvEmail = (process.env.ADMIN_EMAIL || 'willja960@gmail.com').trim().toLowerCase();
    const expectedEnvPassword = process.env.ADMIN_PASSWORD || 'NovaEnterprise2026!';

    const isEnvAdmin = cleanInputEmail === expectedEnvEmail && password === expectedEnvPassword;

    if (authenticatedUser || isEnvAdmin) {
      const targetEmail = authenticatedUser ? authenticatedUser.email : cleanInputEmail;

      // Step 1 Success: Generate OTP and send strictly to that specific user's email inbox
      const { tempToken, maskedEmail, emailSent } = await OtpService.generateAndSendOTP(
        targetEmail,
        userAgent,
        ip
      );

      return NextResponse.json({
        success: true,
        requires2FA: true,
        tempToken,
        maskedEmail,
        emailSent,
        userRole: authenticatedUser?.role || 'SuperAdmin',
        userName: authenticatedUser?.name || 'Will (SuperAdmin)',
        message: `Código de seguridad confidencial enviado a ${maskedEmail}. Válido por 10 minutos.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Credenciales administrativas incorrectas o cuenta inactiva' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API Auth Login Error]:', error);
    return NextResponse.json({ success: false, error: 'Error del servidor de autenticación' }, { status: 500 });
  }
}
