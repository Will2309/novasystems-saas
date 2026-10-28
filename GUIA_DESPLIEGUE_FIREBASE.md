# 🔥 Guía Paso a Paso: Subir NovaSystems a Firebase Hosting Gratuito

Esta guía te explica cómo desplegar la plataforma **NovaSystems Pro** en **Firebase Hosting** utilizando la integración moderna de Google para **Next.js**.

---

## 📌 Lo que debes saber sobre Firebase y Next.js

Firebase Hosting ofrece un nivel gratuito muy generoso (**Plan Spark** con 10 GB de almacenamiento y 360 MB/día de transferencia de datos).

Nuestra plataforma está construida con **Next.js 16**, que incluye tanto **Frontend (Landing, Demos, Catálogo)** como **APIs de Backend en Node.js (Generación de OTP, autenticación 2FA y envío de correos con Resend)**.

Firebase soporta Next.js de dos formas:
1. **Firebase Web Frameworks (Recomendado)**: Despliega el frontend estático en el CDN global de Firebase Hosting y las rutas `/api/*` (OTP, login, leads) en Cloud Functions automáticas de Google Cloud.
2. **Firebase App Hosting**: El nuevo servicio administrado de Firebase conectado directamente a tu repositorio de GitHub.

---

## 🛠️ Paso 1: Crear tu Proyecto en la Consola de Firebase

1. Abre tu navegador y entra en la consola oficial:  
   👉 **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Haz clic en **"Crear un proyecto"** (o *"Agregar proyecto"*).
3. Asigna un nombre a tu proyecto (por ejemplo: `novasystems-web` o `mi-saas-enterprise`).
4. Anota el **Project ID** que Firebase genera automáticamente (por ejemplo: `novasystems-web-84920`).
5. Puedes desactivar Google Analytics si deseas un despliegue más rápido, y haz clic en **"Crear proyecto"**.

---

## 🔑 Paso 2: Iniciar Sesión en Firebase desde tu Terminal

Abre tu terminal (PowerShell o CMD) en la carpeta del proyecto:
`C:\Users\Will\.gemini\antigravity\scratch\novasystems-saas`

Ejecuta el siguiente comando:

```bash
npx firebase login
```

- Se abrirá automáticamente una ventana en tu navegador web de Google.
- Selecciona tu cuenta de Google y concede los permisos a **Firebase CLI**.
- En la terminal verás el mensaje: `✔ Success! Logged in as tu-correo@gmail.com`.

---

## ⚙️ Paso 3: Vincular tu Proyecto de Firebase

1. En la misma terminal, ejecuta:
   ```bash
   npx firebase use --add
   ```
2. Te mostrará la lista de tus proyectos creados en Firebase. Selecciona con las flechas del teclado el proyecto que creaste en el **Paso 1**.
3. Asígnale un alias (puedes escribir `default` y presionar Enter).

*(Alternativa rápida: Abre el archivo `.firebaserc` en la raíz de tu proyecto y reemplaza `"tu-proyecto-firebase-id"` por el ID de tu proyecto).*

---

## ⚡ Paso 4: Habilitar Web Frameworks en Firebase CLI

Para que Firebase detecte y compile Next.js automáticamente con todas sus rutas de API, ejecuta:

```bash
npx firebase experiments:enable webframeworks
```

Verás en la terminal: `✔ Enabled experiment webframeworks`.

---

## 🚀 Paso 5: Desplegar a Producción en Firebase

Ahora ejecuta el comando de despliegue:

```bash
npm run firebase:deploy
```
*(O también: `npx firebase deploy --only hosting`)*

### ¿Qué hará Firebase automáticamente?
1. Detecta que tu proyecto es **Next.js**.
2. Ejecuta `next build` para compilar el sitio optimizado.
3. Empaqueta los archivos estáticos (HTML, CSS, imágenes) y los sube a la CDN global de Firebase Hosting.
4. Prepara las rutas de servidor (`/api/auth/login`, `/api/auth/verify-2fa`, `/api/leads`) en Cloud Functions de Google.
5. Al finalizar, la terminal te entregará tu URL pública oficial gratuita con SSL HTTPS:
   ```
   ✔ Hosting URL: https://tu-proyecto-id.web.app
   ✔ Hosting URL: https://tu-proyecto-id.firebaseapp.com
   ```

---

## 🔐 Configurar Variables de Entorno en Firebase (OTP y Resend)

Para que el servidor en Firebase pueda enviar los correos reales de OTP y leads:

1. Ve a la consola de Firebase: **Configuración del Proyecto** (ícono de engranaje).
2. O bien, puedes subir tus variables de entorno con Firebase CLI:
   ```bash
   npx firebase functions:secrets:set RESEND_API_KEY
   npx firebase functions:secrets:set ADMIN_EMAIL
   npx firebase functions:secrets:set ADMIN_PASSWORD
   ```
3. O en tu panel de Google Cloud / Firebase App Hosting en la sección **Environment Variables**.

---

## 🌐 Conectar tu Dominio Propio en Firebase Hosting (Gratis)

1. En la consola de Firebase, ve al menú izquierdo -> **Hosting**.
2. Haz clic en **"Agregar dominio personalizado"**.
3. Escribe tu dominio (ejemplo: `novasystems.io` o `www.tudominio.com`).
4. Firebase te dará 2 registros DNS tipo `A` (direcciones IP).
5. Ve a tu proveedor de dominio (Cloudflare, GoDaddy, Namecheap) y añade esos registros `A`.
6. En unos minutos, Google generará un **certificado SSL gratuito** y tu sitio estará funcionando en tu propio dominio.

---

## 💡 Resumen de Comandos Rápidos

| Acción | Comando |
| :--- | :--- |
| **Iniciar sesión en Firebase** | `npx firebase login` |
| **Habilitar soporte Next.js** | `npx firebase experiments:enable webframeworks` |
| **Seleccionar tu proyecto** | `npx firebase use --add` |
| **Desplegar a Firebase Hosting** | `npm run firebase:deploy` |
