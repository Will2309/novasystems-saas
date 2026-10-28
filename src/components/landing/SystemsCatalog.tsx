'use client';

import React from 'react';
import { 
  Play, 
  Send, 
  Check, 
  Cpu, 
  Eye, 
  Sparkles, 
  ShieldAlert,
  Coins
} from 'lucide-react';
import { SoftwareSystem, CurrencyCode } from '@/types';
import { formatCurrency, CURRENCY_CONFIGS } from '@/lib/utils';

interface SystemsCatalogProps {
  systems: SoftwareSystem[];
  currency: CurrencyCode;
  onCurrencyChange?: (c: CurrencyCode) => void;
  onOpenDemo: (system: SoftwareSystem) => void;
  onRequestQuote: (system: SoftwareSystem) => void;
}

export function SystemsCatalog({
  systems,
  currency,
  onCurrencyChange,
  onOpenDemo,
  onRequestQuote,
}: SystemsCatalogProps) {
  if (systems.length === 0) {
    return (
      <div className="text-center py-16 px-4 glass-panel max-w-2xl mx-auto rounded-3xl my-8">
        <ShieldAlert className="w-12 h-12 text-sky-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">No se encontraron sistemas</h3>
        <p className="text-slate-400 text-sm">
          No encontramos plataformas con los filtros seleccionados. Intenta buscar con otro término o seleccionar otra categoría.
        </p>
      </div>
    );
  }

  return (
    <section id="catalogo" className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Sistemas de Grado Producción</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Catálogo de Software Listo para Operar
            </h2>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Subtle Currency Selector Pill */}
            {onCurrencyChange && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400 font-medium">Moneda:</span>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                  <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
                  <option value="MXN" className="bg-slate-900 text-white">MXN ($)</option>
                  <option value="PEN" className="bg-slate-900 text-white">PEN (S/)</option>
                  <option value="COP" className="bg-slate-900 text-white">COP ($)</option>
                </select>
              </div>
            )}

            <p className="text-slate-400 text-xs sm:text-sm max-w-xs">
              Arquitectura modular con scripts Docker listos para transferencia.
            </p>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {systems.map((system) => {
            return (
              <div
                key={system.id}
                className="group relative rounded-3xl glass-panel-elevated hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-sky-950/40"
              >
                {/* Featured Badge */}
                {system.featured && (
                  <div className="absolute top-3.5 right-3.5 z-20">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Más Solicitado
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Image Cover with Overlay */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={system.screenshotUrl}
                      alt={system.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1626] via-[#0c1626]/40 to-transparent" />
                    
                    {/* Category pill on image */}
                    <div className="absolute bottom-3 left-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-950/80 text-sky-300 border border-sky-500/30 backdrop-blur-md">
                        {system.category}
                      </span>
                    </div>

                    {/* Live Views Counter */}
                    <div className="absolute top-3 left-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 text-slate-300 border border-slate-700/50 backdrop-blur-md">
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        {system.metrics.demoViews} pruebas
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    {/* Title & Target Business */}
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors mb-1">
                      {system.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1">
                      <span className="text-slate-400 font-normal">Para:</span> {system.targetBusiness}
                    </p>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {system.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Stack Tecnológico:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {system.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-sky-200 border border-slate-700/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Modules List */}
                    <div className="mb-4 space-y-2 border-t border-slate-800/80 pt-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Módulos Clave:
                      </span>
                      {system.modules.slice(0, 4).map((mod, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{mod}</span>
                        </div>
                      ))}
                      {system.modules.length > 4 && (
                        <p className="text-[11px] text-sky-400 font-medium pl-5">
                          + {system.modules.length - 4} módulos adicionales
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Pricing & CTAs */}
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-800/80 bg-slate-900/40 mt-auto">
                  
                  {/* Pricing info with Dynamic Currency */}
                  <div className="flex items-center justify-between py-3 mb-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Licencia:</span>
                      <span className="font-semibold text-slate-200">{system.licenseType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Inversión Base:</span>
                      <span className="text-lg font-black text-white">
                        {formatCurrency(system.priceUSD, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    
                    {/* Primary Button: PROBAR DEMO */}
                    <button
                      onClick={() => onOpenDemo(system)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Probar Demo
                    </button>

                    {/* Secondary Button: Cotizar / Contactar */}
                    <button
                      onClick={() => onRequestQuote(system)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-sky-500/40 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-400" />
                      Cotizar
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
