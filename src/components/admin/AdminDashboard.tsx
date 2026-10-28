'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Cpu, 
  Users, 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Eye, 
  ArrowLeft,
  Coins,
  Settings
} from 'lucide-react';
import { SoftwareSystem, LeadInquiry, AdminMetrics, CurrencyCode } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { MetricsOverview } from './MetricsOverview';
import { LeadsManager } from './LeadsManager';
import { SystemModal } from './SystemModal';

interface AdminDashboardProps {
  admin: { name: string; role: string; email: string };
  systems: SoftwareSystem[];
  leads: LeadInquiry[];
  metrics: AdminMetrics;
  currency: CurrencyCode;
  onCurrencyChange: (newCurrency: CurrencyCode) => Promise<void>;
  onLogout: () => void;
  onRefreshData: () => void;
  onSaveSystem: (data: Partial<SoftwareSystem>, editingId?: string) => Promise<void>;
  onDeleteSystem: (id: string) => Promise<void>;
  onUpdateLeadStatus: (id: string, status: LeadInquiry['status']) => Promise<void>;
}

type TabType = 'systems' | 'leads' | 'metrics' | 'settings';

export function AdminDashboard({
  admin,
  systems,
  leads,
  metrics,
  currency,
  onCurrencyChange,
  onLogout,
  onRefreshData,
  onSaveSystem,
  onDeleteSystem,
  onUpdateLeadStatus,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('systems');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SoftwareSystem | null>(null);
  const [savingCurrency, setSavingCurrency] = useState(false);

  const handleOpenCreate = () => {
    setEditingSystem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (sys: SoftwareSystem) => {
    setEditingSystem(sys);
    setModalOpen(true);
  };

  const handleModalSave = async (data: Partial<SoftwareSystem>) => {
    await onSaveSystem(data, editingSystem?.id);
    setModalOpen(false);
  };

  const handleCurrencySelect = async (newCurr: CurrencyCode) => {
    setSavingCurrency(true);
    try {
      await onCurrencyChange(newCurr);
    } finally {
      setSavingCurrency(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex flex-col">
      
      {/* Top Admin Navbar */}
      <header className="bg-[#0b1424] border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volver a la Tienda</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">
                NOVA<span className="text-sky-400">SYSTEMS</span> ADMIN
              </span>
              <span className="text-[10px] text-emerald-400 block font-mono">
                Sesión 2FA Activa
              </span>
            </div>
          </div>
        </div>

        {/* Currency Switcher in Header & Admin Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Currency Selector Widget */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">Moneda Global:</span>
            <select
              value={currency}
              disabled={savingCurrency}
              onChange={(e) => handleCurrencySelect(e.target.value as CurrencyCode)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="USD" className="bg-slate-900 text-white">USD ($ Dólar)</option>
              <option value="EUR" className="bg-slate-900 text-white">EUR (€ Euro)</option>
              <option value="MXN" className="bg-slate-900 text-white">MXN ($ Peso Mex)</option>
              <option value="PEN" className="bg-slate-900 text-white">PEN (S/ Sol Peruano)</option>
              <option value="COP" className="bg-slate-900 text-white">COP ($ Peso Col)</option>
            </select>
          </div>

          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-white block">{admin.name}</span>
            <span className="text-[11px] text-slate-400 block font-mono">{admin.email}</span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all text-xs flex items-center gap-1.5"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
          
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('systems')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'systems'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Sistemas ({systems.length})
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'leads'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Leads ({leads.length})
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'metrics'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Métricas de Clics
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Configuración & Moneda
            </button>
          </div>

          {activeTab === 'systems' && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Publicar Nuevo Software
            </button>
          )}

        </div>

        {/* Tab 1: Systems CRUD */}
        {activeTab === 'systems' && (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((sys) => (
                <div
                  key={sys.id}
                  className="rounded-3xl glass-panel-elevated p-5 flex flex-col justify-between border-slate-800 hover:border-sky-500/30 transition-all"
                >
                  <div>
                    {/* Top image & category */}
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-900 mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sys.screenshotUrl}
                        alt={sys.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-[10px] text-sky-300 font-semibold backdrop-blur-md">
                        {sys.category}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 text-[10px] text-emerald-400 font-mono font-semibold backdrop-blur-md flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {sys.metrics.demoViews} clics
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{sys.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                      {sys.description}
                    </p>

                    <div className="flex items-center justify-between py-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400">Precio Base ({currency}):</span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(sys.priceUSD, currency)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {sys.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEdit(sys)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar "${sys.title}" del catálogo?`)) {
                          onDeleteSystem(sys.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Eliminar sistema"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Leads Management */}
        {activeTab === 'leads' && (
          <LeadsManager
            leads={leads}
            onUpdateStatus={onUpdateLeadStatus}
            onRefresh={onRefreshData}
          />
        )}

        {/* Tab 3: Metrics & Telemetry */}
        {activeTab === 'metrics' && <MetricsOverview metrics={metrics} />}

        {/* Tab 4: Platform & Currency Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl rounded-3xl glass-panel-elevated p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                Configuración de Moneda y Divisas
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Selecciona la divisa predeterminada en la que los clientes verán los precios de todo el catálogo público.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { code: 'USD' as CurrencyCode, name: 'Dólares Americanos (USD $)', desc: 'Moneda de referencia internacional' },
                { code: 'EUR' as CurrencyCode, name: 'Euros (EUR €)', desc: 'Para clientes de España y Unión Europea' },
                { code: 'MXN' as CurrencyCode, name: 'Pesos Mexicanos (MXN $)', desc: 'Tipo de cambio estimado 1 USD ≈ 18.50 MXN' },
                { code: 'PEN' as CurrencyCode, name: 'Soles Peruanos (PEN S/)', desc: 'Tipo de cambio estimado 1 USD ≈ 3.75 PEN' },
                { code: 'COP' as CurrencyCode, name: 'Pesos Colombianos (COP $)', desc: 'Tipo de cambio estimado 1 USD ≈ 4,100 COP' },
              ].map((item) => {
                const isSelected = currency === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleCurrencySelect(item.code)}
                    disabled={savingCurrency}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{item.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Activa en la Plataforma
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-500 text-slate-950 font-black text-xs' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* CRUD Modal */}
      <SystemModal
        system={editingSystem}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
      />

    </div>
  );
}
