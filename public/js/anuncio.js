/* =====================================================================
   Zeñorío · anuncio de la cena de Halloween
   ---------------------------------------------------------------------
   Banner con el cartel, abajo a la izquierda. NO es una ventana modal:
   la página sigue scrolleando por detrás, así que aquí no hay bloqueo
   del scroll, ni inert, ni trampa de foco, ni role="dialog". Un banner
   que no bloquea es un role="region" y punto; marcarlo como diálogo sin
   gestionar el foco es un patrón ARIA incorrecto (el banner de cookies
   de esta misma web lo explica igual).

   Se abre una vez por visita (no en cada página: sessionStorage) y deja
   de salir solo cuando pasa la noche del evento — ver FIN.

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
  // Si ya lo vio en esta visita no se le abre otra vez solo, pero la pestaña
  // de "Eventos" sí se queda puesta: cerrar el banner no puede significar
  // perder el acceso al anuncio hasta la siguiente visita.
  let yaVisto = false;
  try { yaVisto = !!sessionStorage.getItem(VISTO); } catch (e) {}

  const quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dlg = document.createElement("div");
  dlg.className = "anuncio";
  dlg.id = "anuncio";
  dlg.setAttribute("role", "region");
  dlg.setAttribute("aria-labelledby", "anuncio-ttl");
  dlg.innerHTML =
    '<div class="anuncio__caja">' +
    '<button class="anuncio__x" type="button" aria-label="Cerrar el anuncio" data-i18n-aria="hw.close">&times;</button>' +
    // data-src (no src): el cartel pesa ~200 KB y no debe competir con la
    // portada. Se pide cuando ya ha cargado todo lo demás — ver pedirFoto().
    '<img class="anuncio__img" data-src="/assets/img/halloween-2026.jpg" width="1080" height="1350" decoding="async" alt="Cartel de la cena de Halloween en Zeñorío: dos manos brindan con una copa sobre un fondo de cortinas rojas" data-i18n-alt="hw.alt" />' +
    '<div class="anuncio__pie">' +
    // Debajo del cartel NO se ve ni una línea de texto: solo el botón. Todo
    // lo que hay que contar ya está impreso en el cartel, y cada línea que
    // se repetía ahí abajo eran 30-40 px que le quitaba a la foto, que es
    // lo que se mira.
    //
    // Pero el cartel es una FOTO: quien navega con lector de pantalla no se
    // entera de que hay cena de Halloween, ni del día, ni de la hora, y el
    // alt describe la escena (dos manos brindando), no la oferta. Por eso
    // los tres textos se quedan en el HTML con sr-only: no ocupan un píxel
    // y el anuncio sigue diciendo algo para quien no ve la imagen.
    '<p class="anuncio__kicker sr-only" data-i18n="hw.kicker">31 de octubre</p>' +
    '<h2 class="anuncio__ttl sr-only" id="anuncio-ttl" data-i18n="hw.title">Cena de Halloween</h2>' +
    '<p class="anuncio__txt sr-only" data-i18n="hw.txt">DJ session y menú especial en el jardín de Zeñorío.</p>' +
    '<a class="btn btn--ghost anuncio__cta anuncio__cta--menu" href="/eventos.html#halloween" data-i18n="ev.verMenu">Ver el menú</a>' +
    '<a class="btn anuncio__cta" href="/reserva.html" data-i18n="hw.cta">Reserva tu mesa</a>' +
    "</div></div>";
  document.body.appendChild(dlg);

  // La pestaña para volver a abrirlo. Nace aquí, con el banner, y no cuando
  // se cierra: i18n.js guarda el texto original y traduce en DOMContentLoaded,
  // así que lo que nazca después se queda en español en los otros idiomas.
  const abrir_btn = document.createElement("button");
  abrir_btn.className = "anuncio-abrir";
  abrir_btn.type = "button";
  abrir_btn.innerHTML =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>' +
    '<span data-i18n="hw.abrir">Eventos</span>';
  document.body.appendChild(abrir_btn);

  const foto = dlg.querySelector(".anuncio__img");
  const btnX = dlg.querySelector(".anuncio__x");
  const cta = dlg.querySelector(".anuncio__cta");
  const ctaMenu = dlg.querySelector(".anuncio__cta--menu");

  function pedirFoto() {
    const src = foto.getAttribute("data-src");
    if (src) { foto.src = src; foto.removeAttribute("data-src"); }
  }

  function abrir() {
    try { sessionStorage.setItem(VISTO, "1"); } catch (e) {}
    pedirFoto();
    dlg.classList.add("open");
    abrir_btn.classList.remove("show");
  }

  function cerrar() {
    dlg.classList.remove("open");
    abrir_btn.classList.add("show");
  }

  btnX.addEventListener("click", cerrar);
  abrir_btn.addEventListener("click", abrir);
  // El botón de reservar navega: se cierra antes para que, si el visitante
  // vuelve atrás y el navegador restaura la página de caché, no se encuentre
  // el banner otra vez encima.
  cta.addEventListener("click", cerrar);
  ctaMenu.addEventListener("click", cerrar);

  // Escape cierra, que es lo que espera cualquiera con un aviso en pantalla.
  // No hay trampa de foco: el banner no bloquea nada y el tabulador tiene que
  // poder entrar y salir de él con normalidad.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dlg.classList.contains("open")) cerrar();
  });

  /* ---- Cuándo aparece ----
     Nunca a la vez que el banner de cookies: son dos avisos fijos abajo
     compitiendo por el mismo sitio. Si el de cookies está puesto, se espera a
     que el visitante decida y entonces sale este. */
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
  if (yaVisto) {
    // Ya lo vio: solo la pestaña, y sin esperas.
    if (document.readyState === "complete") abrir_btn.classList.add("show");
    else window.addEventListener("load", () => abrir_btn.classList.add("show"));
  } else if (document.readyState === "complete") {
    cuandoToque();
  } else {
    window.addEventListener("load", cuandoToque);
  }
})();
