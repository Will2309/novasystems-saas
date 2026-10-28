'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Terminal, Code2 } from 'lucide-react';

interface FooterProps {
  companyName?: string;
  logoUrl?: string;
}

export function Footer({ companyName = 'NovaSystems', logoUrl = '' }: FooterProps) {
  return (
    <footer className="bg-[#050a12] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-slate-700 p-0.5"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                  <Shield className="w-4 h-4" />
                </div>
              )}
              <span className="font-extrabold text-base text-white tracking-tight uppercase">
                {companyName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataforma enterprise de comercialización de software preconstruido, probado y listo para producción con código fuente transferible.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Servidores Operativos 99.98% SLA
            </div>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Soluciones & Verticales
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#catalogo" className="hover:text-sky-400 transition-colors">NovaPOS Ferretería</a></li>
              <li><a href="#catalogo" className="hover:text-sky-400 transition-colors">NovaMed Clínica & EHR</a></li>
              <li><a href="#catalogo" className="hover:text-sky-400 transition-colors">NovaRetail Omnichannel ERP</a></li>
              <li><a href="#catalogo" className="hover:text-sky-400 transition-colors">NovaFactura Cloud SaaS</a></li>
              <li><a href="#catalogo" className="hover:text-sky-400 transition-colors">NovaRest Gastronomía</a></li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Garantías & Calidad
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#dev-qa" className="hover:text-sky-400 transition-colors">Metodología Clean Dev + QA</a></li>
              <li><a href="#garantia" className="hover:text-sky-400 transition-colors">Garantía de 12 Meses</a></li>
              <li><a href="#garantia" className="hover:text-sky-400 transition-colors">Hardening OWASP Top 10</a></li>
              <li><a href="#dev-qa" className="hover:text-sky-400 transition-colors">Contenedores Docker Incluidos</a></li>
            </ul>
          </div>

          {/* Admin & Security Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Zona de Seguridad
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-400">
                <Lock className="w-4 h-4" />
                <span className="font-semibold text-white text-xs">Panel Administrador</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Gestión no-code de sistemas, catálogo, leads y analítica de clics.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold hover:bg-sky-500/30 transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Ingresar a /admin</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {companyName} Enterprise Inc. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              Arquitectura Next.js + PostgreSQL RLS
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Cloudflare WAF Enabled</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
