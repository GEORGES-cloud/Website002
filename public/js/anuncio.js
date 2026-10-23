/* =====================================================================
   Zeñorío · anuncio de la cena de Halloween
   ---------------------------------------------------------------------
   Cartel a pantalla completa, centrado, con el botón de reserva. Se abre
   una vez por visita (no en cada página: sessionStorage) y deja de salir
   solo cuando pasa la noche del evento — ver FIN.

   El diálogo se construye aquí, en el cuerpo del script y NO dentro de un
   DOMContentLoaded: i18n.js guarda el texto original y traduce en ese
   evento, así que todo lo que nazca después se queda en español en los
   otros cinco idiomas. Naciendo antes, el anuncio se traduce como
   cualquier otro trozo de la página.
   ===================================================================== */
(function () {
  "use strict";

  // Fin del anuncio: la madrugada siguiente a la cena. Sin esto el cartel
  // seguiría saliendo en noviembre y habría que acordarse de quitarlo a mano.
  const FIN = new Date("2026-11-01T06:00:00");
  const VISTO = "zenorio-anuncio-hw26";
  const ESPERA = 900; // ms desde que la página está lista hasta que aparece

  if (Date.now() > FIN.getTime()) return;
  try { if (sessionStorage.getItem(VISTO)) return; } catch (e) {}

  const quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dlg = document.createElement("div");
  dlg.className = "anuncio";
  dlg.id = "anuncio";
  dlg.setAttribute("role", "dialog");
  dlg.setAttribute("aria-modal", "true");
  dlg.setAttribute("aria-labelledby", "anuncio-ttl");
  dlg.innerHTML =
    '<div class="anuncio__caja">' +
    '<button class="anuncio__x" type="button" aria-label="Cerrar el anuncio" data-i18n-aria="hw.close">&times;</button>' +
    // data-src (no src): el cartel pesa ~200 KB y no debe competir con la
    // portada. Se pide cuando ya ha cargado todo lo demás — ver pedirFoto().
    '<img class="anuncio__img" data-src="/assets/img/halloween-2026.jpg" width="1080" height="1350" decoding="async" alt="Cartel de la cena de Halloween en Zeñorío: dos manos brindan con una copa sobre un fondo de cortinas rojas" data-i18n-alt="hw.alt" />' +
    '<div class="anuncio__pie">' +
    '<p class="anuncio__kicker" data-i18n="hw.kicker">31 de octubre · Desde las 19:00</p>' +
    '<h2 class="anuncio__ttl" id="anuncio-ttl" data-i18n="hw.title">Cena de Halloween</h2>' +
    '<p class="anuncio__txt" data-i18n="hw.txt">DJ session y menú especial en el jardín de Zeñorío.</p>' +
    '<a class="btn anuncio__cta" href="/reserva.html" data-i18n="hw.cta">Reserva tu mesa</a>' +
    "</div></div>";
  document.body.appendChild(dlg);

  const caja = dlg.querySelector(".anuncio__caja");
  const foto = dlg.querySelector(".anuncio__img");
  const btnX = dlg.querySelector(".anuncio__x");
  const cta = dlg.querySelector(".anuncio__cta");
  // Mismo criterio que el menú móvil: el resto de la página se marca inert
  // mientras el anuncio está abierto, para que el tabulador y los lectores de
  // pantalla no se vayan al contenido que hay detrás del velo.
  const tapables = () => [document.querySelector("main"), document.querySelector(".footer"), document.querySelector(".floaters"), document.querySelector("#header")].filter(Boolean);

  let focoPrevio = null;

  function pedirFoto() {
    const src = foto.getAttribute("data-src");
    if (src) { foto.src = src; foto.removeAttribute("data-src"); }
  }

  function abrir() {
    try { sessionStorage.setItem(VISTO, "1"); } catch (e) {}
    focoPrevio = document.activeElement;
    pedirFoto();
    dlg.classList.add("open");
    document.body.classList.add("anuncio-open");
    tapables().forEach((el) => { el.inert = true; });
    // El diálogo abre con una transición de visibility: enfocar algo aún
    // invisible no hace nada y el foco se queda en el body (el mismo fallo que
    // tenía el menú móvil). Se reintenta hasta que la caja es visible.
    const limite = Date.now() + 800;
    (function enfocar() {
      if (!dlg.classList.contains("open")) return;
      if (getComputedStyle(dlg).visibility === "visible") {
        btnX.focus();
        if (document.activeElement === btnX) return;
      }
      if (Date.now() < limite) requestAnimationFrame(enfocar);
    })();
  }

  function cerrar() {
    dlg.classList.remove("open");
    document.body.classList.remove("anuncio-open");
    tapables().forEach((el) => { el.inert = false; });
    if (focoPrevio && focoPrevio.focus) focoPrevio.focus();
  }

  btnX.addEventListener("click", cerrar);
  // Clic en el velo (fuera de la caja) = cerrar. Dentro, no.
  dlg.addEventListener("click", (e) => { if (!caja.contains(e.target)) cerrar(); });
  // El botón de reservar navega: cerrar antes para no dejar el body bloqueado
  // si el visitante vuelve atrás y el navegador restaura la página de caché.
  cta.addEventListener("click", cerrar);

  document.addEventListener("keydown", (e) => {
    if (!dlg.classList.contains("open")) return;
    if (e.key === "Escape") { cerrar(); return; }
    if (e.key === "Tab") {
      // aria-modal: el foco no debe salir del diálogo
      const foco = [btnX, cta];
      const i = foco.indexOf(document.activeElement);
      e.preventDefault();
      foco[(i + (e.shiftKey ? -1 : 1) + foco.length) % foco.length].focus();
    }
  });

  /* ---- Cuándo aparece ----
     Nunca encima del banner de cookies: son dos capas fijas compitiendo y, en
     un móvil, el banner tapa el botón de reservar. Si el banner está puesto,
     se espera a que el visitante decida y entonces sale el anuncio. */
  function cuandoToque() {
    const banner = document.getElementById("ck-banner");
    if (!banner) { setTimeout(abrir, quieto ? 0 : ESPERA); return; }
    const obs = new MutationObserver(() => {
      if (!document.getElementById("ck-banner")) {
        obs.disconnect();
        setTimeout(abrir, quieto ? 0 : ESPERA);
      }
    });
    obs.observe(document.body, { childList: true });
  }

  // Tras el load: el cartel no compite con la portada ni con el loader.
  if (document.readyState === "complete") cuandoToque();
  else window.addEventListener("load", cuandoToque);
})();
