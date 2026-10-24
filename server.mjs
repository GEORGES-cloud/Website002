/**
 * Zeñorio · Marbella — servidor de producción
 * --------------------------------------------------
 * Sirve el sitio estático con compresión y cabeceras de caché.
 *
 * Arranque:  npm install  &&  npm start
 * Por defecto escucha en http://localhost:3000
 */

import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, sep } from 'node:path';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || process.argv[2] || 3000;
const PUBLIC_DIR = join(__dirname, 'public');

const app = express();

app.disable('x-powered-by');
// Detrás del proxy de Hostinger: respetar X-Forwarded-* (host/proto/ip reales).
// Un solo salto. Con `true` se confiaba en toda la
// cadena de X-Forwarded-For, que la pone quien quiera: la IP era falsificable.
app.set('trust proxy', 1);

// Cabeceras de seguridad razonables para un sitio estático. Va ANTES del 301 de
// dominio: si no, la redirección del dominio antiguo salía sin una sola cabecera
// de seguridad, porque se resolvía antes de llegar aquí.
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    // HSTS también aquí: la home y las rutas dinámicas las sirve Express,
    // no la capa estática del .htaccess (regla: toda cabecera en AMBAS capas).
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  });
  next();
});

// Dominio canónico: zenorio.es. El dominio antiguo zeñorio.com
// (xn--zeorio-xwa.com) redirige con 301 para no perder visitas ni SEO.
const OLD_HOSTS = new Set([
  'xn--zeorio-xwa.com',
  'www.xn--zeorio-xwa.com',
  'www.zenorio.es',
]);
app.use((req, res, next) => {
  const host = (req.hostname || '').toLowerCase();
  if (OLD_HOSTS.has(host)) {
    return res.redirect(301, `https://zenorio.es${req.originalUrl}`);
  }
  next();
});

app.use(compression());
// Sin parseadores de cuerpo: al retirar /api/reserva no queda ninguna ruta que
// lea req.body, y asi tampoco hay superficie de body-parser que atacar.

// URL canónica única por página: /carta -> /carta.html e /index.html -> /
// (express.static con extensions:['html'] respondía 200 en ambas variantes:
// contenido duplicado rastreable; el 301 consolida la señal).
// Se arrastra la query: el idioma viaja en ?lang=xx y estos 301 la tiraban,
// así que un enlace a /carta?lang=de o /index.html?lang=de aterrizaba en
// español. Con el 301 de dominio no pasaba porque usa req.originalUrl.
const PAGES = new Set(['carta', 'casa', 'experiencia', 'eventos', 'galeria', 'reserva', 'aviso-legal', 'privacidad', 'cookies']);
app.use((req, res, next) => {
  const i = req.originalUrl.indexOf('?');
  const query = i === -1 ? '' : req.originalUrl.slice(i);
  if (req.path === '/index.html') return res.redirect(301, `/${query}`);
  const m = req.path.match(/^\/([a-z-]+)$/);
  if (m && PAGES.has(m[1])) return res.redirect(301, `/${m[1]}.html${query}`);
  next();
});

// Negociación WebP: si el navegador acepta image/webp y existe el gemelo .webp,
// lo servimos en lugar del .jpg (más ligero) sin cambiar el HTML.
app.use((req, res, next) => {
  if (/\.jpe?g$/i.test(req.path) && (req.headers.accept || '').includes('image/webp')) {
    // normalize + startsWith: que un '/../' literal no pueda salir de public/
    const webp = normalize(join(PUBLIC_DIR, req.path.replace(/\.jpe?g$/i, '.webp')));
    if (!webp.startsWith(PUBLIC_DIR + sep)) return next();
    if (existsSync(webp)) {
      res.set('Vary', 'Accept');
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.type('image/webp');
      return res.sendFile(webp);
    }
  }
  next();
});

// Estáticos con caché agresiva para assets, sin caché para el HTML.
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (/\.(?:css|js)$/.test(filePath)) {
        // CSS/JS van versionados con ?v=N (y la versión se sube en cada
        // cambio), así que pueden cachearse un año sin servir código viejo.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/\.(?:jpg|jpeg|png|webp|avif|svg|mp4|webm|woff2?)$/.test(filePath)) {
        // Binarios estables: caché agresiva de un año.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// No hay endpoint de reservas. Lo hubo (/api/reserva, POST) y se retiro: no lo
// llamaba nadie (cero <form> y cero fetch en public/), pero seguia vivo, publico
// y sin limite de peticiones, escribiendo en data/reservas.log nombre, telefono
// e IP en claro, sin rotacion ni plazo. Las reservas van por CoverManager y por
// WhatsApp. Si algun dia hace falta uno, tendra que llevar limite por IP y estar
// declarado en la politica de privacidad.

// Healthcheck simple para despliegues.
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Fallback: ruta desconocida → 404 REAL con nuestra página propia.
// (Antes devolvía la home con 200: "soft-404" que Google penaliza.)
app.use((_req, res) => {
  res.status(404).sendFile(join(PUBLIC_DIR, '404.html'));
});

// Manejador de errores: sin esto un JSON malformado devuelve la traza con la ruta
// absoluta del servidor y las versiones de las dependencias. Hoy en produccion no
// ocurre porque Hostinger arranca con NODE_ENV=production y el finalhandler de
// Express la oculta, pero eso depende del panel del hosting, no de este codigo.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ ok: false, error: 'Solicitud no válida' });
});

// Escuchamos en 0.0.0.0 (todas las interfaces) para que el proxy del hosting
// (Hostinger, contenedores, PaaS) pueda alcanzar la app. Sin esto, la app
// puede arrancar sin errores pero el proxy no la alcanza → 503.
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`\n  Zeñorio · sirviendo en  http://${HOST}:${PORT}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\n  El puerto ${PORT} ya está en uso.\n` +
        `  Arranca en otro puerto, por ejemplo:\n` +
        `      set PORT=8080 && npm start\n`
    );
    process.exit(1);
  }
  throw err;
});
