'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, CheckCircle, AlertCircle, Mail, RefreshCw, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (admin: { name: string; role: string; email: string }) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('admin@novasystems.io');
  const [password, setPassword] = useState('NovaEnterprise2026!');
  const [totpCode, setTotpCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [showCode, setShowCode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.requires2FA) {
        setTempToken(data.tempToken);
        setMaskedEmail(data.maskedEmail || email);
        setStep('2fa');
        setTotpCode('');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch {
      setError('Error de comunicación con el servidor de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.requires2FA) {
        setTempToken(data.tempToken);
        setInfoMessage('¡Nuevo código de seguridad enviado a tu buzón de correo!');
      } else {
        setError(data.error || 'No se pudo reenviar el código');
      }
    } catch {
      setError('Error al solicitar nuevo código');
    } finally {
      setResending(false);
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
        setError(data.error || 'Código de seguridad incorrecto o expirado');
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
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400" />

        {/* Security Shield Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mx-auto mb-4 shadow-xl shadow-sky-500/20">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Panel de Administración</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Acceso Corporativo Protegido con Doble Factor (2FA)
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {step === 'credentials' ? (
          <div>
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
                  Correo Electrónico de Administrador
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@novasystems.io"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5">
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Al autenticarte, se enviará un código de verificación único de 6 dígitos exclusivamente a tu buzón de correo.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Generando código seguro...</span>
                ) : (
                  <>
                    <span>Continuar al Paso 2 (2FA)</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-5">
            <div className="text-center pb-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">Código de Verificación Confidencial</h4>
              
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Enviado a tu buzón: <strong className="text-sky-300">{maskedEmail}</strong></span>
              </div>

              <p className="text-xs text-slate-400 mt-2.5">
                Ingresa el código numérico de 6 dígitos que recibiste por correo. Expira en 10 minutos.
              </p>
            </div>

            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full text-center tracking-[0.5em] sm:tracking-[0.8em] font-mono text-2xl sm:text-3xl py-3.5 rounded-2xl bg-slate-900 border border-emerald-500/50 text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                title={showCode ? 'Ocultar código' : 'Mostrar código'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || totpCode.length < 6}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Validando código confidencial...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Validar y Entrar al Panel</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <button
                type="button"
                disabled={resending}
                onClick={handleResendCode}
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1.5 disabled:opacity-50 font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Reenviando...' : '¿No llegó? Reenviar código'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-slate-400 hover:text-white underline font-medium"
              >
                Volver a credenciales
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
