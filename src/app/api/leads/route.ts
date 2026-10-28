import { NextRequest, NextResponse } from 'next/server';
import { LeadsService } from '@/services/leadsService';
import { sanitizeObject, sanitizeString } from '@/lib/sanitize';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const leads = await LeadsService.getAll();
    const metrics = await LeadsService.getAdminMetrics();
    return NextResponse.json({ success: true, data: leads, metrics });
  } catch (error) {
    console.error('[API Leads GET Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Strict rate limit for contact forms: max 5 requests per 10 minutes per IP
    const rateCheck = checkRateLimit(`lead-submit:${ip}`, { maxRequests: 5, intervalMs: 600000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Has superado el límite de envíos. Por favor espera ${rateCheck.resetInSec} segundos o comunícate vía WhatsApp.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body);

    const fullName = sanitizeString(sanitized.fullName as string);
    const email = sanitizeString(sanitized.email as string);
    const phone = sanitizeString(sanitized.phone as string);
    const companyName = sanitizeString((sanitized.companyName as string) || '');
    const systemId = sanitizeString(sanitized.systemId as string);
    const systemTitle = sanitizeString((sanitized.systemTitle as string) || '');
    const message = sanitizeString(sanitized.message as string);

    // Strict email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Por favor complete todos los campos obligatorios.' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'El formato de correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    const created = await LeadsService.create({
      fullName,
      email,
      phone,
      companyName,
      systemId,
      systemTitle,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: '¡Solicitud recibida! Un arquitecto de soluciones se comunicará contigo en breve.',
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API Leads POST Error]:', error);
    return NextResponse.json({ success: false, error: 'Error procesando tu solicitud.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID y estado son requeridos' }, { status: 400 });
    }

    const updated = await LeadsService.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API Leads PATCH Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
