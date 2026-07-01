# Zeñorio · Marbella — sitio web

Sitio web premium para **Zeñorio**, restaurante mediterráneo en Nueva Andalucía (Marbella).
Una sola página, totalmente responsive, con **hero en vídeo**, carta interactiva,
versión **ES/EN**, formulario de reserva conectado a **WhatsApp** y servidor **Node.js**.

---

## 🚀 Arranque rápido

### Opción A — doble clic (la más fácil)
Haz doble clic en **`start.bat`**. Instala lo necesario la primera vez, abre el
navegador y arranca el servidor en `http://localhost:3000`.

### Opción B — terminal
```bash
npm install     # solo la primera vez
npm start
```
Luego abre `http://localhost:3000`.

> **Nota:** en este equipo Node está instalado en `C:\Program Files\nodejs` pero no
> figura en el PATH del sistema. `start.bat` ya lo añade automáticamente. Si usas la
> terminal a mano, ejecútala desde esa ruta o añade Node al PATH.

Para cambiar el puerto: `set PORT=8080 && npm start` (o `node server.js 8080`).

---

## 🗂️ Estructura

```
Zeñorio/
├─ server.js              # Servidor Express (estáticos + API de reservas)
├─ package.json
├─ start.bat              # Arranque con doble clic (Windows)
├─ data/reservas.log      # Reservas recibidas (se crea solo)
└─ public/                # El sitio web
   ├─ index.html          # Toda la página y sus textos (ES)
   ├─ css/styles.css      # Diseño y responsive
   ├─ js/
   │  ├─ main.js          # Interacciones (menú, carta, reservas, scroll…)
   │  └─ i18n.js          # Traducción al inglés
   └─ assets/
      ├─ video/           # hero · cocina · terraza · plato (.mp4)
      ├─ img/             # Fotografía (20 imágenes)
      └─ favicon.svg
```

---

## ✏️ Cómo personalizar

| Quiero cambiar… | Dónde |
|---|---|
| **Vídeo del hero** | Sustituye `public/assets/video/hero.mp4` (mismo nombre). Igual para `cocina.mp4`, `terraza.mp4`, `plato.mp4`. |
| **Fotos** | Reemplaza los archivos de `public/assets/img/` manteniendo el nombre. |
| **Platos y precios** | `public/index.html`, sección `<!-- ============ CARTA -->`. |
| **Textos en español** | Directamente en `public/index.html`. |
| **Traducción al inglés** | `public/js/i18n.js` (busca la clave correspondiente). |
| **Teléfono / WhatsApp** | `index.html` (varias apariciones), `js/main.js` y `server.js` (constante `WA` / `WHATSAPP`). Número actual: `+34 625 84 89 36`. |
| **Colores de marca** | `public/css/styles.css`, bloque `:root` (variables `--gold`, `--noir`, …). |
| **Horario / dirección** | `index.html` (secciones *Reservar* y *Ubicación*) y el bloque de datos estructurados (`application/ld+json`). |

> Tras editar `styles.css` o `*.js`, sube el número de versión en las URLs
> (`styles.css?v=1` → `?v=2`) para forzar la actualización en los navegadores.

---

## 📩 Reservas

El formulario envía los datos a `POST /api/reserva`. El servidor:
1. Guarda cada solicitud en `data/reservas.log` (una línea JSON por reserva).
2. Devuelve un enlace de **WhatsApp** prerrellenado para cerrar la reserva al instante.

Si el sitio se abre como ficheros estáticos (sin servidor), el formulario
funciona igualmente y redirige directamente a WhatsApp.

---

## 🌐 Despliegue

Al ser Node.js, funciona en cualquier hosting con Node (Render, Railway, Fly.io,
un VPS, etc.):

```bash
npm install --production
npm start            # respeta la variable de entorno PORT
```

También puede servirse como **sitio estático** subiendo solo la carpeta `public/`
a Netlify, Vercel, Hostinger, etc. (en ese caso, el formulario usa el modo WhatsApp).

Antes de publicar, cambia el dominio de ejemplo `zenoriomarbella.es` por el real en:
`index.html` (canonical y Open Graph), `sitemap.xml` y `robots.txt`.

---

## ℹ️ Notas

- **Fotografía y vídeo** actuales son material de stock libre de derechos
  (Mixkit / Unsplash), elegido para encajar con el concepto. Recomendable
  sustituirlos por material propio del restaurante para máxima autenticidad.
- La **carta** parte de los platos y precios publicados del restaurante
  (Chistorra, Gambas al pil pil, Ostras, Ensaladilla, Albóndigas, Alcachofas…)
  y se ha completado con propuestas coherentes con su cocina. Revisa y ajusta
  precios/platos antes de publicar.
- Optimizado para móvil, tablet y escritorio, con soporte de
  `prefers-reduced-motion` y buenas prácticas de accesibilidad y SEO
  (Open Graph, datos estructurados Schema.org `Restaurant`, sitemap).

© Zeñorio Marbella
