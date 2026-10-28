'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, CheckCircle2, XCircle, Mail, UserPlus, KeyRound, Sparkles } from 'lucide-react';
import { AdminUser } from '@/types';

export function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('Admin');
  const [password, setPassword] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password: password || undefined }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`¡Usuario ${name} registrado con éxito!`);
        setName('');
        setEmail('');
        setPassword('');
        setModalOpen(false);
        loadUsers();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.error || 'Error creando usuario');
      }
    } catch {
      setError('Error de comunicación con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !user.active }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loadUsers();
      } else {
        alert(data.error || 'No se pudo actualizar el estado del usuario');
      }
    } catch {
      alert('Error al actualizar');
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`¿Estás seguro de eliminar el acceso administrativo a ${user.name} (${user.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loadUsers();
      } else {
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Gestión de Usuarios y Accesos Administrativos</h3>
          </div>
          <p className="text-xs text-slate-400">
            Administra los usuarios autorizados para ingresar al panel con autenticación 2FA/OTP individual.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Agregar Nuevo Administrador
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Correo Electrónico (Recepción OTP)</th>
                <th className="px-6 py-4">Rol de Acceso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Último Acceso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Cargando usuarios autorizados...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isPrimarySuperAdmin = u.email === 'willja960@gmail.com';

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold text-xs uppercase">
                            {u.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {isPrimarySuperAdmin && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                                  PROPIETARIO
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">ID: {u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-sky-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            u.role === 'SuperAdmin'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                              : u.role === 'Admin'
                              ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                              : u.role === 'Ventas'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          disabled={isPrimarySuperAdmin}
                          onClick={() => handleToggleActive(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            u.active
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 hover:bg-rose-950/50 hover:text-rose-400'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/40 hover:bg-emerald-950/50 hover:text-emerald-400'
                          } ${isPrimarySuperAdmin ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                          title={isPrimarySuperAdmin ? 'No se puede desactivar la cuenta principal' : 'Clic para cambiar estado'}
                        >
                          {u.active ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString('es-ES') : 'Sin registros'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {!isPrimarySuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 border border-sky-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-400" />
                <h4 className="text-base font-bold text-white">Nuevo Usuario Administrativo</h4>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Gómez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Correo Electrónico (Recepción de códigos OTP)
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Rol Administrativo
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="Admin">Admin (Control Total de Sistemas y Leads)</option>
                  <option value="SuperAdmin">SuperAdmin (Gestión de Usuarios y Configuración)</option>
                  <option value="Ventas">Ventas (Gestión de Leads y Cotizaciones)</option>
                  <option value="Soporte">Soporte Técnico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Contraseña Personalizada (Opcional)
                </label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para usar la clave maestra"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-slate-500"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Si no especificas una, usará la contraseña configurada en ADMIN_PASSWORD.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
