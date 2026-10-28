import { NextRequest, NextResponse } from 'next/server';
import { AuthUsersService } from '@/services/authUsersService';
import { sanitizeObject, sanitizeString } from '@/lib/sanitize';

export async function GET() {
  try {
    const users = await AuthUsersService.getAll();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('[API Users GET Error]:', error);
    return NextResponse.json({ success: false, error: 'Error obteniendo usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sanitized = sanitizeObject(body);

    const name = sanitizeString(sanitized.name as string);
    const email = sanitizeString(sanitized.email as string);
    const role = (sanitized.role as string) || 'Admin';
    const password = sanitized.password as string | undefined;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y correo electrónico son requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de correo electrónico inválido' },
        { status: 400 }
      );
    }

    const created = await AuthUsersService.create({
      name,
      email,
      role: role as 'SuperAdmin' | 'Admin' | 'Ventas' | 'Soporte',
      password,
    });

    return NextResponse.json({ success: true, data: created, message: 'Usuario administrativo registrado exitosamente' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creando usuario';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
