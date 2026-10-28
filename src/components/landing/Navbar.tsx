'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Terminal, MessageSquare, Menu, X, Lock } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';

interface NavbarProps {
  companyName?: string;
  companyTagline?: string;
  logoUrl?: string;
}

export function Navbar({
  companyName = 'NovaSystems',
  companyTagline = 'Software Preconstruido',
  logoUrl = '',
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-sky-500/20 bg-[#070d17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Name (Dynamically customized from Admin) */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={companyName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-slate-900 border border-slate-700 p-0.5 shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-700 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#070d17] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-sky-400" />
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors uppercase">
                  {companyName}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide hidden lg:block">
                {companyTagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
            <a href="#catalogo" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors whitespace-nowrap">
              Catálogo
            </a>
            <a href="#dev-qa" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors whitespace-nowrap">
              Equipo Dev & QA
            </a>
            <a href="#garantia" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors whitespace-nowrap">
              Seguridad & SLA
            </a>
            <a href="#contacto" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors whitespace-nowrap">
              Cotizaciones
            </a>
          </div>

          {/* Quick Action Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-500/40 transition-all whitespace-nowrap cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>Acceso Admin</span>
            </Link>

            <a
              href={buildWhatsAppLink('+525541928800')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 transition-all whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>

            <a
              href="#catalogo"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 transition-all whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              <span>Ver Demos</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="xl:hidden flex items-center gap-2">
            <a
              href="#catalogo"
              className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 text-white"
            >
              Demos
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-slate-700 focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#091222] border-b border-sky-500/20 px-5 pt-4 pb-6 space-y-3 shadow-2xl">
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-sky-400 border-b border-slate-800"
          >
            Catálogo de Sistemas
          </a>
          <a
            href="#dev-qa"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-sky-400 border-b border-slate-800"
          >
            Equipo Dev & QA
          </a>
          <a
            href="#garantia"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-sky-400 border-b border-slate-800"
          >
            Seguridad & SLA
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-200 hover:text-sky-400 border-b border-slate-800"
          >
            Solicitar Cotización
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-sky-400"
          >
            <Lock className="w-4 h-4" />
            Panel de Administración
          </Link>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="#catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-sky-500 font-bold text-white text-sm shadow-md"
            >
              Explorar Demos
            </a>
            <a
              href={buildWhatsAppLink('+525541928800')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
