import { NextRequest, NextResponse } from 'next/server';
import { TeamService } from '@/services/teamService';
import { sanitizeString } from '@/lib/sanitize';

export async function GET() {
  try {
    const team = await TeamService.getAll();
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('[API Team GET Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.role || !body.team) {
      return NextResponse.json(
        { success: false, error: 'Nombre, cargo y equipo (dev o qa) son requeridos' },
        { status: 400 }
      );
    }

    const created = await TeamService.create({
      name: sanitizeString(body.name),
      role: sanitizeString(body.role),
      team: body.team === 'qa' ? 'qa' : 'dev',
      avatarUrl: body.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: sanitizeString(body.bio || 'Ingeniero especializado en arquitecturas de software.'),
      specialties: Array.isArray(body.specialties)
        ? body.specialties.map((s: string) => sanitizeString(s))
        : ['TypeScript', 'Docker'],
      experienceYears: Number(body.experienceYears) || 5,
      highlightMetric: sanitizeString(body.highlightMetric || 'Experto en grado producción'),
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[API Team POST Error]:', error);
    return NextResponse.json({ success: false, error: 'Error agregando profesional' }, { status: 500 });
  }
}
