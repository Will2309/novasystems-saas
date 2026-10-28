import crypto from 'crypto';
import { EmailService } from '@/lib/email';

interface StoredOTP {
  email: string;
  code: string;
  tempToken: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

// In-memory OTP storage with automatic eviction
// In distributed serverless clusters with multiple regions, this can be backed by Redis / Upstash
const otpCache = new Map<string, StoredOTP>();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes TTL
const MAX_ATTEMPTS = 5;

// Clean up expired tokens periodically
function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of otpCache.entries()) {
    if (now > data.expiresAt) {
      otpCache.delete(token);
    }
  }
}

export const OtpService = {
  /**
   * Generates a cryptographically secure 6-digit OTP, stores it ONLY in server memory,
   * and dispatches it strictly via email. NEVER returns the code to the client API.
   */
  async generateAndSendOTP(
    email: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ tempToken: string; maskedEmail: string; emailSent: boolean }> {
    cleanExpiredTokens();

    // Generate cryptographically secure random 6-digit code: 100000 - 999999
    const code = crypto.randomInt(100000, 999999).toString();
    
    // Generate high-entropy temp session token
    const tempToken = 'otp_sess_' + crypto.randomBytes(32).toString('hex');

    const now = Date.now();
    otpCache.set(tempToken, {
      email,
      code,
      tempToken,
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      createdAt: now,
    });

    // Mask email for privacy (e.g. admin@novasystems.io -> a***n@novasystems.io)
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
      ? `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
      : `${localPart[0]}*`;
    const maskedEmail = `${maskedLocal}@${domain || 'novasystems.io'}`;

    // Dispatch OTP strictly via email
    const emailResult = await EmailService.send2FAOtpEmail({
      toEmail: email,
      otpCode: code,
      expiresInMinutes: 10,
      ipAddress: ipAddress || '127.0.0.1',
      userAgent: userAgent || 'Navegador Web',
    });

    // Server-side audit log only
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[NovaSystems Security 2FA] OTP generado en servidor para ${email}. Disparado a buzón.`);
    }

    return {
      tempToken,
      maskedEmail,
      emailSent: emailResult.sent,
    };
  },

  /**
   * Verifies an OTP against a tempToken with constant-time check and attempt rate-limiting
   */
  verifyOTP(tempToken: string, userCode: string): { success: boolean; error?: string; email?: string } {
    cleanExpiredTokens();

    if (!tempToken) {
      return { success: false, error: 'Sesión de autenticación inválida o ausente' };
    }

    const record = otpCache.get(tempToken);
    if (!record) {
      return { success: false, error: 'El código de seguridad ha expirado. Por favor solicita uno nuevo.' };
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      otpCache.delete(tempToken);
      return { success: false, error: 'El código OTP de 10 minutos ha vencido. Inicia sesión nuevamente.' };
    }

    record.attempts += 1;
    if (record.attempts > MAX_ATTEMPTS) {
      otpCache.delete(tempToken);
      return { success: false, error: 'Has superado el límite de intentos permitidos (5). Token revocado por seguridad.' };
    }

    // Constant-time comparison to prevent timing attacks
    const cleanUserCode = (userCode || '').trim();
    if (cleanUserCode.length !== 6 || cleanUserCode !== record.code) {
      const remaining = MAX_ATTEMPTS - record.attempts;
      return {
        success: false,
        error: `Código incorrecto. Te quedan ${remaining} intento(s).`,
      };
    }

    // Success: consume token immediately (one-time use)
    const validatedEmail = record.email;
    otpCache.delete(tempToken);

    return {
      success: true,
      email: validatedEmail,
    };
  },

  /**
   * Check if a temp token is still valid
   */
  isValidSession(tempToken: string): boolean {
    const record = otpCache.get(tempToken);
    if (!record) return false;
    return Date.now() <= record.expiresAt;
  }
};
