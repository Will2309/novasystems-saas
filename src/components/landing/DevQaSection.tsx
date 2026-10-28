'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Lock, 
  Gauge, 
  Workflow, 
  Sparkles, 
  Award, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';
import { TeamMember } from '@/types';
import { INITIAL_TEAM_MEMBERS } from '@/services/teamService';

interface DevQaSectionProps {
  team?: TeamMember[];
}

interface MetricCardProps {
  label: string;
  targetValue: number;
  suffix?: string;
  prefix?: string;
  description: string;
  icon: React.ReactNode;
}

function DynamicHoverMetric({
  label,
  targetValue,
  suffix = '',
  prefix = '',
  description,
  icon,
}: MetricCardProps) {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = isHovered ? 600 : 1200;
    const startVal = currentValue;
    const endVal = targetValue;

    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = startVal + (endVal - startVal) * easeProgress;
      setCurrentValue(Number(nextVal.toFixed(1)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered, targetValue]);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        setCurrentValue(0);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="p-5 sm:p-6 rounded-2xl glass-panel-elevated border border-slate-800 hover:border-sky-500/50 transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
          {label}
        </span>
        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 group-hover:scale-110 transition-all">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight group-hover:text-sky-300 transition-colors">
          {prefix}
          {targetValue % 1 === 0 ? Math.round(currentValue) : currentValue}
          {suffix}
        </span>
      </div>

      {/* Progress Bar indicator */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-3 mb-2">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${Math.min(currentValue, 100)}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {description}
      </p>

      {/* Hover visual cue */}
      <div className="mt-2 text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        <span>Pasa el cursor para ver la animación</span>
      </div>
    </div>
  );
}

export function DevQaSection({ team = INITIAL_TEAM_MEMBERS }: DevQaSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'dev' | 'qa'>('all');

  const membersList = team && team.length > 0 ? team : INITIAL_TEAM_MEMBERS;

  const filteredMembers = membersList.filter(
    (m) => activeTab === 'all' || m.team === activeTab
  );

  return (
    <section id="dev-qa" className="py-20 sm:py-28 relative bg-[#070e1a] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Workflow className="w-4 h-4" />
            <span>Ingeniería Dual & Cero Fallos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Quiénes Somos: <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Equipo Dev & QA</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Unimos arquitectura de software limpia con aseguramiento de calidad exhaustivo. Conoce a los especialistas que garantizan la estabilidad de cada sistema.
          </p>
        </div>

        {/* 1. Dynamic Hover Metrics Grid (Suben de manera dinámica al pasar el cursor) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <DynamicHoverMetric
            label="Cobertura de Pruebas"
            targetValue={96.5}
            suffix="%"
            description="Tests unitarios y de integración continuos en cada módulo."
            icon={<FileCheck className="w-5 h-5" />}
          />
          <DynamicHoverMetric
            label="Uptime y Disponibilidad"
            targetValue={99.98}
            suffix="%"
            description="SLA garantizado para despliegues en contenedores Docker."
            icon={<Gauge className="w-5 h-5" />}
          />
          <DynamicHoverMetric
            label="Hardening de Seguridad"
            targetValue={100}
            suffix="%"
            description="Protección probada contra vulnerabilidades OWASP Top 10."
            icon={<Lock className="w-5 h-5" />}
          />
          <DynamicHoverMetric
            label="Garantía de Arquitectura"
            targetValue={12}
            suffix=" Meses"
            description="Acompañamiento técnico directo post-implementación."
            icon={<Award className="w-5 h-5" />}
          />
        </div>

        {/* 2. Team Switcher Tabs (Limpio y no sobrecargado) */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-400" />
              Perfiles del Equipo de Ingeniería
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Profesionales dedicados a la construcción y certificación de tus sistemas.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({membersList.length})
            </button>
            <button
              onClick={() => setActiveTab('dev')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dev'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Devs (Arquitectura)
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'qa'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              QA & Seguridad
            </button>
          </div>
        </div>

        {/* 3. Team Profiles Cards Grid (Dynamic from Admin CRUD) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14">
          {filteredMembers.map((member) => {
            const isDev = member.team === 'dev';
            return (
              <div
                key={member.id}
                className="rounded-3xl glass-panel-elevated p-6 sm:p-7 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Name & Role */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{member.name}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isDev
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {isDev ? 'Dev Architecture' : 'QA Lead'}
                        </span>
                      </div>
                      <p className="text-xs text-sky-400 font-medium mt-0.5">{member.role}</p>
                      <p className="text-[11px] text-slate-400">{member.experienceYears}+ años de experiencia corporativa</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Specialties Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric Pill */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Logro Destacado:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {member.highlightMetric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Minimalist Corporate Guarantee Banner */}
        <div id="garantia" className="rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-emerald-950/60 border border-sky-500/30 p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-xl">
          <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
            Compromiso de Código Limpio y Entrega Sin Deuda Técnica
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Cada línea de código que recibes ha superado pruebas automatizadas y auditoría de seguridad. Incluimos los scripts de despliegue Docker y manuales para que tu equipo opere con total autonomía.
          </p>
        </div>

      </div>
    </section>
  );
}
