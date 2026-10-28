import { NextRequest, NextResponse } from 'next/server';
import { SystemsService } from '@/services/systemsService';
import { sanitizeObject } from '@/lib/sanitize';
import { IndustryCategory } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as IndustryCategory | null;
    const query = searchParams.get('q') || undefined;

    const systems = await SystemsService.getAll(category || 'Todos', query);
    return NextResponse.json({ success: true, data: systems });
  } catch (error) {
    console.error('[API Systems GET Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check mock admin token / cookie for basic guard
    const authHeader = request.headers.get('authorization');
    if (!authHeader && !request.cookies.get('nova_admin_token')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const sanitized = sanitizeObject(body);

    if (!sanitized.title || !sanitized.category || !sanitized.description) {
      return NextResponse.json(
        { success: false, error: 'Título, categoría y descripción son obligatorios' },
        { status: 400 }
      );
    }

    const created = await SystemsService.create({
      slug: sanitized.slug || sanitized.title.toLowerCase().replace(/\s+/g, '-'),
      title: sanitized.title,
      tagline: sanitized.tagline || '',
      category: sanitized.category as IndustryCategory,
      targetBusiness: sanitized.targetBusiness || '',
      description: sanitized.description,
      priceUSD: Number(sanitized.priceUSD) || 1200,
      licenseType: sanitized.licenseType || 'Llave en Mano (Código Fuente)',
      techStack: Array.isArray(sanitized.techStack) ? sanitized.techStack : ['Node.js', 'React', 'PostgreSQL'],
      modules: Array.isArray(sanitized.modules) ? sanitized.modules : ['Ventas', 'Inventario'],
      features: Array.isArray(sanitized.features) ? sanitized.features : ['Responsive', 'Seguro'],
      demoUrl: sanitized.demoUrl || 'https://demo.novasystems.io/preview',
      demoCredentials: sanitized.demoCredentials || [
        { role: 'Administrador', email: 'admin@demo.com', pass: 'Admin2026!' },
      ],
      screenshotUrl: sanitized.screenshotUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      featured: Boolean(sanitized.featured),
      active: true,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[API Systems POST Error]:', error);
    return NextResponse.json({ success: false, error: 'Error procesando solicitud' }, { status: 500 });
  }
}
