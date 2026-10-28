'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (admin: { name: string; role: string; email: string }) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('admin@novasystems.io');
  const [password, setPassword] = useState('NovaEnterprise2026!');
  const [totpCode, setTotpCode] = useState('');
  const [tempToken, setTempToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.requires2FA) {
        setTempToken(data.tempToken);
        setStep('2fa');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch {
      setError('Error de comunicación con el servidor de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, totpCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.admin);
      } else {
        setError(data.error || 'Código 2FA incorrecto');
      }
    } catch {
      setError('Error al verificar código 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d17] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg rounded-3xl glass-panel-elevated p-6 sm:p-10 border-sky-500/35 shadow-2xl relative overflow-hidden">
        
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400" />

        {/* Security Shield Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mx-auto mb-4 shadow-xl shadow-sky-500/20">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Panel de Administración</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1.5">
            Gestión No-Code de Catálogo, Leads y Métricas
          </p>
        </div>

        {/* Preset Info Hint Box */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-sky-950/50 border border-sky-500/40 text-xs sm:text-sm text-sky-200">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-sm sm:text-base">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" /> Credenciales de Demostración:
          </div>
          <div className="font-mono text-xs sm:text-sm text-slate-300 space-y-1">
            <div>Usuario: <strong className="text-white">admin@novasystems.io</strong></div>
            <div>Clave: <strong className="text-white">NovaEnterprise2026!</strong></div>
            <div>Código 2FA / TOTP: <strong className="text-emerald-400">123456</strong></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Correo Electrónico de Administrador
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Contraseña Encriptada (Argon2id)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
            >
              {loading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Continuar a Validación 2FA</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-6">
            <div className="text-center pb-2">
              <KeyRound className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base sm:text-lg font-bold text-white">Autenticación de Dos Factores (2FA)</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Ingresa el código TOTP de 6 dígitos generado por tu aplicación autenticadora.
              </p>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-4 rounded-2xl bg-slate-900 border border-emerald-500/50 text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
            >
              {loading ? (
                <span>Verificando TOTP...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Autenticar y Acceder al Panel</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full text-center text-sm text-slate-400 hover:text-white pt-2 underline"
            >
              Volver a credenciales
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
