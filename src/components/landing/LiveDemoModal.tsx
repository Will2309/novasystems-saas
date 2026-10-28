'use client';

import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Copy, 
  Check, 
  Sparkles, 
  ShoppingCart, 
  Stethoscope, 
  FileText, 
  Lock,
  ArrowRight,
  Printer
} from 'lucide-react';
import { SoftwareSystem } from '@/types';

interface LiveDemoModalProps {
  system: SoftwareSystem | null;
  onClose: () => void;
  onRequestQuote: (system: SoftwareSystem) => void;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function LiveDemoModal({ system, onClose, onRequestQuote }: LiveDemoModalProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<string>('Administrador Maestro');

  // Interactive POS simulation state
  const [posCart, setPosCart] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Cemento Gris Portland 50kg', price: 14.50, qty: 2 },
    { name: 'Varilla Corrugada 1/2" (tramo 6m)', price: 8.90, qty: 5 },
  ]);
  const [ticketGenerated, setTicketGenerated] = useState<boolean>(false);

  // Interactive Clinic simulation state
  const [activePatient] = useState<{ name: string; age: number; reason: string }>({
    name: 'Mariano Estrada',
    age: 42,
    reason: 'Control de hipertensión y chequeo preventivo',
  });
  const [prescriptionIssued, setPrescriptionIssued] = useState<boolean>(false);

  if (!system) return null;

  const handleCopyCredentials = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const calculatePosTotal = () => {
    const subtotal = posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.16;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleAddPosItem = (name: string, price: number) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { name, price, qty: 1 }];
    });
  };

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-md';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'w-full';
    }
  };

  const { subtotal, tax, total } = calculatePosTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-6xl 2xl:max-w-7xl h-[94vh] flex flex-col rounded-3xl bg-[#09111e] border border-sky-500/35 shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 bg-slate-900 border-b border-slate-800 shrink-0">
          
          {/* System Identity & Status */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-bold uppercase text-emerald-400">
                SANDBOX EN VIVO
              </span>
            </div>
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <h4 className="text-base sm:text-lg font-bold text-white truncate max-w-[180px] sm:max-w-sm">
              {system.title}
            </h4>
          </div>

          {/* Viewport Toggles (Responsive Switcher) */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                viewport === 'desktop' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de Escritorio"
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Escritorio</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                viewport === 'tablet' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Tablet"
            >
              <Tablet className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                viewport === 'mobile' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Móvil"
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Móvil</span>
            </button>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onRequestQuote(system)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cotizar Software</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Cerrar visor"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* Credentials / Quick Switch Bar */}
        <div className="bg-[#0e192c] border-b border-slate-800/90 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-400" />
              Credenciales Simuladas:
            </span>
            {system.demoCredentials.map((cred, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200"
              >
                <span className="font-bold text-sky-300">{cred.role}:</span>
                <span className="font-mono text-slate-300">{cred.email}</span>
                <button
                  onClick={() => handleCopyCredentials(`${cred.email} | ${cred.pass}`, idx)}
                  className="text-slate-400 hover:text-white transition-colors ml-1"
                  title="Copiar credenciales"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Rol activo:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm border border-slate-700 focus:outline-none"
            >
              <option>Administrador Maestro</option>
              <option>Cajero / Operador</option>
              <option>Auditor de Calidad</option>
            </select>
          </div>

        </div>

        {/* Sandbox Canvas Simulator Area */}
        <div className="flex-1 bg-[#050a12] p-4 sm:p-8 overflow-y-auto flex justify-center items-start">
          <div
            className={`transition-all duration-300 rounded-3xl bg-[#0c1626] border border-slate-800 shadow-2xl p-5 sm:p-8 ${getViewportWidthClass()}`}
          >
            {/* System Specific Simulated Screen */}
            {system.category === 'Ferretería y Construcción' || system.category === 'Retail y Supermercados' ? (
              <div>
                {/* Simulated POS Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 mb-6 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base sm:text-lg">Terminal de Venta & Caja 01</h4>
                      <p className="text-xs sm:text-sm text-slate-400">Operador: {activeRole} | Serie F001-2026</p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Lector de Barras: Activo
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  
                  {/* Left: Quick Items Grid to Click */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-300">
                        Catálogo de Artículos Rápidos (Haz Clic para Añadir):
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { name: 'Cemento Gris Portland 50kg', price: 14.50 },
                        { name: 'Varilla Corrugada 1/2" (tramo 6m)', price: 8.90 },
                        { name: 'Disco Corte Metal 4 1/2"', price: 2.50 },
                        { name: 'Pintura Látex Blanco 1 Galón', price: 18.00 },
                        { name: 'Tornillo Drywall 6x1" (x100)', price: 3.20 },
                        { name: 'Cerradura Sobreponer Forte', price: 24.50 },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleAddPosItem(item.name, item.price)}
                          className="p-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all hover:border-sky-500/50 group cursor-pointer shadow-md"
                        >
                          <div className="text-sm font-semibold text-white group-hover:text-sky-300 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-base font-black text-emerald-400 mt-1.5">
                            ${item.price.toFixed(2)}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Simulation Info Pill */}
                    <div className="p-4 rounded-2xl bg-sky-950/50 border border-sky-500/30 text-xs sm:text-sm text-sky-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <span>💡 Esta demo interactúa con la lógica de inventario fraccionado en memoria.</span>
                      <button
                        onClick={() => {
                          setPosCart([]);
                          setTicketGenerated(false);
                        }}
                        className="text-slate-300 hover:text-white underline font-semibold text-xs sm:text-sm"
                      >
                        Vaciar Carrito
                      </button>
                    </div>
                  </div>

                  {/* Right: Simulated Receipt Ticket */}
                  <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="text-center pb-4 border-b border-dashed border-slate-700">
                        <span className="font-black text-base sm:text-lg text-white tracking-wide block">
                          FERRETERÍA & MATERIALES NOVA
                        </span>
                        <p className="text-xs text-slate-400">RUC / RFC: 20491829381</p>
                      </div>

                      {/* Items List */}
                      <div className="py-4 space-y-2.5 max-h-56 overflow-y-auto">
                        {posCart.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="max-w-[160px] truncate text-slate-200">
                              <span className="text-sky-400 font-bold">{item.qty}x</span> {item.name}
                            </div>
                            <span className="font-mono text-white font-bold">
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="border-t border-slate-800 pt-4 space-y-1.5 text-xs sm:text-sm">
                        <div className="flex justify-between text-slate-400">
                          <span>Subtotal:</span>
                          <span className="font-mono text-slate-200">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>IVA / Impuestos (16%):</span>
                          <span className="font-mono text-slate-200">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base sm:text-lg font-black text-white pt-2 border-t border-slate-700">
                          <span>TOTAL:</span>
                          <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      {ticketGenerated ? (
                        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-center text-xs sm:text-sm space-y-2">
                          <div className="flex items-center justify-center gap-1.5 font-bold text-sm sm:text-base">
                            <Check className="w-5 h-5 text-emerald-400" /> Venta Emitida con Éxito
                          </div>
                          <p className="text-xs text-slate-300">
                            Ticket fiscal #F001-004812 generado. XML firmado con certificado digital.
                          </p>
                          <button
                            onClick={() => setTicketGenerated(false)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase"
                          >
                            Nueva Venta
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setTicketGenerated(true)}
                          disabled={posCart.length === 0}
                          className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
                        >
                          <Printer className="w-5 h-5" />
                          <span>Cobrar & Emitir Factura</span>
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            ) : system.category === 'Salud y Clínicas' ? (
              <div>
                {/* Simulated Clinic EHR Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 mb-6 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-400">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base sm:text-lg">Historia Clínica Electrónica (EHR)</h4>
                      <p className="text-xs sm:text-sm text-slate-400">Médico: Dra. Mariana Valenzuela | Especialidad: Medicina General</p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Norma HIPAA / HL7 Activa
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-5">
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Ficha del Paciente:
                      </span>
                      <h5 className="text-lg font-bold text-white">{activePatient?.name}</h5>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">Edad: {activePatient?.age} años | Tipo Sanguíneo: O+ | Alergias: Penicilina</p>
                      <div className="mt-4 p-3 rounded-xl bg-slate-800 text-xs sm:text-sm text-slate-200">
                        <strong>Motivo de Consulta:</strong> {activePatient?.reason}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Constantes Vitales en Consulta:
                      </span>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-slate-800">
                          <span className="text-xs text-slate-400 block">Presión</span>
                          <span className="font-bold text-emerald-400 text-base sm:text-lg">120/80</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800">
                          <span className="text-xs text-slate-400 block">Frecuencia</span>
                          <span className="font-bold text-sky-400 text-base sm:text-lg">72 lpm</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800">
                          <span className="text-xs text-slate-400 block">Temperatura</span>
                          <span className="font-bold text-amber-400 text-base sm:text-lg">36.6 °C</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                        Generador de Receta con Firma Digital:
                      </span>
                      <div className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
                        <div className="p-3 rounded-xl bg-slate-800">
                          1. Losartán 50mg - 1 tableta cada 24 horas por 30 días
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800">
                          2. Hidroclorotiazida 12.5mg - 1 tableta cada mañana
                        </div>
                      </div>
                    </div>

                    {prescriptionIssued ? (
                      <div className="p-4 rounded-2xl bg-teal-950/70 border border-teal-500/50 text-teal-300 text-center text-xs sm:text-sm">
                        <p className="font-bold text-base">✓ Receta Firmada Digitalmente con Código QR</p>
                        <p className="text-xs text-slate-300 mt-1">Notificación enviada al WhatsApp del paciente.</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPrescriptionIssued(true)}
                        className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-teal-500/25 cursor-pointer"
                      >
                        Firmar y Emitir Receta Digital
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* General Enterprise Dashboard Simulator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 mb-6 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base sm:text-lg">Panel Central de Operaciones</h4>
                      <p className="text-xs sm:text-sm text-slate-400">Sistema: {system.title}</p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    PostgreSQL RLS Activo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Transacciones del Día</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">1,489 ops</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Tiempo de Respuesta API</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">32 ms</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Sincronización Cloud</span>
                    <span className="text-2xl sm:text-3xl font-black text-sky-400">100% OK</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h5 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-300 mb-4">
                    Módulos y Endpoints Disponibles:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
                    {system.modules.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Conversion Bar */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 bg-[#0a1220] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-sm sm:text-base font-bold text-white block">
              ¿Listo para desplegar este sistema en tu infraestructura?
            </span>
            <p className="text-xs sm:text-sm text-slate-400">
              Incluye código fuente completo, contenedores Docker, migración guiada y 1 año de garantía de arquitectura.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onRequestQuote(system);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-xl shadow-sky-500/30 transition-all cursor-pointer"
            >
              <span>Solicitar Cotización & Llave en Mano</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
