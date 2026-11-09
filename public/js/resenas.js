/* =====================================================================
   Zeñorío · Reseñas de Google
   ---------------------------------------------------------------------
   Hace dos cosas, y la segunda es opcional.

   1) LAS FECHAS. En el HTML cada reseña lleva su fecha en ISO
      (data-fecha="2026-09-09") y el <time> va vacío. Aquí se escribe el
      «Hace 2 meses» en el idioma que esté puesto, y se vuelve a escribir
      cada vez que se cambia de idioma. Se hace así y no con el texto
      metido en el HTML porque un «Hace 3 semanas» escrito a mano es
      verdad el día que se escribe y mentira a los dos meses. Lo calcula
      Intl.RelativeTimeFormat, que ya trae los seis idiomas; no hay que
      traducir nada.

   2) LA FICHA EN VIVO. Si abajo se pone una clave de la Places API, el
      bloque se rellena con lo que diga Google en ese momento: la nota,
      el número de reseñas y las reseñas en sí. Sin clave no pasa nada:
      se quedan las doce que hay en el HTML, que son reales y se leyeron
      de la ficha el 9-11-2026.

   CÓMO SE ENCIENDE LO SEGUNDO
   ---------------------------------------------------------------------
   a) En Google Cloud, crear un proyecto y activar «Places API (New)».
   b) Crear una clave y RESTRINGIRLA, que esto es importante: la clave
      viaja en el JavaScript y la ve cualquiera que mire el código. La
      restricción es lo único que impide que se la lleven y la gasten.
         · Restricción de aplicación: sitios web (HTTP referrer)
             https://zenorio.es/*
             https://www.zenorio.es/*
         · Restricción de API: solo Places API (New)
      Con eso, una clave copiada no sirve desde ningún otro dominio.
   c) Poner la clave en CLAVE, aquí abajo, y subir el archivo.

   Lo que devuelve la API son CINCO reseñas como mucho, y las elige
   Google, no nosotros. O sea que al encender esto el carrusel pasa de
   doce tarjetas a cinco, y puede aparecer alguna que no sea de cinco
   estrellas. Es lo correcto —son las reseñas de verdad, tal como las
   publica Google— pero conviene saberlo antes de encenderlo.

   La respuesta se guarda un día en localStorage. No es por velocidad:
   es que cada visita sin caché es una llamada que se factura.
   ===================================================================== */
(function () {
  "use strict";

  var CLAVE = ""; // <- aquí la clave de la Places API (ver arriba). Vacío = apagado.
  var PLACE_ID = "ChIJOa_ge-Ypcw0RPsa4BMqzNkw"; // Zeñorío Restaurante Marbella
  var HORAS_CACHE = 24;

  var lista = document.querySelector("[data-gr-lista]");
  if (!lista) return;

  var elNota = document.querySelector("[data-gr-nota]");
  var elTotal = document.querySelector("[data-gr-total]");

  /* ---------- las fechas ---------- */

  // Devuelve [cantidad, unidad] negativos, como los quiere RelativeTimeFormat.
  function distancia(iso) {
    var d = new Date(iso + "T12:00:00Z");
    if (isNaN(d)) return null;
    var dias = Math.round((Date.now() - d.getTime()) / 86400000);
    if (dias < 7) return [-Math.max(dias, 0), "day"];
    if (dias < 31) return [-Math.round(dias / 7), "week"];
    if (dias < 365) return [-Math.max(Math.round(dias / 30.44), 1), "month"];
    return [-Math.max(Math.round(dias / 365.25), 1), "year"];
  }

  function enLetra(iso, lang) {
    var p = distancia(iso);
    if (!p || typeof Intl === "undefined" || !Intl.RelativeTimeFormat) return "";
    var t;
    try {
      t = new Intl.RelativeTimeFormat(lang, { numeric: "always" }).format(p[0], p[1]);
    } catch (e) {
      return "";
    }
    // "always" y no "auto": con auto, Intl dice «el mes pasado» y «el año
    // pasado», y Google escribe «Hace un mes» y «Hace un año». Puestos a
    // imitar su modulo, que lo diga como lo dice el.
    // Y la mayúscula inicial, que Intl lo da todo en minúscula.
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function idioma() {
    return document.documentElement.getAttribute("lang") || "es";
  }

  function fechas() {
    var lang = idioma();
    lista.querySelectorAll(".g-card").forEach(function (c) {
      var iso = c.getAttribute("data-fecha");
      var t = c.querySelector(".g-card__when");
      if (!iso || !t) return;
      t.setAttribute("datetime", iso);
      t.textContent = enLetra(iso, lang);
    });
  }

  function nota(valor) {
    if (!elNota || typeof valor !== "number") return;
    try {
      elNota.textContent = new Intl.NumberFormat(idioma(), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(valor);
    } catch (e) {
      elNota.textContent = String(valor);
    }
  }

  /* ---------- las tarjetas ---------- */

  var COLORES = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];
  var LOGO =
    '<svg class="g-card__g" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true" focusable="false">' +
    '<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>' +
    '<path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>' +
    '<path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>' +
    '<path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>' +
    "</svg>";

  function escapar(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function inicial(nombre) {
    var m = String(nombre || "").match(/\p{L}/u) || String(nombre || "").match(/[a-zA-Z]/);
    return m ? m[0].toUpperCase() : "?";
  }

  function tarjeta(r, i) {
    var est = Math.round(r.rating || 5);
    return (
      '<figure class="g-card" role="listitem" data-fecha="' + escapar(r.iso) + '">' +
      '<header class="g-card__head">' +
      '<span class="g-card__av" style="--av:' + COLORES[i % 4] + '" aria-hidden="true">' +
      escapar(inicial(r.nombre)) + "</span>" +
      '<span class="g-card__who">' +
      '<span class="g-card__name">' + escapar(r.nombre) + "</span>" +
      '<time class="g-card__when" datetime="' + escapar(r.iso) + '"></time>' +
      "</span>" + LOGO + "</header>" +
      '<div class="g-card__stars" role="img" aria-label="' + est + '/5">' +
      new Array(est + 1).join("★") + "</div>" +
      "<p>" + escapar(r.texto) + "</p>" +
      "</figure>"
    );
  }

  function pintar(datos) {
    if (!datos || !datos.resenas || !datos.resenas.length) return;
    lista.innerHTML = datos.resenas.map(tarjeta).join("");
    if (elTotal && datos.total) elTotal.textContent = datos.total;
    nota(datos.nota);
    fechas();
  }

  /* ---------- la llamada ---------- */

  var LLAVE_CACHE = "zenorio-google-resenas";

  function deCache() {
    try {
      var c = JSON.parse(localStorage.getItem(LLAVE_CACHE) || "null");
      if (c && Date.now() - c.t < HORAS_CACHE * 3600000) return c.d;
    } catch (e) {}
    return null;
  }

  function aCache(d) {
    try {
      localStorage.setItem(LLAVE_CACHE, JSON.stringify({ t: Date.now(), d: d }));
    } catch (e) {}
  }

  function normalizar(j) {
    var rs = (j.reviews || []).map(function (r) {
      var a = r.authorAttribution || {};
      var t = (r.text && r.text.text) || (r.originalText && r.originalText.text) || "";
      return {
        nombre: a.displayName || "",
        iso: (r.publishTime || "").slice(0, 10),
        rating: r.rating,
        texto: t
      };
    }).filter(function (r) { return r.nombre && r.texto; });
    return { nota: j.rating, total: j.userRatingCount, resenas: rs };
  }

  function traer() {
    if (!CLAVE) return;
    var cacheado = deCache();
    if (cacheado) { pintar(cacheado); return; }
    var url =
      "https://places.googleapis.com/v1/places/" + PLACE_ID +
      "?languageCode=" + encodeURIComponent(idioma()) +
      "&fields=rating,userRatingCount,reviews" +
      "&key=" + encodeURIComponent(CLAVE);
    fetch(url)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        var d = normalizar(j);
        if (!d.resenas.length) return;
        aCache(d);
        pintar(d);
      })
      // Si falla, no se toca nada: se quedan las tarjetas del HTML. Un bloque
      // de reseñas vacío por un 403 sería peor que uno un poco viejo.
      .catch(function () {});
  }

  function arrancar() {
    fechas();
    traer();
    document.addEventListener("zenorio:lang", function () {
      fechas();
      nota(parseFloat(String(elNota && elNota.textContent).replace(",", ".")));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }
})();
