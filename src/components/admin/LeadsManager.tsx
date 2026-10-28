'use client';

import React from 'react';
import { MessageSquare, RefreshCw, Building } from 'lucide-react';
import { LeadInquiry } from '@/types';
import { formatDate, buildWhatsAppLink } from '@/lib/utils';

interface LeadsManagerProps {
  leads: LeadInquiry[];
  onUpdateStatus: (id: string, status: LeadInquiry['status']) => Promise<void>;
  onRefresh: () => void;
}

export function LeadsManager({ leads, onUpdateStatus, onRefresh }: LeadsManagerProps) {
  const getStatusBadgeClass = (status: LeadInquiry['status']) => {
    switch (status) {
      case 'Nuevo':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Contactado':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Cotización Enviada':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Cerrado':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="rounded-3xl glass-panel-elevated p-6 sm:p-10 space-y-8 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Prospectos Comerciales y Solicitudes de Demo</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Registro en tiempo real de leads capturados a través del formulario público y el visor de demos.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm sm:text-base">
          No hay leads registrados aún. Las solicitudes de cotización aparecerán aquí.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 sm:px-6">Cliente / Empresa</th>
                <th className="py-4 px-4 sm:px-6">Sistema de Interés</th>
                <th className="py-4 px-4 sm:px-6">Mensaje / Requerimiento</th>
                <th className="py-4 px-4 sm:px-6">Fecha</th>
                <th className="py-4 px-4 sm:px-6">Estado</th>
                <th className="py-4 px-4 sm:px-6 text-right">Acción Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-900/50 transition-colors">
                  
                  {/* Client Info */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-white text-sm sm:text-base">{lead.fullName}</div>
                    {lead.companyName && (
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {lead.companyName}
                      </div>
                    )}
                    <div className="text-xs text-sky-400 font-mono mt-0.5">
                      {lead.email}
                    </div>
                  </td>

                  {/* System */}
                  <td className="py-4 px-4 sm:px-6 font-bold text-white text-sm sm:text-base">
                    {lead.systemTitle || lead.systemId}
                  </td>

                  {/* Message */}
                  <td className="py-4 px-4 sm:px-6 max-w-xs lg:max-w-md">
                    <p className="line-clamp-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {lead.message}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 sm:px-6 text-slate-400 font-mono text-xs whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadInquiry['status'])}
                      className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold focus:outline-none bg-slate-900 cursor-pointer ${getStatusBadgeClass(
                        lead.status
                      )}`}
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Cotización Enviada">Cotización Enviada</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <a
                      href={buildWhatsAppLink(lead.phone, lead.systemTitle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/70 transition-all font-bold text-xs sm:text-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
