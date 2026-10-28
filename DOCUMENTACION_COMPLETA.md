# 🛡️ NovaSystems Enterprise SaaS Marketplace
## Dossier Técnico, Arquitectura y Manual Operativo

**Proyecto:** Plataforma de Comercialización de Software Preconstruido (POS, Clínicas, Ferreterías, Facturación)  
**Fecha:** Octubre 2026  
**Ubicación del Código:** `C:\Users\Will\.gemini\antigravity\scratch\novasystems-saas`  
**Autor:** Arquitecto de Software Senior & Diseñador UX/UI  

---

## 📑 Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura Tecnológica & Clean Code](#2-arquitectura-tecnológica--clean-code)
3. [Matriz de Seguridad & Hardening OWASP](#3-matriz-de-seguridad--hardening-owasp)
4. [Estructura de la Plataforma Pública](#4-estructura-de-la-plataforma-pública)
5. [Visor de Demos Interactivas (Sandbox)](#5-visor-de-demos-interactivas-sandbox)
6. [Panel de Administración No-Code (/admin)](#6-panel-de-administración-no-code-admin)
7. [Guía para Abrir, Ver y Ejecutar el Código](#7-guía-para-abrir-ver-y-ejecutar-el-código)
8. [Conexión a Bases de Datos & CMS Headless](#8-conexión-a-bases-de-datos--cms-headless)

---

## 1. Visión General del Proyecto

NovaSystems Enterprise es una plataforma web corporativa de alta conversión diseñada específicamente para comercializar sistemas de software preconstruidos llave en mano con entrega de código fuente transferible o licenciamiento SaaS.

### Objetivos Clave de Negocio:
* **Generación de Confianza:** Proyectar solidez técnica, respaldo institucional y pruebas verificables de calidad.
* **Interacción en Vivo:** Permitir a los clientes potenciales probar demos interactivas en tiempo real antes de cotizar.
* **Conversión Ágil:** Capturar leads cualificados mediante formularios sanitizados y conexión instantánea con WhatsApp Business.
* **Administración No-Code:** Facilitar al equipo no técnico la adición y edición de sistemas sin tocar el código fuente.

---

## 2. Arquitectura Tecnológica & Clean Code

El sistema implementa una arquitectura modular con desacoplamiento estricto de capas:

* **Frontend:** Next.js (App Router) + React 19 + TypeScript.
* **Estilizado & Diseño:** Tailwind CSS v4 con variables corporativas Dark Navy (`#070d17`, `#0c1626`), Azul Neón (`#38bdf8`) y Verde Esmeralda (`#10b981`).
* **Iconografía:** Lucide React (iconos SVG optimizados y accesibles).
* **Capa de Servicios (Repository Pattern):**
  * `SystemsService` (`src/services/systemsService.ts`): Gestión de catálogo y telemetría de clics.
  * `LeadsService` (`src/services/leadsService.ts`): Almacenamiento y despacho de notificaciones webhook.
* **Rutas API Seguras:**
  * `GET /api/systems` - Listado y filtrado por industria.
  * `POST /api/systems` - Creación de software protegido por token.
  * `PUT/DELETE /api/systems/[id]` - Actualización y eliminación.
  * `POST /api/demos/track` - Incremento telemétrico de clics por demo.
  * `POST /api/leads` - Captura sanitizada de prospectos con rate-limit.
  * `POST /api/auth/login` y `/api/auth/verify-2fa` - Autenticación en 2 fases.

---

## 3. Matriz de Seguridad & Hardening OWASP

| Vector de Seguridad | Implementación en NovaSystems | Ubicación en el Código |
| :--- | :--- | :--- |
| **Autenticación en Dos Factores (2FA)** | Verificación de credenciales + código dinámico TOTP de 6 dígitos. | `src/components/admin/AdminLogin.tsx` |
| **Mitigación DDoS & Fuerza Bruta** | Algoritmo *Sliding Window Token Bucket* por IP. Límite estricto en login y contacto. | `src/lib/rate-limit.ts` |
| **Protección contra XSS & Script Injection** | Sanitizador recursivo que purga etiquetas `<script>`, atributos `on*` y cadenas maliciosas. | `src/lib/sanitize.ts` |
| **Clickjacking** | Cabecera HTTP `X-Frame-Options: SAMEORIGIN`. | `next.config.ts` |
| **MIME Sniffing** | Cabecera HTTP `X-Content-Type-Options: nosniff`. | `next.config.ts` |
| **Seguridad de Transporte** | HSTS (`Strict-Transport-Security: max-age=63072000; preload`). | `next.config.ts` |
| **Privacidad de Referencia** | `Referrer-Policy: strict-origin-when-cross-origin`. | `next.config.ts` |

---

## 4. Estructura de la Plataforma Pública

1. **Barra de Navegación (Navbar):** Logo con distintivo SSL, enlaces ancla, acceso protegido a `/admin` y botón directo a WhatsApp.
2. **Hero Section:** Titular corporativo de alto impacto, métricas de confianza en vivo (150+ demos, 99.98% SLA, 450+ clientes) y barra de búsqueda reactiva por palabras clave y categorías de industria.
3. **Catálogo de Sistemas:**
   * *NovaPOS Ferretería & Materiales:* Control fraccionado de stock (kilos, metros), lector de códigos de barras, tickets e inventario.
   * *NovaMed Clinic & Historial Clínico:* Expediente clínico (EHR), agenda con citas y recetas médicas con QR.
   * *NovaRetail Omnichannel ERP:* Sincronización de sucursales, alta velocidad de cobro y monedero electrónico.
   * *NovaFactura Cloud SaaS:* Facturación electrónica con firma XML, retenciones y portal para clientes.
   * *NovaRest GastroPro:* Mesas interactivas, comandero móvil y pantalla de cocina (KDS).
   * *NovaEdu Campus:* Matrículas en línea, control de pensiones y libretas de notas en PDF.
4. **Sección "Quiénes Somos" & Enfoque Dual Dev + QA:**
   * **Dev:** Clean Architecture, DDD, TypeScript estricto, Docker Containers.
   * **QA:** Cobertura de pruebas automatizadas >90%, pruebas de estrés k6 y SAST OWASP Top 10.
   * Garantía de 12 meses de soporte y estabilidad.
5. **Formulario de Contacto & Asesoría:**
   * Captura de nombre, empresa, email, teléfono, sistema de interés y mensaje.
   * Enlace inteligente a WhatsApp Business con texto predefinido que incluye el nombre del software seleccionado.
   * Preguntas frecuentes (licenciamiento perpetuo, código fuente, personalizaciones).

---

## 5. Visor de Demos Interactivas (Sandbox)

El modal [`LiveDemoModal.tsx`](src/components/landing/LiveDemoModal.tsx) ofrece una experiencia inmersiva:
* **Toggles Responsivos:** Vista Escritorio (100%), Tablet (768px) y Móvil (375px).
* **Selector de Roles:** Administrador Maestro, Cajero Principal y Auditor de Calidad.
* **Simuladores Funcionales:**
  * *Ferretería/Retail:* Carrito de compras interactivo donde se pueden agregar artículos en tiempo real, calcular IVA y emitir una factura electrónica fiscal simulada con firma digital.
  * *Clínica:* Ficha clínica del paciente con signos vitales y botón para emitir y firmar una receta digital con código QR.
* **Credenciales Simuladas:** Botón de copiado en 1 clic de usuario y contraseña.
* **Telemetría Automática:** Cada apertura del visor registra un evento en `/api/demos/track` que incrementa la métrica del sistema.

---

## 6. Panel de Administración No-Code (/admin)

### Acceso:
* **URL:** `http://localhost:3000/admin`
* **Usuario:** `admin@novasystems.io`
* **Contraseña:** `NovaEnterprise2026!`
* **Código 2FA / TOTP:** `123456` o `849201`

### Funcionalidades:
1. **Catálogo (CRUD):** Botón "Publicar Nuevo Software" con formulario intuitivo para ingresar título, precio, licencia, tags de tecnologías y módulos. Opción de editar o eliminar sistemas existentes.
2. **Leads / Consultas:** Visualización de prospectos con datos de contacto, sistema cotizado y selector de estado (*Nuevo*, *Contactado*, *Cotización Enviada*, *Cerrado*). Botón directo para iniciar chat en WhatsApp con el cliente.
3. **Analítica de Clics:** Gráficos y ranking de sistemas con mayor número de visualizaciones de demo para medir la demanda real del mercado.

---

## 7. Guía para Abrir, Ver y Ejecutar el Código

### Paso 1: Abrir la Carpeta en el Explorador de Archivos de Windows
Puedes abrir directamente la carpeta del proyecto en Windows ejecutando:
```powershell
explorer "C:\Users\Will\.gemini\antigravity\scratch\novasystems-saas"
```

### Paso 2: Abrir el Código en tu Editor (VS Code / Cursor / IDE)
Si tienes Visual Studio Code o un editor similar instalado:
```powershell
cd "C:\Users\Will\.gemini\antigravity\scratch\novasystems-saas"
code .
```

### Paso 3: Estructura de Carpetas del Proyecto
```
novasystems-saas/
├── src/
│   ├── app/
│   │   ├── admin/page.tsx          <-- Página del Panel de Administración
│   │   ├── api/                    <-- Rutas de API REST seguras
│   │   │   ├── auth/               <-- Login y verificación 2FA
│   │   │   ├── demos/track/        <-- Contador telemétrico de clics
│   │   │   ├── leads/              <-- Captura y gestión de prospectos
│   │   │   └── systems/            <-- Endpoints CRUD de sistemas
│   │   ├── globals.css             <-- Estilos globales y paleta Dark Navy
│   │   ├── layout.tsx              <-- Layout principal y metadata SEO
│   │   └── page.tsx                <-- Landing Page pública
│   ├── components/
│   │   ├── admin/                  <-- Componentes del Dashboard y Login 2FA
│   │   └── landing/                <-- Componentes de la Landing Page
│   ├── lib/
│   │   ├── mock-data.ts            <-- Datos iniciales enriquecidos
│   │   ├── rate-limit.ts           <-- Rate Limiter Token Bucket
│   │   ├── sanitize.ts             <-- Sanitizador contra XSS
│   │   └── utils.ts                <-- Formato de moneda y enlaces WhatsApp
│   ├── services/
│   │   ├── leadsService.ts         <-- Servicio de persistencia de leads
│   │   └── systemsService.ts       <-- Servicio de persistencia de sistemas
│   └── types/
│       └── index.ts                <-- Definiciones estrictas de TypeScript
├── next.config.ts                  <-- Cabeceras HTTP de seguridad
├── package.json                    <-- Dependencias y scripts
└── README.md                       <-- Guía de inicio rápido
```

### Paso 4: Ejecutar el Proyecto en Modo Desarrollo
En una terminal (PowerShell o CMD):
```powershell
cd "C:\Users\Will\.gemini\antigravity\scratch\novasystems-saas"
npm run dev
```
Luego abre en tu navegador web:
* **Tienda Pública:** `http://localhost:3000`
* **Panel de Administración:** `http://localhost:3000/admin`

---

## 8. Conexión a Bases de Datos & CMS Headless

La capa de servicios (`src/services/`) está lista para conectarse directamente a **PostgreSQL** o un CMS sin tocar la interfaz gráfica:

```typescript
// Ejemplo de conexión con Prisma en src/services/systemsService.ts:
import { prisma } from '@/lib/prisma';

export const SystemsService = {
  async getAll() {
    return await prisma.system.findMany({ where: { active: true } });
  },
  async incrementDemoClick(id: string) {
    return await prisma.system.update({
      where: { id },
      data: { demoViews: { increment: 1 } },
    });
  }
};
```

---
*Documento generado por Antigravity - Arquitectura de Software & Diseño UX/UI.*
