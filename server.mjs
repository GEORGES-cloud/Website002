/**
 * Zeñorio · Marbella — servidor de producción
 * --------------------------------------------------
 * Sirve el sitio estático con compresión y cabeceras de caché,
 * y expone un pequeño endpoint de reservas (/api/reserva).
 *
 * Arranque:  npm install  &&  npm start
 * Por defecto escucha en http://localhost:3000
 */

import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { appendFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || process.argv[2] || 3000;
const PUBLIC_DIR = join(__dirname, 'public');

const app = express();

app.disable('x-powered-by');
// Detrás del proxy de Hostinger: respetar X-Forwarded-* (host/proto/ip reales).
app.set('trust proxy', true);

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
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// Cabeceras de seguridad razonables para un sitio estático.
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  });
  next();
});

// Negociación WebP: si el navegador acepta image/webp y existe el gemelo .webp,
// lo servimos en lugar del .jpg (más ligero) sin cambiar el HTML.
app.use((req, res, next) => {
  if (/\.jpe?g$/i.test(req.path) && (req.headers.accept || '').includes('image/webp')) {
    const webp = join(PUBLIC_DIR, req.path.replace(/\.jpe?g$/i, '.webp'));
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
        // Sin build con hash de versión: revalidamos siempre (ETag → 304) para
        // publicar los cambios al instante sin servir CSS/JS obsoleto.
        res.setHeader('Cache-Control', 'no-cache');
      } else if (/\.(?:jpg|jpeg|png|webp|avif|svg|mp4|webm|woff2?)$/.test(filePath)) {
        // Binarios estables: caché agresiva de un año.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

/**
 * Endpoint de reservas.
 * Guarda la solicitud en data/reservas.log y responde con un mensaje
 * y un enlace de WhatsApp prerrellenado al número del restaurante.
 */
const WHATSAPP = '34625848936';

app.post('/api/reserva', async (req, res) => {
  const { nombre, telefono, fecha, hora, personas, comentario } = req.body || {};

  if (!nombre || !telefono || !fecha || !hora || !personas) {
    return res.status(400).json({
      ok: false,
      error: 'Faltan datos obligatorios (nombre, teléfono, fecha, hora y comensales).',
    });
  }

  const registro = {
    fechaSolicitud: new Date().toISOString(),
    nombre: String(nombre).slice(0, 120),
    telefono: String(telefono).slice(0, 40),
    fecha: String(fecha).slice(0, 20),
    hora: String(hora).slice(0, 10),
    personas: String(personas).slice(0, 6),
    comentario: String(comentario || '').slice(0, 500),
    ip: req.ip,
  };

  try {
    await mkdir(join(__dirname, 'data'), { recursive: true });
    await appendFile(
      join(__dirname, 'data', 'reservas.log'),
      JSON.stringify(registro) + '\n',
      'utf8'
    );
  } catch (err) {
    console.error('No se pudo guardar la reserva:', err);
  }

  const texto = encodeURIComponent(
    `Hola, me gustaría reservar en Zeñorio.\n` +
      `• Nombre: ${registro.nombre}\n` +
      `• Fecha: ${registro.fecha} a las ${registro.hora}\n` +
      `• Comensales: ${registro.personas}\n` +
      `• Teléfono: ${registro.telefono}` +
      (registro.comentario ? `\n• Nota: ${registro.comentario}` : '')
  );

  res.json({
    ok: true,
    mensaje:
      'Hemos recibido tu solicitud. Te confirmaremos la disponibilidad en breve. ' +
      'También puedes finalizar al instante por WhatsApp.',
    whatsapp: `https://wa.me/${WHATSAPP}?text=${texto}`,
  });
});

// Healthcheck simple para despliegues.
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Fallback: ruta desconocida → 404 REAL con nuestra página propia.
// (Antes devolvía la home con 200: "soft-404" que Google penaliza.)
app.use((_req, res) => {
  res.status(404).sendFile(join(PUBLIC_DIR, '404.html'));
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
