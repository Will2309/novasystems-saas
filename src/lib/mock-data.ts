import { SoftwareSystem, LeadInquiry } from '@/types';

export const INITIAL_SYSTEMS: SoftwareSystem[] = [
  {
    id: 'sys-pos-ferreteria',
    slug: 'novapos-ferreteria-materiales',
    title: 'NovaPOS Ferretería & Materiales',
    tagline: 'Punto de venta e inventario fraccionado para ferreterías, tlapalerías y depósitos de construcción.',
    category: 'Ferretería y Construcción',
    targetBusiness: 'Ferreterías, Casas de Materiales, Distribuidoras de Tornillería y Sanitarios',
    description: 'Sistema integral de ventas de mostrador diseñado para el manejo de miles de códigos de barras, unidades de medida fraccionadas (kilos, metros, tramos, cajas), control estricto de multialmacén, cotizaciones rápidas a clientes y facturación electrónica instantánea.',
    priceUSD: 1490,
    licenseType: 'Llave en Mano (Código Fuente)',
    techStack: ['Node.js (NestJS)', 'Next.js 14 (React)', 'PostgreSQL', 'Prisma ORM', 'Docker', 'Tailwind CSS'],
    modules: [
      'Punto de Venta Ultra Rápido (Lector de barras & balanzas)',
      'Inventario Fraccionado & Alertas de Stock Mínimo',
      'Facturación Electrónica con Firma Digital (XML/PDF)',
      'Gestión de Compras, Proveedores y Cuentas por Pagar',
      'Cierre de Caja Ciega por Turnos y Arqueo Auditor',
      'Reportes de Rentabilidad, Kardex y Exportación a Excel'
    ],
    features: [
      'Modo Offline para contingencia de red',
      'Compatibilidad con impresoras térmicas EPSON / BIXOLON (ESC/POS)',
      'Soporte multi-sucursal con sincronización bidireccional',
      'Permisos por roles jerárquicos (Vendedor, Cajero, Administrador)'
    ],
    demoUrl: 'https://demo.novasystems.io/ferreteria',
    demoCredentials: [
      { role: 'Administrador Maestro', email: 'admin@ferrenova.com', pass: 'FerreAdmin2026!' },
      { role: 'Cajero Principal', email: 'cajero1@ferrenova.com', pass: 'CajaPass123' }
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=1200&q=80',
    metrics: {
      demoViews: 1420,
      rating: 4.95,
      deployments: 84
    },
    featured: true,
    active: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-03-20T10:30:00Z'
  },
  {
    id: 'sys-clinic-health',
    slug: 'novamed-gestion-clinicas',
    title: 'NovaMed Clinic & Historial Clínico',
    tagline: 'Plataforma médica para policlínicos, consultorios privados y centros odontológicos.',
    category: 'Salud y Clínicas',
    targetBusiness: 'Centros Médicos, Clínicas Dentales, Consultorios Multiespecialidad y Laboratorios',
    description: 'Gestión hospitalaria y ambulatoria completa con agenda médica en tiempo real, expediente clínico electrónico bajo normativas de privacidad médica, recetas digitales con código QR verificable, módulo de cobros particulares y convenios de aseguradoras.',
    priceUSD: 1850,
    licenseType: 'Llave en Mano (Código Fuente)',
    techStack: ['Laravel 11', 'Vue.js 3', 'PostgreSQL (RLS)', 'Redis', 'Docker Compose', 'Tailwind CSS'],
    modules: [
      'Expediente Clínico Electrónico (EHR) y Odontograma 3D',
      'Agenda Médica Inteligente con Recordatorios WhatsApp',
      'Recetario Digital con Firma Electrónica y Validación QR',
      'Módulo de Caja, Copagos y Facturación a Aseguradoras',
      'Gestión de Exámenes de Laboratorio y Rayos X',
      'Portal Web del Paciente para Consulta de Resultados'
    ],
    features: [
      'Cumplimiento HIPAA / GDPR para privacidad médica',
      'Historial de auditoría inmutable de accesos a historias clínicas',
      'Generación de presupuestos dentales en 1 clic',
      'Diseño 100% responsivo para tablets de médicos'
    ],
    demoUrl: 'https://demo.novasystems.io/medclinic',
    demoCredentials: [
      { role: 'Director Médico', email: 'director@novamed.com', pass: 'DocSecure99!' },
      { role: 'Recepcionista', email: 'recepcion@novamed.com', pass: 'Recep2026*' }
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    metrics: {
      demoViews: 1890,
      rating: 4.98,
      deployments: 112
    },
    featured: true,
    active: true,
    createdAt: '2026-01-20T09:15:00Z',
    updatedAt: '2026-04-02T14:10:00Z'
  },
  {
    id: 'sys-retail-erp',
    slug: 'novaretail-omnichannel-pos',
    title: 'NovaRetail Omnichannel ERP & POS',
    tagline: 'Control total de inventario y punto de venta para minimarkets, boutiques y tiendas retail.',
    category: 'Retail y Supermercados',
    targetBusiness: 'Supermercados, Tiendas de Ropa, Calzado, Perfumerías y Minimarkets',
    description: 'Solución empresarial de alto rendimiento para negocios comerciales que requieren procesamiento de ventas en menos de 2 segundos. Incluye sincronización de inventario omnicanal (tienda física + e-commerce), programa de lealtad por puntos, monedero electrónico y arqueo blindado.',
    priceUSD: 1690,
    licenseType: 'Llave en Mano (Código Fuente)',
    techStack: ['Go (Golang)', 'React 18', 'PostgreSQL', 'Redis Cache', 'Electron (App de Caja)', 'Docker'],
    modules: [
      'Punto de Cobro de Alta Velocidad (Atajos de teclado)',
      'Multialmacén con Transferencias y Guías de Remisión',
      'Fidelización de Clientes: Puntos, Monedero y Cupones',
      'Etiquetado con Códigos de Barras y Códigos QR',
      'Facturación Fiscal y Boletas Electrónicas',
      'Dashboard Gerencial con Métricas en Tiempo Real'
    ],
    features: [
      'Procesamiento garantizado de hasta 100,000 SKUs sin latencia',
      'Compatibilidad con pasarelas de pago y terminales POS Pinpad',
      'Exportación contable directa compatible con SAP y Siigo',
      'Notificaciones push ante rupturas de stock'
    ],
    demoUrl: 'https://demo.novasystems.io/retail',
    demoCredentials: [
      { role: 'Gerente General', email: 'gerencia@novaretail.io', pass: 'RetailBoss26' },
      { role: 'Cajero Líder', email: 'cajero@novaretail.io', pass: 'CashFast100' }
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
    metrics: {
      demoViews: 2150,
      rating: 4.92,
      deployments: 145
    },
    featured: true,
    active: true,
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-04-10T16:45:00Z'
  },
  {
    id: 'sys-invoice-saas',
    slug: 'novafactura-cloud-finanzas',
    title: 'NovaFactura Cloud & Facturación Electrónica',
    tagline: 'Motor multi-empresa de facturación digital, cobranzas automatizadas y gestión tributaria.',
    category: 'Facturación y Finanzas',
    targetBusiness: 'Estudios Contables, Empresas de Servicios, Distribuidoras y Agencias',
    description: 'Sistema SaaS multi-inquilino (multi-tenant) listo para operar y revender. Genera facturas electrónicas, notas de crédito, guías de despacho y retenciones con certificación directa ante entidades tributarias (SAT, SUNAT, DIAN, SRI, AFIP). Incluye pasarelas de pago integradas y recordatorios de cobro.',
    priceUSD: 1990,
    licenseType: 'Llave en Mano (Código Fuente)',
    techStack: ['Next.js 14', 'Node.js / Express', 'PostgreSQL (Multi-tenant)', 'AWS S3', 'BullMQ', 'Tailwind CSS'],
    modules: [
      'Emisión de Facturas, Boletas, Notas y Retenciones Fiscales',
      'Firma Digital de XML con Certificados de Seguridad X.509',
      'Módulo de Cobranzas Automáticas vía WhatsApp y Email',
      'Conciliación Bancaria y Cuentas por Cobrar',
      'Portal de Autoconsulta y Descarga para Clientes',
      'API RESTful para integración con sistemas externos'
    ],
    features: [
      'Arquitectura Multi-tenant aislada por Schema',
      'Generador de PDF personalizable con logo corporativo',
      'Validación automática de estado tributario de clientes',
      'Balance de ingresos y gastos con proyecciones de flujo de caja'
    ],
    demoUrl: 'https://demo.novasystems.io/facturacion',
    demoCredentials: [
      { role: 'Contador Principal', email: 'contador@novafactura.net', pass: 'TaxMaster#2026' },
      { role: 'Operador Comercial', email: 'ventas@novafactura.net', pass: 'Factura2026' }
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    metrics: {
      demoViews: 1730,
      rating: 4.97,
      deployments: 98
    },
    featured: true,
    active: true,
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-04-18T18:00:00Z'
  },
  {
    id: 'sys-gastro-rest',
    slug: 'novarest-gastronomia-pos',
    title: 'NovaRest GastroPro & Comandas Táctiles',
    tagline: 'Sistema de comandas, cocina KDS, delivery y reservas para restaurantes y bares.',
    category: 'Gastronomía y Restaurantes',
    targetBusiness: 'Restaurantes, Pizzerías, Bares, Cafeterías y Cadenas de Comida Rápida',
    description: 'Control ágil del salón, cocina y caja. Permite a los meseros tomar pedidos desde tablets o celulares, enviando la comanda en tiempo real a las pantallas de cocina (KDS) o ticketeras por estación. Incluye control de recetas, costos de insumos, división de cuentas y módulo de delivery.',
    priceUSD: 1550,
    licenseType: 'Llave en Mano (Código Fuente)',
    techStack: ['Flutter (Meseros App)', 'FastAPI (Python)', 'React 18', 'PostgreSQL', 'WebSockets', 'Tailwind CSS'],
    modules: [
      'Mapa Interactivo de Mesas en Vivo con Estados de Tiempo',
      'Comandero Móvil para Meseros (Android & iOS)',
      'Pantalla Digital de Cocina (KDS) con Tiempos de Preparación',
      'Gestión de Recetas y Descuento Automático de Ingredientes',
      'División de Cuentas por Comensal y Propinas',
      'Módulo de Delivery Integrado con Google Maps'
    ],
    features: [
      'Comunicación en tiempo real por WebSockets sin recarga',
      'Carta digital interactiva mediante código QR en mesa',
      'Control de mermas y auditoría de platos cancelados',
      'Integración con impresoras de cocina y barra independientes'
    ],
    demoUrl: 'https://demo.novasystems.io/gastro',
    demoCredentials: [
      { role: 'Administrador Restaurante', email: 'gerente@novarest.com', pass: 'ChefAdmin99' },
      { role: 'Jefe de Cocina', email: 'cocina@novarest.com', pass: 'KdsScreen26' }
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    metrics: {
      demoViews: 1310,
      rating: 4.89,
      deployments: 67
    },
    featured: false,
    active: true,
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-04-12T09:30:00Z'
  },
  {
    id: 'sys-edu-campus',
    slug: 'novaedu-campus-academico',
    title: 'NovaEdu Campus & Control de Pensiones',
    tagline: 'Gestión académica, matrículas, control de pagos y aula virtual para colegios e institutos.',
    category: 'Educación y Academias',
    targetBusiness: 'Colegios Privados, Academias Preuniversitarias, Institutos de Idiomas y Talleres',
    description: 'Plataforma administrativa integral para instituciones educativas. Gestiona matrículas, emisión masiva de boletas de pensiones, control de morosidad con notificaciones automáticas, registro de calificaciones, asistencias por código de barras y aula virtual para entrega de tareas.',
    priceUSD: 1650,
    licenseType: 'Llave en Mano (Código Fuente)',
    techStack: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe / PayPal API', 'Docker'],
    modules: [
      'Módulo de Matrículas en Línea y Ficha del Estudiante',
      'Facturación Masiva de Pensiones y Cobranza Recurrente',
      'Libreta de Calificaciones Digital y Boletas de Notas en PDF',
      'Control de Asistencia de Alumnos y Docentes',
      'Portal para Padres con Estado de Cuenta y Notificaciones',
      'Módulo de Biblioteca Virtual y Material de Estudio'
    ],
    features: [
      'Pasarela de pago para pago con tarjeta de crédito/débito',
      'Reporte automático de alumnos con cuotas vencidas',
      'Módulo de mensajería masiva a apoderados por SMS/WhatsApp',
      'Configuración flexible de períodos lectivos y mallas curriculares'
    ],
    demoUrl: 'https://demo.novasystems.io/educampus',
    demoCredentials: [
      { role: 'Director Académico', email: 'director@novaedu.edu', pass: 'CampusMaster26' },
      { role: 'Secretaría de Cobranzas', email: 'pagos@novaedu.edu', pass: 'PagoSeguro123' }
    ],
    screenshotUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    metrics: {
      demoViews: 940,
      rating: 4.91,
      deployments: 43
    },
    featured: false,
    active: true,
    createdAt: '2026-03-05T14:20:00Z',
    updatedAt: '2026-04-15T11:00:00Z'
  }
];

export const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: 'lead-101',
    fullName: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@ferreconstruccion.com',
    phone: '+52 55 4192 8831',
    companyName: 'Ferretera del Centro S.A.',
    systemId: 'sys-pos-ferreteria',
    systemTitle: 'NovaPOS Ferretería & Materiales',
    message: 'Tenemos 4 sucursales y necesitamos cambiar nuestro sistema actual. Requerimos control de inventario fraccionado y migración de nuestra base de datos en SQL Server.',
    status: 'Cotización Enviada',
    createdAt: '2026-04-20T10:14:00Z'
  },
  {
    id: 'lead-102',
    fullName: 'Dra. Mariana Valenzuela',
    email: 'm.valenzuela@policlinicavida.com',
    phone: '+57 312 849 2011',
    companyName: 'Policlínica Vida & Salud',
    systemId: 'sys-clinic-health',
    systemTitle: 'NovaMed Clinic & Historial Clínico',
    message: 'Nos interesa el código fuente para implementar en nuestros propios servidores en AWS. Deseamos saber si incluye capacitación para nuestros 15 médicos.',
    status: 'Contactado',
    createdAt: '2026-04-22T15:30:00Z'
  },
  {
    id: 'lead-103',
    fullName: 'Lic. Roberto Castillo',
    email: 'roberto@castillorepresentaciones.pe',
    phone: '+51 987 654 321',
    companyName: 'Grupo Retail Castillo',
    systemId: 'sys-retail-erp',
    systemTitle: 'NovaRetail Omnichannel ERP & POS',
    message: 'Solicito demostración técnica guiada de la app de caja y el soporte para balanzas de peso continuas.',
    status: 'Nuevo',
    createdAt: '2026-04-25T09:05:00Z'
  }
];
