/* =====================================================================
   Zeñorío · aviso de música en directo.
   Viernes piano y sábados saxo, todas las semanas del año (no hay fechas
   que mantener). El día se calcula en la hora de Madrid, no en la del
   visitante: si no, a quien nos mira desde Moscú el viernes por la noche
   le saldría ya el mensaje del sábado.
   El viernes y el sábado anuncia la noche en curso; el resto de la semana
   invita al fin de semana. Se descarta por día: vuelve en otra visita.
   ===================================================================== */
(function () {
  "use strict";
  var KEY = "zenorio-musica";
  var ESPERA = 6000; // no saltar encima del visitante nada más entrar

  var COPY = {
    es: {
      vie: { e: "Viernes de piano", t: "Esta noche, piano en directo", p: "Cena bajo las palmeras con piano en directo. Reserva tu mesa para esta noche." },
      sab: { e: "Sábados de saxo", t: "Esta noche, saxo en directo", p: "Cena bajo las palmeras con saxo en directo. Reserva tu mesa para esta noche." },
      gen: { e: "Música en directo", t: "Viernes de piano,<br />sábados de saxo", p: "Cada semana, música en directo en el jardín. Elige tu noche y reserva mesa." },
      cta: "Reservar mesa", cerrar: "Cerrar", aria: "Música en directo",
    },
    en: {
      vie: { e: "Piano Fridays", t: "Tonight, live piano", p: "Dinner beneath the palms with live piano. Book your table for tonight." },
      sab: { e: "Saxophone Saturdays", t: "Tonight, live saxophone", p: "Dinner beneath the palms with live saxophone. Book your table for tonight." },
      gen: { e: "Live music", t: "Piano on Fridays,<br />saxophone on Saturdays", p: "Live music in the garden every week. Pick your night and book a table." },
      cta: "Book a table", cerrar: "Close", aria: "Live music",
    },
    fr: {
      vie: { e: "Les vendredis piano", t: "Ce soir, piano en direct", p: "Dîner sous les palmiers au son du piano. Réservez votre table pour ce soir." },
      sab: { e: "Les samedis saxo", t: "Ce soir, saxo en direct", p: "Dîner sous les palmiers au son du saxophone. Réservez votre table pour ce soir." },
      gen: { e: "Musique live", t: "Piano le vendredi,<br />saxophone le samedi", p: "De la musique live au jardin chaque semaine. Choisissez votre soirée et réservez votre table." },
      cta: "Réserver une table", cerrar: "Fermer", aria: "Musique live",
    },
    de: {
      vie: { e: "Klavier-Freitage", t: "Heute Abend: Klavier live", p: "Dinner unter Palmen mit Live-Klavier. Reservieren Sie Ihren Tisch für heute Abend." },
      sab: { e: "Saxofon-Samstage", t: "Heute Abend: Saxofon live", p: "Dinner unter Palmen mit Live-Saxofon. Reservieren Sie Ihren Tisch für heute Abend." },
      gen: { e: "Live-Musik", t: "Freitags Klavier,<br />samstags Saxofon", p: "Jede Woche Live-Musik im Garten. Wählen Sie Ihren Abend und reservieren Sie einen Tisch." },
      cta: "Tisch reservieren", cerrar: "Schließen", aria: "Live-Musik",
    },
    sv: {
      vie: { e: "Pianofredagar", t: "I kväll: piano live", p: "Middag under palmerna med livepiano. Boka ditt bord till i kväll." },
      sab: { e: "Saxofonlördagar", t: "I kväll: saxofon live", p: "Middag under palmerna med livesaxofon. Boka ditt bord till i kväll." },
      gen: { e: "Livemusik", t: "Piano på fredagar,<br />saxofon på lördagar", p: "Livemusik i trädgården varje vecka. Välj din kväll och boka bord." },
      cta: "Boka bord", cerrar: "Stäng", aria: "Livemusik",
    },
    ru: {
      vie: { e: "Пятницы с фортепиано", t: "Сегодня — живое фортепиано", p: "Ужин под пальмами под живое фортепиано. Забронируйте столик на сегодня." },
      sab: { e: "Субботы с саксофоном", t: "Сегодня — живой саксофон", p: "Ужин под пальмами под живой саксофон. Забронируйте столик на сегодня." },
      gen: { e: "Живая музыка", t: "По пятницам — фортепиано,<br />по субботам — саксофон", p: "Живая музыка в саду каждую неделю. Выберите вечер и забронируйте столик." },
      cta: "Забронировать столик", cerrar: "Закрыть", aria: "Живая музыка",
    },
  };

  // --- Fecha y día en la hora del restaurante, no en la del visitante ---
  function enMadrid(opts, fallback) {
    try { return new Intl.DateTimeFormat("en-CA", opts).format(new Date()); }
    catch (e) { return fallback(); }
  }
  function hoy() {
    return enMadrid({ timeZone: "Europe/Madrid" }, function () {
      return new Date().toISOString().slice(0, 10);
    });
  }
  function diaSemana() {
    var d = enMadrid({ timeZone: "Europe/Madrid", weekday: "short" }, function () {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
    });
    return d.slice(0, 3);
  }

  function descartadoHoy() {
    try { return localStorage.getItem(KEY) === hoy(); } catch (e) { return false; }
  }
  function descartar() {
    try { localStorage.setItem(KEY, hoy()); } catch (e) {}
    var el = document.getElementById("gig");
    if (el) el.remove();
  }

  // COPY[x] resolvia tambien por la cadena de prototipos: ?lang=constructor
  // devolvia una funcion y el texto salia como "undefined". Solo claves propias.
  function tiene(k) { return Object.prototype.hasOwnProperty.call(COPY, k); }

  function idioma(forzado) {
    var lang = "es";
    try { lang = localStorage.getItem("zenorio-lang") || "es"; } catch (e) {}
    if (!tiene(lang)) lang = "es";
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q && tiene(q)) lang = q;
    } catch (e) {}
    if (forzado && tiene(forzado)) lang = forzado;
    return COPY[lang] || COPY.en;
  }

  function mostrar(forzado) {
    if (document.getElementById("gig")) return;
    var T = idioma(forzado);
    var dia = diaSemana();
    var M = dia === "Fri" ? T.vie : dia === "Sat" ? T.sab : T.gen;

    var el = document.createElement("aside");
    el.id = "gig";
    el.className = "gig";
    // region, no dialog: no es modal ni gestiona el foco.
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", T.aria);
    el.innerHTML =
      '<button class="gig__x" type="button" aria-label="' + T.cerrar + '">&times;</button>' +
      '<span class="gig__eyebrow">' + M.e + "</span>" +
      '<p class="gig__t">' + M.t + "</p>" +
      '<p class="gig__p">' + M.p + "</p>" +
      '<a class="gig__cta" href="/reserva.html">' + T.cta + "</a>";
    document.body.appendChild(el);
    el.querySelector(".gig__x").addEventListener("click", descartar);
  }

  // El banner de cookies manda: hasta que no se resuelve, no asomamos.
  function cuandoNoEstorbeCookies(fn) {
    if (!document.getElementById("ck-banner")) return fn();
    var mo = new MutationObserver(function () {
      if (!document.getElementById("ck-banner")) { mo.disconnect(); fn(); }
    });
    mo.observe(document.body, { childList: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // En la página de reserva sobra: ya están reservando.
    if (/\/reserva\.html$/.test(location.pathname)) return;
    if (descartadoHoy()) return;
    cuandoNoEstorbeCookies(function () { setTimeout(mostrar, ESPERA); });
  });

  // Cambio de idioma con el aviso a la vista: retraducirlo en caliente.
  document.addEventListener("zenorio:lang", function (e) {
    var el = document.getElementById("gig");
    if (el) { el.remove(); mostrar(e && e.detail); }
  });
})();
