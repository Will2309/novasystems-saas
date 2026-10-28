import { NextRequest, NextResponse } from 'next/server';
import { TeamService } from '@/services/teamService';
import { sanitizeString } from '@/lib/sanitize';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await TeamService.getById(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Profesional no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error('[API Team ID GET Error]:', error);
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

    const updates: Record<string, unknown> = {};
    if (body.name) updates.name = sanitizeString(body.name);
    if (body.role) updates.role = sanitizeString(body.role);
    if (body.team) updates.team = body.team === 'qa' ? 'qa' : 'dev';
    if (body.avatarUrl) updates.avatarUrl = body.avatarUrl;
    if (body.bio) updates.bio = sanitizeString(body.bio);
    if (body.experienceYears) updates.experienceYears = Number(body.experienceYears);
    if (body.highlightMetric) updates.highlightMetric = sanitizeString(body.highlightMetric);
    if (Array.isArray(body.specialties)) {
      updates.specialties = body.specialties.map((s: string) => sanitizeString(s));
    }

    const updated = await TeamService.update(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Profesional no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API Team PUT Error]:', error);
    return NextResponse.json({ success: false, error: 'Error actualizando profesional' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await TeamService.delete(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'No se pudo eliminar el profesional' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Profesional eliminado con éxito' });
  } catch (error) {
    console.error('[API Team DELETE Error]:', error);
    return NextResponse.json({ success: false, error: 'Error eliminando profesional' }, { status: 500 });
  }
}
