import { NextRequest, NextResponse } from 'next/server';
import { AuthUsersService } from '@/services/authUsersService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await AuthUsersService.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error actualizando usuario';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await AuthUsersService.delete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Usuario administrativo eliminado' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error eliminando usuario';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
