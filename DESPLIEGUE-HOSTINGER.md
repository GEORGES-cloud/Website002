# Desplegar Zeñorío en Hostinger (sin el error 503)

## ⚡ Despliegue AUTOMÁTICO (activo desde 2026-07-02)

Cada `git push` a `main` que toque `public/` **sube los cambios solos a Hostinger**
(GitHub Action `.github/workflows/deploy.yml`, sincroniza por FTP solo lo cambiado).

**Configuración única (5 min), solo la primera vez:**
1. En **hPanel → Archivos → Cuentas FTP**: apunta el **host** (IP o `ftp.tudominio`),
   el **usuario**, y crea/restablece la **contraseña**.
2. En GitHub → `Website002` → **Settings → Secrets and variables → Actions** →
   *New repository secret*, crea estos 3:
   - `FTP_SERVER` · `FTP_USERNAME` · `FTP_PASSWORD`
3. Listo. Comprueba la primera ejecución en la pestaña **Actions** del repo
   (la primera sube todo, ~26 MB; las siguientes solo lo que cambie).

> Si la cuenta FTP ya está limitada a `public_html`, edita el workflow y cambia
> `server-dir: public_html/` por `./`. Si el servidor rechaza FTPS, cambia
> `protocol: ftps` por `ftp`.

Las opciones de abajo quedan como **manuales de respaldo**.

---

## Qué está pasando
El **503 "Service Unavailable"** que ves en `zeñorio.com` es la página de error de
Hostinger: está intentando ejecutar la app de **Node.js y no responde** (se cae o no
arranca). Es un fallo del servidor, no de la web.

**No hace falta Node.js.** Esta web es estática (HTML/CSS/JS) y el formulario de reserva
**cae automáticamente a WhatsApp** cuando no hay servidor. Así que la forma más fiable y
rápida es servirla como **sitio estático**: subir el contenido de `public/` a `public_html`.
Eso elimina el 503 por completo.

---

## Opción A · Subir el ZIP (recomendada, 5 min)

1. Entra en **hPanel** de Hostinger → tu web `zeñorio.com`.
2. **Archivos → Administrador de archivos** → abre la carpeta **`public_html`**.
3. **Borra lo que haya dentro** de `public_html` (la página por defecto de Hostinger,
   `default.php`, etc.). Si había una app de Node configurada, en
   **Avanzado → Node.js** deténla/elimínala para que no intercepte el dominio.
4. Pulsa **Subir archivos** y sube **`zenorio-hostinger.zip`**
   (está en tu Escritorio, en la carpeta `Zeñorio`).
5. Clic derecho sobre el zip subido → **Extraer** (aquí mismo, en `public_html`).
6. Borra el `.zip` ya extraído. Debe quedar así:
   ```
   public_html/
     index.html
     carta.html
     .htaccess
     css/  js/  assets/  (etc.)
   ```
7. Abre `https://zeñorio.com` — debería cargar la web. (Si ves aún el 503, espera 1-2 min
   y recarga con Ctrl+F5.)

> El `.htaccess` incluido ya activa compresión, caché, WebP automático y cabeceras de
> seguridad. Si el Administrador de archivos oculta los archivos que empiezan por punto,
> activa **"Mostrar archivos ocultos"** para verlo.

## Activar HTTPS
En hPanel → **Seguridad → SSL**: asegúrate de que el certificado (gratis) está **activo**,
y activa **Forzar HTTPS**. El dominio con eñe (`zeñorio.com`) funciona con normalidad.

---

## Opción B · Despliegue por Git (alternativa)
Hostinger permite conectar un repositorio en **hPanel → Avanzado → Git**. El repo está en
`https://github.com/GEORGES-cloud/Website002`. Ojo: la web vive dentro de `public/`, así que
tras clonar habría que apuntar el directorio público a `public/` o mover su contenido a
`public_html`. Por eso, para simplicidad, la **Opción A** es la recomendada.

---

## Notas
- **Reservas:** funcionan sin servidor. Al enviar el formulario se abre un **WhatsApp
  prerrellenado** al `+34 625 84 89 36`. (Se pierde solo el registro interno en
  `data/reservas.log`, que no se usa.)
- **Actualizar la web más adelante:** vuelve a generar el zip (o sube solo los archivos
  cambiados de `public/`) y reemplázalos en `public_html`.
- **Si prefieres mantener Node.js** (no necesario): en hPanel → Node.js, entry point
  `server.js`, comando `npm start`, Node 18+, y ejecuta `npm install`. Pero para este sitio,
  el estático es más rápido, más barato y no da 503.
