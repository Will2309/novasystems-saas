'use client';

import React from 'react';
import { Eye, TrendingUp, Users, Cpu, BarChart3, Award } from 'lucide-react';
import { AdminMetrics } from '@/types';

interface MetricsOverviewProps {
  metrics: AdminMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const maxClicks = Math.max(...metrics.topSystems.map((s) => s.clicks), 1);

  return (
    <div className="space-y-8">
      
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        
        <div className="p-6 sm:p-7 rounded-3xl glass-panel-elevated border-sky-500/25 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-400">Clics en &quot;Ver Demo&quot;</span>
            <div className="p-2.5 rounded-2xl bg-sky-500/15 text-sky-400">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{metrics.totalDemoClicks}</div>
          <p className="text-xs sm:text-sm text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-4 h-4" /> +24% respecto al mes anterior
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl glass-panel-elevated border-emerald-500/25 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-400">Leads & Consultas</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{metrics.totalLeads}</div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">Clientes solicitando cotización</p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl glass-panel-elevated border-indigo-500/25 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-400">Tasa de Conversión</span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{metrics.conversionRatePercent}%</div>
          <p className="text-xs sm:text-sm text-indigo-300 mt-2 font-medium">Demo Play ➔ Solicitud</p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl glass-panel-elevated border-cyan-500/25 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-400">Sistemas en Catálogo</span>
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white">{metrics.totalSystems}</div>
          <p className="text-xs sm:text-sm text-cyan-300 mt-2 font-medium">Soluciones listas para despliegue</p>
        </div>

      </div>

      {/* Popularity Ranking by Demo Clicks */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel-elevated shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-400" />
              Ranking de Demanda: Clics en Demos en Vivo
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Identifica cuál es el software con mayor intención de compra para priorizar campañas y mejoras técnicas.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {metrics.topSystems.map((item, idx) => {
            const percentage = Math.round((item.clicks / maxClicks) * 100);
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 font-mono text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm sm:text-base">{item.title}</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">({item.category})</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sky-400 text-sm sm:text-base">{item.clicks} clics</span>
                    <span className="text-slate-400 text-xs sm:text-sm">({percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
