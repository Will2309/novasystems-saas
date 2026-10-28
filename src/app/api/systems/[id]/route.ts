import { NextRequest, NextResponse } from 'next/server';
import { SystemsService } from '@/services/systemsService';
import { sanitizeObject } from '@/lib/sanitize';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sys = await SystemsService.getById(id);
    if (!sys) {
      return NextResponse.json({ success: false, error: 'Sistema no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sys });
  } catch (error) {
    console.error('[API Systems ID GET Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const sanitized = sanitizeObject(body);

    const updated = await SystemsService.update(id, sanitized);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Sistema no encontrado para actualizar' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API Systems PUT Error]:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar sistema' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await SystemsService.delete(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'No se pudo eliminar el sistema' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Sistema eliminado con éxito' });
  } catch (error) {
    console.error('[API Systems DELETE Error]:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar sistema' }, { status: 500 });
  }
}
