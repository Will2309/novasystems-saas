import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovaSystems Enterprise | Software Preconstruido Listo para Desplegar (POS, Clínicas, Ferreterías, Facturación)',
  description:
    'Plataforma corporativa de venta de sistemas y software preconstruido llave en mano con código fuente transferible. Arquitectura Clean Code, contenedores Docker y garantía QA de cero defectos.',
  keywords: [
    'software preconstruido',
    'sistema punto de venta',
    'sistema ferretería',
    'software clínicas',
    'facturación electrónica',
    'código fuente llave en mano',
    'SaaS',
  ],
  authors: [{ name: 'NovaSystems Pro Architecture Team' }],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#070d17] text-slate-100">
        {children}
      </body>
    </html>
  );
}
