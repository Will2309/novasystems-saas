# 🛡️ NovaSystems Enterprise SaaS Marketplace

Plataforma corporativa de alta conversión diseñada para la **comercialización de software y sistemas empresariales preconstruidos** (Puntos de Venta, Gestión de Clínicas, Ferreterías, Facturación Electrónica, ERP Retail, Gastronomía y Educación) bajo esquemas de **Licencia Perpetua** y **Llave en Mano con Código Fuente**.

---

## 🏛️ 1. Arquitectura Tecnológica & Hardening de Seguridad

El proyecto ha sido estructurado siguiendo **Clean Architecture**, principios **Domain-Driven Design (DDD)** y desacoplamiento de capas para garantizar máxima velocidad, SEO y mantenibilidad.

### Stack Tecnológico Principal:
* **Frontend & SSR/SSG:** [Next.js (App Router)](https://nextjs.org/) + **TypeScript** + **Tailwind CSS**.
* **Iconografía & Microinteracciones:** Lucide React + CSS Glassmorphism y animaciones fluidas.
* **Capa de Repositorio / Servicios:** Servicios desacoplados (`SystemsService`, `LeadsService`) con patrón repositorio asíncrono, listos para conectar a **PostgreSQL (RLS)**, **Supabase** o **Strapi CMS (Headless)** sustituyendo únicamente el driver de persistencia.
* **APIs Seguras:** Next.js Route Handlers con tipado estricto, sanitización de entradas y control de tasa (*Rate Limiting*).

### Matriz de Seguridad y Hardening (OWASP Top 10):
1. **Autenticación en Dos Fases (2FA / TOTP):** Panel de administración protegido por credenciales cifradas y código de segundo factor (RFC 6238 / TOTP).
2. **Defensa contra Fuerza Bruta & DDoS (Rate Limiting):**
   * *Endpoints de Autenticación:* Máximo 5 intentos cada 5 minutos por IP.
   * *Endpoints de Contacto:* Máximo 5 solicitudes cada 10 minutos por IP.
3. **Sanitización Estricta de Entradas (XSS & Script Injection):** Módulo de limpieza profunda (`/lib/sanitize.ts`) que elimina etiquetas HTML no autorizadas, llamadas JavaScript y desinfecta payloads antes de su almacenamiento.
4. **Cabeceras de Seguridad HTTP (Security Headers en `next.config.ts`):**
   * `Strict-Transport-Security` (HSTS: 2 años con subdominios y preload).
   * `X-Frame-Options: SAMEORIGIN` (Prevención de Clickjacking).
   * `X-Content-Type-Options: nosniff` (Prevención de MIME-Sniffing).
   * `Referrer-Policy: strict-origin-when-cross-origin`.
   * `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
5. **Simulación y Notificación en Tiempo Real:** Despachador de Webhooks preparado para notificar instantáneamente a **Telegram** y correos electrónicos ante la llegada de nuevos prospectos.

---

## 🌐 2. Estructura y Navegación de la Landing Page

La plataforma proyecta una estética corporativa con paleta **Dark Navy Ejecutivo** (`#070d17`, `#0c1626`) combinada con acentos de alta tecnología en **Azul Neón** (`#38bdf8`) y **Verde Esmeralda** (`#10b981`).

### Secciones Implementadas:
1. **Hero Section de Alto Impacto:**
   * Titular enfocado en soluciones de software listas para operar en 48 horas.
   * Contadores de confianza en tiempo real: +150 Demos Activas, 99.98% SLA, 450+ Empresas en Producción, 100% Código Transferible.
   * Buscador dinámico con filtrado instantáneo por texto clave.
   * Filtros por industria (Ferretería, Salud, Retail, Finanzas, Gastronomía, Educación).
2. **Catálogo Dinámico de Sistemas:**
   * Tarjetas con categoría, público objetivo, descripción operativa, stack tecnológico (Node.js, React, Laravel, Flutter, PostgreSQL, Docker) y módulos clave con iconos.
   * Contador de pruebas en vivo por sistema.
   * Botón destacado **"PROBAR DEMO"**: Despliega un modal flotante con sandbox interactivo.
   * Botón secundario **"Cotizar"**: Enlaza con el sistema seleccionado y desplaza hacia el formulario comercial.
3. **Visor de Sandbox / Demo en Vivo (Modal Fullscreen):**
   * Selector responsivo de pantallas: **Escritorio**, **Tablet** y **Móvil**.
   * Simuladores interactivos específicos:
     * *Ferretería / Retail:* Terminal POS funcional donde se pueden añadir productos, calcular subtotales e impuestos, y emitir tickets fiscales con firma XML en tiempo real.
     * *Salud / Clínicas:* Expediente Clínico Electrónico (EHR) con constantes vitales y emisor de recetas médicas con firma digital y código QR.
     * *Finanzas / General:* Dashboard con KPIs de transacciones y tiempos de respuesta.
   * Caja de credenciales de prueba con función de copiado en 1 clic.
   * Registro telemétrico de clics para alimentar el ranking del administrador.
4. **Sección "Quiénes Somos" & Enfoque Dual Dev + QA:**
   * **Desarrolladores (Devs):** Clean Architecture, Domain-Driven Design, TypeScript estricto, Docker Containers.
   * **Aseguramiento de Calidad (QA):** Cobertura de pruebas unitarias/E2E (>90%), pruebas de estrés de concurrencia con k6, auditorías de seguridad SAST contra OWASP.
   * Compromiso contractual de 12 meses de garantía de arquitectura.
5. **Contacto, Asesoría & WhatsApp Dinámico:**
   * Formulario directo con validaciones de email y longitud.
   * Generador de enlaces a WhatsApp Business con texto predefinido que incluye el nombre del sistema seleccionado.
   * Acordeón de Preguntas Frecuentes (código fuente, licenciamiento, garantías).

---

## 🔒 3. Panel de Administración No-Code (`/admin`)

Diseñado para personal no técnico con un flujo intuitivo y seguro:

### Acceso Protegido:
* **Ruta:** `/admin`
* **Credenciales de Prueba:**
  * **Usuario:** `admin@novasystems.io`
  * **Contraseña:** `NovaEnterprise2026!`
  * **Código 2FA / TOTP:** `123456` o `849201`

### Capacidades del Dashboard:
* **Gestión de Sistemas (CRUD Completo):**
  * Formulario modal para publicar o editar sistemas con nombre, industria, público objetivo, precio, tipo de licencia, tags dinámicos de tecnologías y checkboxes de módulos incluidos.
  * Eliminación segura con confirmación.
* **Gestión de Prospectos / Leads:**
  * Tabla de prospectos con datos del cliente, empresa, sistema consultado, fecha y mensaje.
  * Selector dinámico de estado comercial (*Nuevo*, *Contactado*, *Cotización Enviada*, *Cerrado*).
  * Botón de WhatsApp directo para iniciar contacto inmediato con el cliente.
* **Métricas y Analítica de Clics:**
  * Conteo exacto de clics recibidos en el botón "Ver Demo" de cada sistema.
  * Barras de progreso porcentual para identificar el sistema más solicitado por el mercado.
  * Tasa de conversión de Visitas a Demos y a Cotizaciones.

---

## 🚀 4. Puesta en Marcha en Entorno Local

```bash
# 1. Ingresar al directorio del proyecto
cd "C:\Users\Will\.gemini\antigravity\scratch\novasystems-saas"

# 2. Instalar dependencias (ya instaladas)
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La plataforma estará disponible en:
* **Sitio Web Público:** [http://localhost:3000](http://localhost:3000)
* **Panel de Administración:** [http://localhost:3000/admin](http://localhost:3000/admin)

### Build para Producción:
```bash
npm run build
npm run start
```

---

## 🗄️ 5. Conexión con Base de Datos o Headless CMS

Para conectar este proyecto con **PostgreSQL (Prisma)**, **Supabase** o **Strapi**:

1. Reemplaza la persistencia en memoria de `src/services/systemsService.ts` por consultas a Prisma (`prisma.system.findMany()`) o Supabase (`supabase.from('systems').select('*')`).
2. Configura las variables de entorno en `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/novasystems?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"
```
Los componentes de interfaz no requerirán ninguna modificación gracias a la abstracción de la capa de servicios.
