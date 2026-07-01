# Zeñorio · Siguientes pasos

Lo que ya está hecho (esta tanda) y lo que necesito **de tu parte** para rematarlo.

## ✅ Hecho y listo
- Páginas legales (Aviso legal, Privacidad, Cookies) + **banner de cookies RGPD**.
- **Analítica cableada** (Google Analytics 4 + Meta Pixel), que solo carga si el usuario acepta cookies.
- Sección **Eventos / Privados**.
- Aviso de **alérgenos** (Reglamento UE 1169/2011).
- **Rendimiento**: fotos en **WebP** (≈36% más ligeras), servidas automáticamente.
- **PWA**: favicons + manifest ("añadir a inicio" en móvil).
- **SEO**: datos estructurados de Restaurante + **FAQ** (resultados enriquecidos).
- **Dockerfile** para desplegar en cualquier sitio.

## ✍️ Datos que tienes que rellenar
1. **Legales** — en `public/aviso-legal.html` y `public/privacidad.html`, sustituye:
   `[RAZÓN SOCIAL]`, `[NIF/CIF]`, `[EMAIL DE CONTACTO]`. (Revísalas con un asesor.)
2. **Carta** — confirma que todos los platos y precios son los reales (`public/index.html`, sección carta).
3. **Alérgenos** — si quieres mostrarlos por plato, pásame qué lleva cada uno y los añado con iconos.

## 🔌 Cuentas a conectar (me pasas el dato y lo enchufo)
| Qué | Dónde va | Lo que necesito de ti |
|---|---|---|
| **Google Analytics 4** | `public/js/cookies.js` (`GA_ID`) | tu ID `G-XXXXXXXXXX` |
| **Meta Pixel** | `public/js/cookies.js` (`PIXEL_ID`) | tu ID numérico |
| **Reservas reales** (CoverManager / TheFork) | botón "Reservar" del hero/sección | tu cuenta o el código de inserción |
| **Newsletter** (Brevo / Mailchimp) | formulario del footer | cuenta + ID de lista |
| **Feed de Instagram** | nueva sección | usuario de Instagram |

## 🚀 Publicar online (deploy)
1. **Compra un dominio** (p. ej. `zenoriomarbella.com`).
2. **Cambia el dominio de ejemplo** `zenoriomarbella.es` por el real en:
   `public/index.html` (canonical y Open Graph), `public/sitemap.xml`, `public/robots.txt`.
3. Elige hosting:
   - **Node (recomendado, formulario funcionando):** sube el repo a **Render** o **Railway** — detectan el `Dockerfile` o el `npm start` automáticamente. El endpoint de reservas seguirá funcionando.
   - **Estático (más simple):** sube solo la carpeta `public/` a **Netlify/Vercel/Hostinger**. En ese modo el formulario de reservas usa WhatsApp directamente.
4. Activa **HTTPS** (Render/Netlify/Vercel lo dan gratis).

## 📍 Ficha de Google Business (lo más importante para que te encuentren)
Más que la web, lo que te trae clientes locales es tu ficha de Google:
- Reclama/optimiza la ficha en business.google.com.
- Fotos buenas, horario correcto, enlace a esta web, responder reseñas.
- Marca el enlace de "Reservar" hacia la web.

## 🎥 Contenido recomendado (sube mucho el nivel)
- Fotografía y vídeo profesional del local y los platos.
- El **vídeo IA** con movimiento real (tienes `hero-para-animar.jpg` en el Escritorio).
- Historia, equipo y chef reales para la sección "La casa".

---
¿Tienes ya algún ID (Analytics, Pixel) o cuenta de reservas? Pásamelo y lo dejo conectado.
