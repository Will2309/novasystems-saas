import { NextRequest, NextResponse } from 'next/server';
import { SystemsService } from '@/services/systemsService';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`demo-track:${ip}`, { maxRequests: 60, intervalMs: 60000 });

    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { systemId } = body;

    if (!systemId) {
      return NextResponse.json({ success: false, error: 'systemId es requerido' }, { status: 400 });
    }

    const newViews = await SystemsService.incrementDemoClick(systemId);
    if (newViews === null) {
      return NextResponse.json({ success: false, error: 'Sistema no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, demoViews: newViews });
  } catch (error) {
    console.error('[API Demo Track Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
