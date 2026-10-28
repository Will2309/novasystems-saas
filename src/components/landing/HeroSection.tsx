'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Search, 
  Layers, 
  Server, 
  Code2
} from 'lucide-react';
import { IndustryCategory } from '@/types';

interface HeroSectionProps {
  selectedCategory: IndustryCategory;
  onSelectCategory: (cat: IndustryCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: IndustryCategory[] = [
  'Todos',
  'Ferretería y Construcción',
  'Salud y Clínicas',
  'Retail y Supermercados',
  'Facturación y Finanzas',
  'Gastronomía y Restaurantes',
  'Educación y Academias',
];

export function HeroSection({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: HeroSectionProps) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-grid-pattern">
      {/* Background radial glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top High-Impact Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 shadow-md shadow-sky-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-sky-300">
              SOLUCIONES DE SOFTWARE PRECONSTRUIDO • DESPLIEGUE EN 48 HORAS
            </span>
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>
        </div>

        {/* Main Title - Proportional, Balanced, Never Overflowing */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.18]">
            Sistemas Empresariales Blindados,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">
              Probados y Listos para Desplegar
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Ahorra de 6 a 12 meses de desarrollo. Adquiere plataformas completas (Puntos de Venta, Clínicas, Facturación, Ferreterías) con <strong className="text-white font-semibold">código fuente 100% transferible</strong>, arquitectura limpia y garantía de cero fallos en producción.
          </p>
        </div>

        {/* Trust Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10">
          
          <div className="p-3.5 sm:p-4 rounded-2xl glass-panel text-center">
            <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
              <Terminal className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">150+</span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">Demos Activas en Vivo</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl glass-panel text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">99.98%</span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">SLA de Disponibilidad</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl glass-panel text-center">
            <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-1">
              <Server className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">450+</span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">Empresas en Producción</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl glass-panel text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">
              <Code2 className="w-4 h-4" />
              <span className="text-xl sm:text-2xl font-black text-white">100%</span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-400">Código Transferible</p>
          </div>

        </div>

        {/* Search & Quick Industry Filter Box */}
        <div className="max-w-3xl mx-auto rounded-2xl glass-panel-elevated p-4 sm:p-6 shadow-xl shadow-sky-950/40">
          
          {/* Search Input Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar sistema (ej: Ferretería, Clínicas, Balanza, Facturación, Node.js)..."
              className="w-full pl-10 pr-20 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-xs sm:text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Industry Filter Pills */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Filtrar por Especialidad:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border border-sky-400'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
