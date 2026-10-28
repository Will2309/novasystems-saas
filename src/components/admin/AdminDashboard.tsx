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
  Settings,
  UserCheck,
  Building,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SoftwareSystem, LeadInquiry, AdminMetrics, CurrencyCode, TeamMember, PlatformSettings } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { MetricsOverview } from './MetricsOverview';
import { LeadsManager } from './LeadsManager';
import { SystemModal } from './SystemModal';
import { TeamMemberModal } from './TeamMemberModal';
import { UsersManager } from './UsersManager';

interface AdminDashboardProps {
  admin: { name: string; role: string; email: string };
  systems: SoftwareSystem[];
  leads: LeadInquiry[];
  team: TeamMember[];
  settings: PlatformSettings;
  metrics: AdminMetrics;
  onLogout: () => void;
  onRefreshData: () => void;
  onSaveSystem: (data: Partial<SoftwareSystem>, editingId?: string) => Promise<void>;
  onDeleteSystem: (id: string) => Promise<void>;
  onUpdateLeadStatus: (id: string, status: LeadInquiry['status']) => Promise<void>;
  onSaveTeamMember: (data: Omit<TeamMember, 'id'>, editingId?: string) => Promise<void>;
  onDeleteTeamMember: (id: string) => Promise<void>;
  onSaveSettings: (updates: Partial<PlatformSettings>) => Promise<void>;
}

type TabType = 'systems' | 'team' | 'leads' | 'metrics' | 'users' | 'settings';

export function AdminDashboard({
  admin,
  systems,
  leads,
  team,
  settings,
  metrics,
  onLogout,
  onRefreshData,
  onSaveSystem,
  onDeleteSystem,
  onUpdateLeadStatus,
  onSaveTeamMember,
  onDeleteTeamMember,
  onSaveSettings,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('systems');
  
  // Modals state
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SoftwareSystem | null>(null);

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  // Brand Settings Form state
  const [companyName, setCompanyName] = useState(settings.companyName || 'NovaSystems');
  const [companyTagline, setCompanyTagline] = useState(settings.companyTagline || 'Software Preconstruido');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [currency, setCurrency] = useState<CurrencyCode>(settings.currency || 'USD');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Handlers for Systems
  const handleOpenCreateSystem = () => {
    setEditingSystem(null);
    setSystemModalOpen(true);
  };

  const handleOpenEditSystem = (sys: SoftwareSystem) => {
    setEditingSystem(sys);
    setSystemModalOpen(true);
  };

  const handleSystemModalSave = async (data: Partial<SoftwareSystem>) => {
    await onSaveSystem(data, editingSystem?.id);
    setSystemModalOpen(false);
  };

  // Handlers for Team Members
  const handleOpenCreateTeam = () => {
    setEditingTeamMember(null);
    setTeamModalOpen(true);
  };

  const handleOpenEditTeam = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamModalOpen(true);
  };

  const handleTeamModalSave = async (data: Omit<TeamMember, 'id'>) => {
    await onSaveTeamMember(data, editingTeamMember?.id);
    setTeamModalOpen(false);
  };

  // Handler for Settings / Branding
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMessage(false);
    try {
      await onSaveSettings({
        companyName,
        companyTagline,
        logoUrl,
        currency,
      });
      setSettingsSavedMessage(true);
      setTimeout(() => setSettingsSavedMessage(false), 3000);
    } finally {
      setSavingSettings(false);
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
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-slate-700 p-0.5"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Shield className="w-4 h-4" />
              </div>
            )}
            <div>
              <span className="font-extrabold text-sm text-white">
                {settings.companyName || 'NOVA'}<span className="text-sky-400"> ADMIN</span>
              </span>
              <span className="text-[10px] text-emerald-400 block font-mono">
                Sesión 2FA Activa
              </span>
            </div>
          </div>
        </div>

        {/* Quick info & Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-white block">{admin.name}</span>
            <span className="text-[11px] text-slate-400 block font-mono">{admin.email}</span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
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
          
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveTab('systems')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'systems'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Sistemas ({systems.length})
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Equipo Dev & QA ({team.length})
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'metrics'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Métricas
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Usuarios & Accesos
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Logo & Nombre de Empresa
            </button>
          </div>

          {activeTab === 'systems' && (
            <button
              onClick={handleOpenCreateSystem}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Publicar Nuevo Software
            </button>
          )}

          {activeTab === 'team' && (
            <button
              onClick={handleOpenCreateTeam}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Agregar Profesional (Dev o QA)
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
                      onClick={() => handleOpenEditSystem(sys)}
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

        {/* Tab 2: Team Members CRUD (Rápido para agregar Devs y QAs) */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {team.map((member) => {
                const isDev = member.team === 'dev';
                return (
                  <div
                    key={member.id}
                    className="rounded-3xl glass-panel-elevated p-5 flex flex-col justify-between border-slate-800 hover:border-sky-500/30 transition-all shadow-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-white">{member.name}</h4>
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
                            <p className="text-xs text-sky-400 font-medium">{member.role}</p>
                            <p className="text-[11px] text-slate-400">{member.experienceYears}+ años de experiencia</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {member.bio}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-emerald-400 mb-3 flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{member.highlightMetric}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {member.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditTeam(member)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                        Editar Perfil
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar al profesional "${member.name}"?`)) {
                            onDeleteTeamMember(member.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Eliminar profesional"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Leads Management */}
        {activeTab === 'leads' && (
          <LeadsManager
            leads={leads}
            onUpdateStatus={onUpdateLeadStatus}
            onRefresh={onRefreshData}
          />
        )}

        {/* Tab 4: Metrics */}
        {activeTab === 'metrics' && <MetricsOverview metrics={metrics} />}

        {/* Tab 5: Multi-User Admin Access Management */}
        {activeTab === 'users' && <UsersManager />}

        {/* Tab 6: Branding & Company Customization */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl rounded-3xl glass-panel-elevated p-6 sm:p-8 space-y-6">
            
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-sky-400" />
                Personalización de Marca y Nombre de la Empresa
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Cambia el nombre comercial, el logotipo y la divisa. Los cambios se actualizarán al instante en la barra de navegación, el footer y toda la tienda.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>¡Cambios de marca y moneda guardados correctamente!</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de la Empresa / Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej: NovaSystems o MiEmpresa Software"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Eslogan / Subtítulo Corto
                  </label>
                  <input
                    type="text"
                    value={companyTagline}
                    onChange={(e) => setCompanyTagline(e.target.value)}
                    placeholder="Ej: Software Preconstruido & Llave en Mano"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Logo URL & Live Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL del Logotipo (Imagen PNG / SVG / WebP)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://ejemplo.com/mi-logo.png (deja vacío para usar icono corporativo)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * Si dejas este campo vacío, la plataforma usará automáticamente el icono de escudo corporativo.
                </p>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  Divisa Principal de la Tienda
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
                >
                  <option value="USD">USD ($ Dólar Americano - Internacional)</option>
                  <option value="EUR">EUR (€ Euro - España y Unión Europea)</option>
                  <option value="MXN">MXN ($ Peso Mexicano)</option>
                  <option value="PEN">PEN (S/ Sol Peruano)</option>
                  <option value="COP">COP ($ Peso Colombiano)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? 'Guardando...' : 'Guardar Cambios de Marca y Configuración'}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* Systems CRUD Modal */}
      <SystemModal
        system={editingSystem}
        isOpen={systemModalOpen}
        onClose={() => setSystemModalOpen(false)}
        onSave={handleSystemModalSave}
      />

      {/* Team Member CRUD Modal */}
      <TeamMemberModal
        member={editingTeamMember}
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        onSave={handleTeamModalSave}
      />

    </div>
  );
}
