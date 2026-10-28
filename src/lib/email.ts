import { LeadInquiry } from '@/types';

interface EmailResult {
  sent: boolean;
  id?: string;
  reason?: string;
}

interface Send2FAOptions {
  toEmail: string;
  otpCode: string;
  expiresInMinutes?: number;
  ipAddress?: string;
  userAgent?: string;
}

export const EmailService = {
  /**
   * Dispatches an email using the Resend REST API (Zero external npm dependencies)
   * Falls back to logging if RESEND_API_KEY is not configured yet.
   */
  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string | string[];
    subject: string;
    html: string;
  }): Promise<EmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'NovaSystems <onboarding@resend.dev>';

    // If no API key configured, log to console for development
    if (!apiKey) {
      console.warn('[EmailService] RESEND_API_KEY no detectada. Modo emulado activo.');
      console.log(`[EmailService DEV LOG] To: ${Array.isArray(to) ? to.join(', ') : to} | Asunto: "${subject}"`);
      return { sent: false, reason: 'RESEND_API_KEY no configurada en las variables de entorno (.env)' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[EmailService Resend API Error]:', data);
        return { sent: false, reason: data.message || 'Error al conectar con la API de Resend' };
      }

      console.log('[EmailService] Correo enviado exitosamente con ID:', data.id);
      return { sent: true, id: data.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('[EmailService Network Error]:', message);
      return { sent: false, reason: message };
    }
  },

  /**
   * 1. Send Security OTP Code for 2-Factor Authentication (Admin Login)
   */
  async send2FAOtpEmail({
    toEmail,
    otpCode,
    expiresInMinutes = 10,
    ipAddress = '127.0.0.1',
    userAgent = 'Navegador Web',
  }: Send2FAOptions): Promise<EmailResult> {
    const subject = `🔒 Tu código de acceso 2FA a NovaSystems: ${otpCode}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1320; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b1320; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #0f172a; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Gradient Border -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #38bdf8 0%, #3b82f6 50%, #10b981 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 35px 35px 20px 35px; text-align: center;">
              <div style="display: inline-block; padding: 12px 20px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; margin-bottom: 16px;">
                <span style="color: #38bdf8; font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">ACCESO SEGURO • 2FA</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Verificación de Seguridad</h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 20px;">
                Se ha solicitado el acceso al Panel Administrativo de NovaSystems Pro.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td style="padding: 10px 35px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #080f1d; border: 1px dashed #38bdf8; border-radius: 16px; padding: 25px; text-align: center;">
                <tr>
                  <td>
                    <span style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">CÓDIGO DE ACCESO ÚNICO (OTP)</span>
                    <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #10b981; font-family: 'Courier New', Courier, monospace; margin: 15px 0 10px 12px;">
                      ${otpCode}
                    </div>
                    <span style="display: inline-block; font-size: 13px; color: #f59e0b; font-weight: 600;">
                      ⏱ Expira en ${expiresInMinutes} minutos • 1 solo uso
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Details -->
          <tr>
            <td style="padding: 25px 35px;">
              <div style="background-color: #131d31; border-radius: 12px; padding: 16px; border: 1px solid #1e293b;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12px; color: #94a3b8;">
                  <tr>
                    <td style="padding-bottom: 6px;"><strong>Cuenta destino:</strong></td>
                    <td align="right" style="color: #f1f5f9; padding-bottom: 6px;">${toEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 6px;"><strong>Dirección IP:</strong></td>
                    <td align="right" style="color: #f1f5f9; padding-bottom: 6px;">${ipAddress}</td>
                  </tr>
                  <tr>
                    <td><strong>Dispositivo:</strong></td>
                    <td align="right" style="color: #f1f5f9;">${userAgent.substring(0, 32)}</td>
                  </tr>
                </table>
              </div>
              <p style="margin: 16px 0 0 0; color: #64748b; font-size: 12px; line-height: 18px; text-align: center;">
                Si tú no solicitaste este acceso, tu contraseña puede haber sido comprometida. Te recomendamos cambiarla de inmediato.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 35px 30px 35px; border-top: 1px solid #1e293b; text-align: center; background-color: #0b121f;">
              <p style="margin: 0; color: #475569; font-size: 11px;">
                © 2026 NovaSystems Pro • Plataforma Corporativa de Software Preconstruido.<br>
                Seguridad perimetral Cloudflare WAF & Tokenización JWT HttpOnly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({ to: toEmail, subject, html });
  },

  /**
   * 2. Send Real-Time Alert to Admin when a new Lead requests a Demo / Quotation
   */
  async sendLeadAdminAlert(lead: LeadInquiry): Promise<EmailResult> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@novasystems.io';
    const subject = `🔥 Nuevo Lead: ${lead.fullName} (${lead.systemTitle || lead.systemId})`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0b1320; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; padding: 30px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
    
    <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 15px; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #38bdf8; font-size: 20px;">🚀 Solicitud de Cotización / Demo</h2>
      <p style="margin: 5px 0 0; color: #94a3b8; font-size: 13px;">Registrado el ${new Date(lead.createdAt).toLocaleString('es-ES')}</p>
    </div>

    <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px; margin-bottom: 20px; color: #cbd5e1;">
      <tr style="background: #1e293b;">
        <td width="35%"><strong>Cliente:</strong></td>
        <td><strong style="color: #ffffff;">${lead.fullName}</strong></td>
      </tr>
      <tr>
        <td><strong>Empresa:</strong></td>
        <td>${lead.companyName || 'No especificada'}</td>
      </tr>
      <tr style="background: #1e293b;">
        <td><strong>Email:</strong></td>
        <td><a href="mailto:${lead.email}" style="color: #38bdf8;">${lead.email}</a></td>
      </tr>
      <tr>
        <td><strong>Teléfono:</strong></td>
        <td><a href="tel:${lead.phone}" style="color: #10b981;">${lead.phone}</a></td>
      </tr>
      <tr style="background: #1e293b;">
        <td><strong>Sistema Interés:</strong></td>
        <td><span style="background: #0284c7; color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 12px;">${lead.systemTitle || lead.systemId}</span></td>
      </tr>
    </table>

    <div style="background: #1e293b; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
      <strong style="display: block; font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Mensaje del Cliente:</strong>
      <p style="margin: 0; font-size: 14px; color: #f1f5f9; line-height: 1.5;">${lead.message}</p>
    </div>

    <div style="text-align: center;">
      <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(lead.fullName)},%20te%20contacto%20de%20NovaSystems%20respecto%20a%20tu%20solicitud%20del%20sistema%20${encodeURIComponent(lead.systemTitle || '')}" 
         style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 25px; border-radius: 10px; margin-right: 10px;">
        Contactar por WhatsApp
      </a>
      <a href="mailto:${lead.email}?subject=Cotización%20${encodeURIComponent(lead.systemTitle || 'NovaSystems')}" 
         style="display: inline-block; background: #38bdf8; color: #0f172a; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 25px; border-radius: 10px;">
        Responder por Email
      </a>
    </div>

  </div>
</body>
</html>
    `;

    return this.sendEmail({ to: adminEmail, subject, html });
  },

  /**
   * 3. Send Confirmation Email to Client
   */
  async sendLeadClientConfirmation(lead: LeadInquiry): Promise<EmailResult> {
    const subject = `Confirmación de solicitud: Demo ${lead.systemTitle || 'NovaSystems Pro'}`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 20px; background-color: #0b1320; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc;">
  <div style="max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid #1e293b; padding: 30px;">
    <h2 style="color: #38bdf8; margin-top: 0;">¡Hola ${lead.fullName}!</h2>
    <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">
      Hemos recibido con éxito tu solicitud de información y credenciales de demo para el sistema <strong>${lead.systemTitle || 'solicitado'}</strong>.
    </p>
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
      Uno de nuestros ingenieros de soluciones revisará los requerimientos de tu negocio y te responderá en menos de 2 horas hábiles con la propuesta comercial y el acceso guiado a la demo en vivo.
    </p>
    <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #94a3b8;">
      <strong>¿Necesitas atención inmediata?</strong><br>
      Puedes comunicarte directamente con nuestra mesa técnica vía WhatsApp haciendo clic a continuación.
    </div>
    <div style="text-align: center; margin-top: 25px;">
      <a href="https://wa.me/51999999999?text=Hola,%20acabo%20de%20solicitar%20la%20demo%20del%20sistema%20${encodeURIComponent(lead.systemTitle || '')}" 
         style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
        Chatear con un Asesor Técnico
      </a>
    </div>
    <p style="font-size: 11px; color: #475569; text-align: center; margin-top: 30px;">
      © 2026 NovaSystems Pro • Sistemas de alto impacto listos para desplegar.
    </p>
  </div>
</body>
</html>
    `;

    return this.sendEmail({ to: lead.email, subject, html });
  }
};
