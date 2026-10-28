'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, Plus } from 'lucide-react';
import { TeamMember } from '@/types';

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TeamMember, 'id'>) => Promise<void>;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
];

export function TeamMemberModal({ member, isOpen, onClose, onSave }: TeamMemberModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState<'dev' | 'qa'>('dev');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [highlightMetric, setHighlightMetric] = useState('');
  const [specialties, setSpecialties] = useState<string[]>(['TypeScript', 'Docker']);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setTeam(member.team);
      setAvatarUrl(member.avatarUrl);
      setBio(member.bio);
      setExperienceYears(member.experienceYears);
      setHighlightMetric(member.highlightMetric);
      setSpecialties(member.specialties);
    } else {
      setName('');
      setRole('Software Architect / Fullstack Lead');
      setTeam('dev');
      setAvatarUrl(PRESET_AVATARS[0]);
      setBio('Especialista en arquitecturas limpias y sistemas de alto rendimiento.');
      setExperienceYears(6);
      setHighlightMetric('99.9% Uptime y 0 bugs críticos');
      setSpecialties(['Next.js', 'PostgreSQL', 'Docker']);
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !specialties.includes(tagInput.trim())) {
      setSpecialties([...specialties, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSpecialties(specialties.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        name,
        role,
        team,
        avatarUrl,
        bio,
        experienceYears: Number(experienceYears),
        highlightMetric,
        specialties,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-3xl bg-[#09111e] border border-sky-500/30 shadow-2xl overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900/70">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-sky-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {member ? 'Editar Profesional' : 'Agregar Profesional (Dev o QA)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="team-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Ing. Martín Gómez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilar de Especialidad *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTeam('dev')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    team === 'dev'
                      ? 'bg-sky-500 text-white border border-sky-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}
                >
                  Dev (Arquitectura)
                </button>
                <button
                  type="button"
                  onClick={() => setTeam('qa')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    team === 'qa'
                      ? 'bg-emerald-500 text-white border border-emerald-400'
                      : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}
                >
                  QA (Calidad / Sec)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cargo / Rol Profesional *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ej: Lead Software Architect / QA Automation"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Años de Experiencia
              </label>
              <input
                type="number"
                min={1}
                max={35}
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Biografía / Resumen de Experiencia *
            </label>
            <textarea
              required
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enfoque principal del profesional, experiencia previa o impacto en sistemas..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Logro Destacado / Métrica Clave *
            </label>
            <input
              type="text"
              required
              value={highlightMetric}
              onChange={(e) => setHighlightMetric(e.target.value)}
              placeholder="Ej: +1,800 tests automatizados / 99.98% uptime / 0 bugs críticos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Avatar URL & Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Avatar / Foto Profesional
            </label>
            <div className="flex items-center gap-3 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Predefinidos rápidos:</span>
              <div className="flex gap-1.5">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 hover:border-sky-400 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Specialties / Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Habilidades y Especialidades
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ej: Next.js, Docker, Playwright..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {specialties.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(spec)}
                    className="hover:text-rose-400 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </form>

        {/* Fixed Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-slate-800 shrink-0 bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="team-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Guardando...' : member ? 'Actualizar Profesional' : 'Guardar Profesional'}
          </button>
        </div>

      </div>
    </div>
  );
}
