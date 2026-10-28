# 🚀 Guía de Despliegue a Producción, Configuración de Correo Real y OTP

Esta guía detalla los pasos exactos para llevar la plataforma **NovaSystems Pro** a producción, activar el envío de **correos electrónicos reales** (alertas de leads y confirmaciones a clientes) y habilitar la entrega de códigos **OTP criptográficos por correo** para la autenticación 2FA del Panel de Administración.

---

## 📑 Índice de Contenidos

1. [¿Cómo funciona el sistema de Correo y OTP?](#1-cómo-funciona-el-sistema-de-correo-y-otp)
2. [Paso a Paso: Configurar Correo Real con Resend (Gratis)](#2-paso-a-paso-configurar-correo-real-con-resend-gratis)
3. [Gestión Multiusuario y Roles Administrativos](#3-gestión-multiusuario-y-roles-administrativos)
4. [Configuración de Variables de Entorno (.env)](#4-configuración-de-variables-de-entorno-env)
5. [Opción A: Despliegue en Vercel (Recomendado - 1 Clic)](#5-opción-a-despliegue-en-vercel-recomendado---1-clic)
6. [Opción B: Despliegue en VPS Linux (Ubuntu con Docker / PM2 + Nginx SSL)](#6-opción-b-despliegue-en-vps-linux-ubuntu-con-docker--pm2--nginx-ssl)
7. [Configuración de Dominio y Cloudflare WAF](#7-configuración-de-dominio-y-cloudflare-waf)
8. [Migración de Base de Datos (PostgreSQL / Supabase)](#8-migración-de-base-de-datos-postgresql--supabase)

---

## 1. ¿Cómo funciona el sistema de Correo y OTP?

El sistema implementa una arquitectura empresarial desacoplada:

1. **Autenticación 2FA con OTP Criptográfico (`/api/auth/login` y `/api/auth/verify-2fa`)**:
   - El administrador ingresa su correo y contraseña.
   - Si las credenciales son válidas, `OtpService` genera un código numérico aleatorio de 6 dígitos mediante `crypto.randomInt(100000, 999999)`.
   - El código se almacena en memoria con un tiempo de expiración (TTL) estricto de **10 minutos** y un límite de **5 intentos máximos** (prevención contra ataques de fuerza bruta).
   - Inmediatamente, `EmailService` envía un correo corporativo con diseño HTML ejecutivo a la dirección configurada en `ADMIN_EMAIL`.
   - El administrador introduce los 6 dígitos en la pantalla de verificación y el sistema emite una cookie segura `HttpOnly` y `SameSite: lax`.

2. **Notificaciones de Leads (`/api/leads`)**:
   - Cuando un prospecto completa el formulario en la landing:
     - Se envía una **alerta al Administrador** con todos los datos del cliente, empresa, sistema de interés y enlace directo a WhatsApp.
     - Se envía un **correo de confirmación al Cliente** notificándole que su solicitud fue recibida.
     - Si está configurado Telegram, se despacha un webhook al grupo comercial.

---

## 2. Paso a Paso: Configurar Correo Real con Resend (Gratis)

Hemos integrado **Resend** como proveedor oficial porque es el estándar moderno en aplicaciones Next.js/React. No requiere librerías pesadas y ofrece **3,000 correos al mes completamente gratis**.

### Pasos para obtener tu API Key en 2 minutos:

1. Ingresa a [https://resend.com](https://resend.com) y crea tu cuenta gratuita (puedes registrarte con Google o GitHub sin tarjeta de crédito).
2. En el panel izquierdo, haz clic en **API Keys**.
3. Haz clic en **Create API Key**:
   - Nombre: `NovaSystems Production`
   - Permisos: `Full access`
4. Copia tu clave (empieza por `re_...`).

> **Modo Pruebas vs Producción:**
> - **Para pruebas rápidas sin configurar dominio:** Puedes enviar correos usando como remitente `onboarding@resend.dev` hacia el correo con el que te registraste en Resend.
> - **Para producción con tu propio dominio (ej. `@tuempresa.com`):**
>   1. En Resend, ve a la pestaña **Domains** y haz clic en **Add Domain**.
>   2. Escribe tu dominio (ej. `novasystems.io`).
>   3. Agrega los 3 registros DNS (DKIM, SPF y DMARC) que te indica Resend en tu proveedor de dominio (Cloudflare, GoDaddy, Namecheap, etc.).
>   4. Una vez verificado (toma unos minutos), cambia en tu `.env`:  
>      `EMAIL_FROM="NovaSystems <seguridad@tuempresa.com>"`

---

## 3. Gestión Multiusuario y Roles Administrativos

El sistema cuenta con soporte para múltiples administradores con entrega individual de códigos 2FA/OTP:

- **SuperAdmin Propietario (`willja960@gmail.com`)**: Control total del catálogo, finanzas, métricas y gestión de accesos.
- **Nuevos Administradores**:
  1. Entra a `/admin` con tu correo.
  2. Ve a la pestaña **"Usuarios & Accesos"**.
  3. Haz clic en **"+ Agregar Nuevo Administrador"**.
  4. Ingresa el nombre, correo real y rol (*SuperAdmin*, *Admin*, *Ventas* o *Soporte*).
  5. Cada usuario que agregues recibirá su código OTP exclusivo en su propia bandeja de correo al iniciar sesión.

---

## 4. Configuración de Variables de Entorno (.env)

Crea un archivo llamado `.env.local` (o agrégalas en el panel de tu hosting):

```env
# URL base de tu plataforma
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
NODE_ENV="production"

# Credenciales del Administrador (Aquí recibirás el código OTP)
ADMIN_EMAIL="tu-correo-personal@gmail.com"
ADMIN_PASSWORD="TuContraseñaSegura2026!"

# Resend API Key para envío de correos reales
RESEND_API_KEY="re_123456789_abcdefgh"
EMAIL_FROM="NovaSystems <onboarding@resend.dev>"

# Opcional: Notificaciones por Telegram Bot
# TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
# TELEGRAM_CHAT_ID="-1001234567890"
```

---

## 4. Opción A: Despliegue en Vercel (Recomendado - 1 Clic)

Vercel es la plataforma de los creadores de Next.js y ofrece la mejor infraestructura Serverless, Edge Functions y certificados SSL automáticos.

### Pasos:
1. Sube tu proyecto a un repositorio de **GitHub**, **GitLab** o **Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "feat: NovaSystems Pro production ready"
   git remote add origin https://github.com/tu-usuario/novasystems.git
   git push -u origin main
   ```
2. Entra en [https://vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **"Add New..."** -> **"Project"**.
4. Selecciona tu repositorio `novasystems`.
5. En la sección **Environment Variables**, añade:
   - `ADMIN_EMAIL`: Tu correo real donde te llegará el código OTP.
   - `ADMIN_PASSWORD`: Tu contraseña de administrador.
   - `RESEND_API_KEY`: Tu clave de Resend.
   - `EMAIL_FROM`: `NovaSystems <onboarding@resend.dev>` (o tu dominio verificado).
   - `NEXT_PUBLIC_APP_URL`: `https://tu-proyecto.vercel.app` (o tu dominio final).
6. Haz clic en **Deploy**.
7. ¡Listo! En 60 segundos tu sitio estará online con SSL HTTPS y CDN global.

---

## 5. Opción B: Despliegue en VPS Linux (Ubuntu con Docker / PM2 + Nginx SSL)

Si dispones de un servidor VPS en DigitalOcean, AWS EC2, Hetzner, Linode o Contabo:

### Método con PM2 y Node.js:

1. **Instalar dependencias en el servidor:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx git
   sudo npm install -g pm2
   ```

2. **Clonar y compilar el proyecto:**
   ```bash
   cd /var/www
   git clone https://github.com/tu-usuario/novasystems.git
   cd novasystems
   npm install
   nano .env.local  # Pega tus variables de entorno aquí
   npm run build
   ```

3. **Iniciar el servicio con PM2:**
   ```bash
   pm2 start npm --name "novasystems" -- start
   pm2 save
   pm2 startup
   ```

4. **Configurar Nginx como Reverse Proxy:**
   Crea `/etc/nginx/sites-available/novasystems`:
   ```nginx
   server {
       server_name tu-dominio.com www.tu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Habilita el sitio y reinicia Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/novasystems /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Certificado SSL Gratuito con Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
   ```

---

## 6. Configuración de Dominio y Cloudflare WAF

Para cumplir con la recomendación de máxima seguridad corporativa:

1. Agrega tu dominio en [Cloudflare](https://dash.cloudflare.com).
2. Apunta los Nameservers de tu registrador a Cloudflare.
3. Activa la nube naranja **Proxy (Proxied)** en tu registro `A` o `CNAME`.
4. En la pestaña **Security -> WAF**, activa:
   - **Bot Fight Mode**: Mitigación de bots automatizados.
   - **Rate Limiting Rule**: Protege `/api/auth/*` limitando a 10 peticiones por minuto por IP.
   - **Under Attack Mode** disponible en caso de mitigación DDoS extrema.

---

## 7. Migración de Base de Datos (PostgreSQL / Supabase)

Actualmente la plataforma utiliza repositorios tipados en memoria (`systemsService.ts`, `leadsService.ts`, `teamService.ts`, `settingsService.ts`), los cuales son ideales para validación inmediata y no requieren bases de datos externas para operar.

Cuando decidas conectar una base de datos PostgreSQL persistente:
1. Crea un proyecto en [Supabase](https://supabase.com) (PostgreSQL gratuito en la nube).
2. En Supabase SQL Editor ejecuta las tablas para `systems`, `leads`, `team_members` y `site_settings`.
3. Instala Prisma:
   ```bash
   npm install @prisma/client
   npm install prisma --save-dev
   npx prisma init
   ```
4. Conecta tu `DATABASE_URL` y reemplaza las llamadas en `src/services/*`.

---

## 📞 Soporte y Verificación

Para probar que todo funciona:
1. Visita `/admin`.
2. Ingresa tus credenciales.
3. Revisa tu bandeja de entrada de correo electrónico: verás el código OTP corporativo de 6 dígitos con diseño premium.
4. Ingresa el código y habrás autenticado tu sesión en producción.
