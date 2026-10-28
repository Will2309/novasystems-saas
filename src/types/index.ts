export type IndustryCategory = 
  | 'Todos'
  | 'Ferretería y Construcción'
  | 'Salud y Clínicas'
  | 'Retail y Supermercados'
  | 'Facturación y Finanzas'
  | 'Gastronomía y Restaurantes'
  | 'Educación y Academias';

export type LicenseType = 'Licencia Perpetua' | 'SaaS Mensual' | 'Llave en Mano (Código Fuente)';

export type CurrencyCode = 'USD' | 'EUR' | 'MXN' | 'PEN' | 'COP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateFromUSD: number;
}

export interface PlatformSettings {
  currency: CurrencyCode;
  companyName: string;
  companyTagline: string;
  logoUrl: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: 'dev' | 'qa';
  avatarUrl: string;
  bio: string;
  specialties: string[];
  experienceYears: number;
  highlightMetric: string;
}

export interface SystemModule {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface SoftwareSystem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: IndustryCategory;
  targetBusiness: string;
  description: string;
  priceUSD: number;
  licenseType: LicenseType;
  techStack: string[];
  modules: string[];
  features: string[];
  demoUrl: string;
  demoCredentials: {
    role: string;
    email: string;
    pass: string;
  }[];
  screenshotUrl: string;
  metrics: {
    demoViews: number;
    rating: number;
    deployments: number;
  };
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  systemId: string;
  systemTitle?: string;
  message: string;
  status: 'Nuevo' | 'Contactado' | 'Cotización Enviada' | 'Cerrado';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Ventas' | 'Soporte';
  password?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminMetrics {
  totalSystems: number;
  totalLeads: number;
  totalDemoClicks: number;
  conversionRatePercent: number;
  topSystems: {
    id: string;
    title: string;
    clicks: number;
    category: string;
  }[];
}
