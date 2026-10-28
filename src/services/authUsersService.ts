import { AdminUser } from '@/types';

// Pre-configured admin users with Will as primary SuperAdmin
let usersStore: AdminUser[] = [
  {
    id: 'user-will-superadmin',
    name: 'Will (SuperAdmin Principal)',
    email: 'willja960@gmail.com',
    role: 'SuperAdmin',
    active: true,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'user-novasystems-admin',
    name: 'Administrador NovaSystems',
    email: 'admin@novasystems.io',
    role: 'Admin',
    active: true,
    createdAt: '2026-10-15T00:00:00.000Z',
  },
];

export const AuthUsersService = {
  /**
   * Return all admin users (omitting sensitive internal password fields)
   */
  async getAll(): Promise<Omit<AdminUser, 'password'>[]> {
    return usersStore.map(({ password: _, ...safeUser }) => safeUser);
  },

  /**
   * Find an active user by email
   */
  async findByEmail(email: string): Promise<AdminUser | undefined> {
    const cleanEmail = (email || '').trim().toLowerCase();
    return usersStore.find((u) => u.email.toLowerCase() === cleanEmail && u.active);
  },

  /**
   * Authenticate an admin user by email and password
   */
  async authenticate(email: string, pass: string): Promise<AdminUser | null> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = usersStore.find((u) => u.email.toLowerCase() === cleanEmail && u.active);
    if (!user) return null;

    // Check custom user password or general master password
    const masterPass = process.env.ADMIN_PASSWORD || 'NovaEnterprise2026!';
    const valid = user.password ? user.password === pass : pass === masterPass;

    if (valid) {
      user.lastLogin = new Date().toISOString();
      return user;
    }
    return null;
  },

  /**
   * Create a new administrative user
   */
  async create(data: {
    name: string;
    email: string;
    role: AdminUser['role'];
    password?: string;
  }): Promise<Omit<AdminUser, 'password'>> {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Ya existe un usuario administrativo registrado con este correo.');
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role || 'Admin',
      password: data.password || undefined,
      active: true,
      createdAt: new Date().toISOString(),
    };

    usersStore.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  /**
   * Update an existing user
   */
  async update(id: string, updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): Promise<Omit<AdminUser, 'password'> | null> {
    const user = usersStore.find((u) => u.id === id);
    if (!user) return null;

    if (updates.name !== undefined) user.name = updates.name.trim();
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.active !== undefined) {
      // Prevent deactivating the primary SuperAdmin
      if (user.email === 'willja960@gmail.com' && !updates.active) {
        throw new Error('No es posible desactivar la cuenta principal del SuperAdmin.');
      }
      user.active = updates.active;
    }
    if (updates.password) user.password = updates.password;

    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Delete a user
   */
  async delete(id: string): Promise<boolean> {
    const index = usersStore.findIndex((u) => u.id === id);
    if (index === -1) return false;

    // Prevent deleting the primary SuperAdmin
    if (usersStore[index].email === 'willja960@gmail.com') {
      throw new Error('No es posible eliminar la cuenta principal del SuperAdmin.');
    }

    usersStore.splice(index, 1);
    return true;
  },
};
