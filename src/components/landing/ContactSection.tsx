'use client';

import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle,
  ChevronDown,
  Building2,
  User,
  Sparkles
} from 'lucide-react';
import { SoftwareSystem } from '@/types';
import { buildWhatsAppLink } from '@/lib/utils';

interface ContactSectionProps {
  systems: SoftwareSystem[];
  preselectedSystem: SoftwareSystem | null;
}

export function ContactSection({ systems, preselectedSystem }: ContactSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedSystemId, setSelectedSystemId] = useState<string>(preselectedSystem?.id || '');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  React.useEffect(() => {
    if (preselectedSystem) {
      setSelectedSystemId(preselectedSystem.id);
    }
  }, [preselectedSystem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    const selectedSys = systems.find((s) => s.id === selectedSystemId);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          companyName,
          systemId: selectedSystemId || 'general',
          systemTitle: selectedSys ? selectedSys.title : 'Consulta General',
          message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: '¡Solicitud recibida con éxito! Nuestro equipo de arquitectura técnica se comunicará contigo en menos de 2 horas hábiles.',
        });
        setFullName('');
        setEmail('');
        setPhone('');
        setCompanyName('');
        setMessage('');
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Ocurrió un error al enviar tu consulta. Por favor inténtalo nuevamente o usa WhatsApp.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Error de conexión con el servidor. Por favor comunícate directamente por WhatsApp.',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentSystemObj = systems.find((s) => s.id === selectedSystemId);
  const dynamicWhatsAppUrl = buildWhatsAppLink('+525541928800', currentSystemObj?.title);

  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const faqs = [
    {
      q: '¿Qué incluye la adquisición con código fuente (Llave en Mano)?',
      a: 'Recibes el repositorio Git completo y privado con todo el código fuente del frontend y backend, base de datos con migraciones, scripts de despliegue Docker y Docker Compose, manual de arquitectura y 1 sesión de transferencia técnica 1 a 1 con nuestro arquitecto senior.',
    },
    {
      q: '¿Existen cobros ocultos o regalías recurrentes?',
      a: 'No. Bajo el modelo de Licencia Perpetua / Llave en Mano, el software es de tu propiedad exclusiva sin pagos mensuales forzados. Puedes desplegarlo en los servidores y dominios que desees.',
    },
    {
      q: '¿Pueden personalizar módulos específicos para nuestro modelo de negocio?',
      a: 'Sí. Contamos con un equipo especializado en extender funcionalidades, conectar pasarelas de pago locales de tu país o integrar APIs de facturación tributaria específica.',
    },
    {
      q: '¿Ofrecen garantía ante fallos o errores?',
      a: 'Absolutamente. Todos nuestros sistemas cuentan con 12 meses de garantía contractual que cubre corrección prioritaria de bugs, parches de seguridad y asesoría de infraestructura.',
    },
  ];

  return (
    <section id="contacto" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Asesoría de Arquitectura & Cotizaciones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Impulsa tu Operación con un Sistema Probado
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-300 font-normal">
            Agenda una sesión de demostración técnica guiada, resuelve dudas de infraestructura o solicita una cotización formal inmediata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 rounded-3xl glass-panel-elevated p-6 sm:p-8 border-sky-500/20 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              Solicitud de Cotización y Demostración Guiada
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              Completa el formulario y te enviaremos la propuesta técnica con desglose de módulos y tiempos de puesta en marcha.
            </p>

            {status.type === 'success' && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">¡Mensaje Transmitido con Éxito!</h4>
                  <p className="text-xs text-slate-200 mt-0.5">{status.message}</p>
                </div>
              </div>
            )}

            {status.type === 'error' && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Aviso del Sistema</h4>
                  <p className="text-xs text-slate-200 mt-0.5">{status.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Lic. Alejandro Fuentes"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Corporativo *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alejandro@empresa.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Empresa u Organización
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ej: Distribuidora Nacional"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sistema de tu Interés:
                </label>
                <select
                  value={selectedSystemId}
                  onChange={(e) => setSelectedSystemId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Seleccionar Sistema del Catálogo --</option>
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))}
                  <option value="custom">Desarrollo a la Medida / Modificación de Sistema</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Requerimientos Específicos o Mensaje *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos cuántos usuarios o sucursales tienes, si requieres migración de base de datos previa o integración con facturación fiscal..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Validando y enviando requerimientos...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitud de Cotización</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Formulario con protección Anti-Bot reCAPTCHA v3 & Rate Limiting WAF</span>
              </div>

            </form>
          </div>

          {/* Right Column: WhatsApp Callout & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Direct Dynamic Card */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Atención Instantánea por WhatsApp</h4>
                  <p className="text-xs text-emerald-300 font-semibold">Respuesta en menos de 15 minutos</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Si requieres una respuesta inmediata o coordinar una videollamada para demostración técnica con pantalla compartida, contáctanos directamente.
              </p>

              <a
                href={dynamicWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Iniciar Chat en WhatsApp</span>
              </a>
            </div>

            {/* FAQ Accordion */}
            <div className="rounded-3xl glass-panel p-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                Preguntas Frecuentes
              </h4>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = faqOpenIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-sky-300 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-sky-400' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
