'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { SoftwareSystem, IndustryCategory, LicenseType } from '@/types';

interface SystemModalProps {
  system: SoftwareSystem | null; // null means create mode
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SoftwareSystem>) => Promise<void>;
}

const CATEGORIES: IndustryCategory[] = [
  'Ferretería y Construcción',
  'Salud y Clínicas',
  'Retail y Supermercados',
  'Facturación y Finanzas',
  'Gastronomía y Restaurantes',
  'Educación y Academias',
];

const COMMON_MODULES = [
  'Punto de Venta (POS)',
  'Inventario Multialmacén',
  'Facturación Electrónica',
  'Gestión de Compras y Proveedores',
  'Control de Caja y Turnos',
  'Expediente Clínico / Turnos Médicos',
  'Comandero Móvil & Cocina KDS',
  'Portal Web de Clientes / Alumnos',
  'Reportes y Exportación Excel/PDF',
];

export function SystemModal({ system, isOpen, onClose, onSave }: SystemModalProps) {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<IndustryCategory>('Ferretería y Construcción');
  const [targetBusiness, setTargetBusiness] = useState('');
  const [description, setDescription] = useState('');
  const [priceUSD, setPriceUSD] = useState(1490);
  const [licenseType, setLicenseType] = useState<LicenseType>('Llave en Mano (Código Fuente)');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('https://demo.novasystems.io');
  
  // Dynamic tags for tech stack
  const [techStack, setTechStack] = useState<string[]>(['Node.js', 'React', 'PostgreSQL']);
  const [techInput, setTechInput] = useState('');

  // Selected Modules
  const [selectedModules, setSelectedModules] = useState<string[]>(['Punto de Venta (POS)', 'Inventario Multialmacén']);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (system) {
      setTitle(system.title);
      setTagline(system.tagline || '');
      setCategory(system.category);
      setTargetBusiness(system.targetBusiness);
      setDescription(system.description);
      setPriceUSD(system.priceUSD);
      setLicenseType(system.licenseType);
      setScreenshotUrl(system.screenshotUrl);
      setDemoUrl(system.demoUrl);
      setTechStack(system.techStack);
      setSelectedModules(system.modules);
    } else {
      setTitle('');
      setTagline('');
      setCategory('Ferretería y Construcción');
      setTargetBusiness('');
      setDescription('');
      setPriceUSD(1490);
      setLicenseType('Llave en Mano (Código Fuente)');
      setScreenshotUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80');
      setDemoUrl('https://demo.novasystems.io');
      setTechStack(['Node.js', 'React', 'PostgreSQL', 'Docker']);
      setSelectedModules(['Punto de Venta (POS)', 'Inventario Multialmacén']);
    }
  }, [system, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const handleToggleModule = (mod: string) => {
    if (selectedModules.includes(mod)) {
      setSelectedModules(selectedModules.filter((m) => m !== mod));
    } else {
      setSelectedModules([...selectedModules, mod]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        title,
        tagline,
        category,
        targetBusiness,
        description,
        priceUSD: Number(priceUSD),
        licenseType,
        screenshotUrl,
        demoUrl,
        techStack,
        modules: selectedModules,
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
      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-[#09111e] border border-sky-500/30 shadow-2xl overflow-hidden">
        
        {/* Fixed Header (Never clipped) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {system ? 'Editar Sistema de Software' : 'Publicar Nuevo Sistema en el Catálogo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body (Cero desbordamiento) */}
        <form id="system-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Sistema *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: NovaPOS Ferretería Pro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoría de Industria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IndustryCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Negocio al que está Destinado *
              </label>
              <input
                type="text"
                required
                value={targetBusiness}
                onChange={(e) => setTargetBusiness(e.target.value)}
                placeholder="Ej: Ferreterías, Pinturerías y Materiales"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Precio Base (USD) & Licencia
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(Number(e.target.value))}
                  className="w-1/3 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value as LicenseType)}
                  className="w-2/3 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="Llave en Mano (Código Fuente)">Llave en Mano (Código)</option>
                  <option value="Licencia Perpetua">Licencia Perpetua</option>
                  <option value="SaaS Mensual">SaaS Mensual</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción Comercial & Técnica *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla las capacidades del sistema, el beneficio operativo y por qué el cliente debería adquirirlo..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Dynamic Tech Stack Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Badges de Tecnologías (Presiona Enter o Añadir)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Ej: Node.js, Flutter, Docker, Redis..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/60 text-sky-300 border border-sky-500/30 text-xs font-mono"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    className="hover:text-rose-400 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Modules Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Módulos Clave del Sistema:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800">
              {COMMON_MODULES.map((mod) => {
                const isSelected = selectedModules.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => handleToggleModule(mod)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-sky-500 border-sky-400 text-white'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{mod}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image & Demo URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL de Captura / Portada
              </label>
              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL de Demo en Vivo
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

        </form>

        {/* Fixed Footer (Always visible at the bottom) */}
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
            form="system-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Guardando...' : system ? 'Actualizar Sistema' : 'Publicar Sistema'}
          </button>
        </div>

      </div>
    </div>
  );
}
