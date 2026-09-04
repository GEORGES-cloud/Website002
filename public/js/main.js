/* =====================================================================
   Zeñorío · interacciones
   ===================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- Loader ---- */
  const loader = $("#loader");
  function hideLoader() { loader && loader.classList.add("done"); }
  window.addEventListener("load", () => setTimeout(hideLoader, 350));
  setTimeout(hideLoader, 2200); // red de seguridad

  /* ---- Año ---- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Hero: cargar las fotos 2-5 del pase después del load ----
     Ahorra ~542 KB en el arranque (la 2ª foto no se ve hasta el s. 6).
     Con prefers-reduced-motion solo se muestra la 1ª: no se cargan. */
  (function () {
    const pending = $$(".hero__slide[data-src]");
    if (!pending.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function promote() {
      pending.forEach((img) => {
        const src = img.getAttribute("data-src");
        if (src) { img.src = src; img.removeAttribute("data-src"); }
      });
    }
    if (document.readyState === "complete") setTimeout(promote, 300);
    else {
      window.addEventListener("load", () => setTimeout(promote, 300));
      // Red de seguridad: en conexiones lentas el load puede llegar después
      // de que el pase intente fundir al 2º plano (s. 6) — pedimos las fotos
      // igualmente a los 4,5 s para que el hero nunca se quede a oscuras.
      setTimeout(promote, 4500);
    }
  })();

  /* ---- Vídeo de "la casa": no pedirlo hasta que se acerque ----
     Mismo criterio que el hero: el MP4 (1,8 MB) se queda en data-src y solo
     se pide cuando la sección entra en pantalla; hasta entonces se ve el
     póster. Fuera de pantalla se pausa. Con prefers-reduced-motion no se
     reproduce solo: aparecen los controles para lanzarlo a voluntad. */
  (function () {
    const vid = $("#casa-teaser video[data-src]");
    if (!vid) return;
    function cargar() {
      const src = vid.getAttribute("data-src");
      if (src) { vid.src = src; vid.removeAttribute("data-src"); }
    }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      vid.removeAttribute("autoplay");
      vid.controls = true;
      cargar();
      return;
    }
    if (!("IntersectionObserver" in window)) { cargar(); return; }
    new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { cargar(); vid.play().catch(() => {}); }
        else if (!vid.paused) vid.pause();
      });
    }, { rootMargin: "200px 0px" }).observe(vid);
  })();

  /* ---- Header + progreso + back-to-top ---- */
  const header = $("#header");
  const progress = $("#progress");
  const toTop = $("#toTop");
  function onScroll() {
    const sc = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", sc > 40);
    if (progress) progress.style.transform = `scaleX(${h > 0 ? sc / h : 0})`;
    if (toTop) toTop.classList.toggle("show", sc > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  // behavior:"smooth" puesto a mano sobrevive al scroll-behavior:auto que aplica
  // la media query de movimiento reducido, así que hay que mirarla aquí también.
  toTop && toTop.addEventListener("click", () => {
    const quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: quieto ? "auto" : "smooth" });
  });

  /* ---- Reveal al hacer scroll ---- */
  const reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    // Red de seguridad: si por cualquier motivo el observer no dispara
    // (pestaña sin pintar, navegador limitado…), nada queda invisible.
    setTimeout(() => reveals.forEach((el) => el.classList.add("in")), 2600);
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Menú móvil ---- */
  const burger = $("#burger");
  const navMobile = $("#navMobile");
  // El resto de la página se marca inert mientras el menú está abierto: sin eso
  // el tabulador salía al contenido de detrás, que está tapado por un velo casi
  // opaco, y un lector de pantalla podía recorrerlo entero.
  // La cabecera NO entra aqui: el propio burger es la X de cerrar y vive dentro,
  // asi que inertizarla dejaba el menu sin salida por teclado y ademas el
  // navegador quitaba el foco del boton recien pulsado.
  const tapables = [$("main"), $(".footer"), $(".floaters")].filter(Boolean);
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger && burger.setAttribute("aria-expanded", String(open));
    tapables.forEach((el) => { el.inert = open; });
    if (open && navMobile) {
      // El panel abre con una transicion de visibility de 0,5 s, y focus() sobre
      // algo aun invisible no hace nada y se pierde en silencio: el foco se
      // quedaba en el body y quien navega con teclado se encontraba el menu
      // abierto sin estar dentro de el. Se reintenta hasta que el panel es
      // visible de verdad, con tope por si la transicion no llega a dispararse.
      const limite = Date.now() + 800;
      (function enfocar() {
        if (!document.body.classList.contains("menu-open")) return;
        const first = $("a", navMobile);
        if (first && getComputedStyle(navMobile).visibility === "visible") {
          first.focus();
          if (document.activeElement === first) return;
        }
        if (Date.now() < limite) requestAnimationFrame(enfocar);
      })();
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false);
      burger && burger.focus();
    }
  });
  burger && burger.addEventListener("click", () =>
    setMenu(!document.body.classList.contains("menu-open"))
  );
  navMobile && $$("a", navMobile).forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  /* ---- Marcar la página actual en la navegación (multipágina) ---- */
  (function () {
    const here = location.pathname.replace(/\/index\.html$/, "/") || "/";
    $$(".nav__links a, .nav-mobile a").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (href.replace(/\/index\.html$/, "/") === here) a.classList.add("active");
    });
  })();

  /* ---- Lightbox de la galería ----
     Clic en una foto: se abre en grande sobre fondo oscuro. Se pasa de una
     a otra con las flechas (pantalla o teclado) o deslizando el dedo,
     como un carrete. Esc, la X o el fondo cierran. */
  (function () {
    const figures = $$(".gallery figure");
    if (!figures.length) return;

    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Visor de fotos");
    lb.setAttribute("data-i18n-aria", "a11y.lbViewer");
    lb.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Cerrar (Esc)" data-i18n-aria="a11y.lbClose">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Foto anterior" data-i18n-aria="a11y.lbPrev">&#8249;</button>' +
      '<figure class="lightbox__stage">' +
      '<img class="lightbox__img" alt="" decoding="async" />' +
      '<figcaption class="lightbox__caption" aria-live="polite"></figcaption>' +
      "</figure>" +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Foto siguiente" data-i18n-aria="a11y.lbNext">&#8250;</button>' +
      '<span class="lightbox__count" aria-hidden="true"></span>';
    document.body.appendChild(lb);

    const img = $(".lightbox__img", lb);
    const caption = $(".lightbox__caption", lb);
    const count = $(".lightbox__count", lb);
    const btnClose = $(".lightbox__close", lb);
    const btnPrev = $(".lightbox__nav--prev", lb);
    const btnNext = $(".lightbox__nav--next", lb);

    let current = 0;
    let lastFocus = null;

    function itemAt(i) {
      const im = $("img", figures[i]);
      const cap = $("figcaption", figures[i]);
      return { src: im.currentSrc || im.src, alt: im.alt || "", cap: cap ? cap.textContent : "" };
    }
    function preload(i) {
      new Image().src = itemAt((i + figures.length) % figures.length).src;
    }
    function show(i, dir) {
      current = (i + figures.length) % figures.length;
      const it = itemAt(current);
      img.classList.remove("slide-next", "slide-prev");
      void img.offsetWidth; // reinicia la animación
      img.src = it.src;
      img.alt = it.alt;
      caption.textContent = it.cap;
      count.textContent = current + 1 + " / " + figures.length;
      if (dir) img.classList.add(dir > 0 ? "slide-next" : "slide-prev");
      preload(current + 1);
      preload(current - 1);
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i, 0);
      lb.classList.add("open");
      document.body.classList.add("lightbox-open");
      btnClose.focus();
    }
    function close() {
      lb.classList.remove("open");
      document.body.classList.remove("lightbox-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    figures.forEach((fig, i) => {
      const cap = $("figcaption", fig);
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      if (cap) {
        if (!cap.id) cap.id = "gal-cap-" + (i + 1);
        fig.setAttribute("aria-labelledby", cap.id);
      }
      fig.addEventListener("click", () => open(i));
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => show(current - 1, -1));
    btnNext.addEventListener("click", () => show(current + 1, 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(current + 1, 1);
      else if (e.key === "ArrowLeft") show(current - 1, -1);
      else if (e.key === "Tab") {
        // aria-modal: el foco no debe salir del diálogo
        const foco = [btnClose, btnPrev, btnNext];
        const idx = foco.indexOf(document.activeElement);
        e.preventDefault();
        (e.shiftKey
          ? foco[(idx - 1 + foco.length) % foco.length]
          : foco[(idx + 1) % foco.length]
        ).focus();
      }
    });

    // Deslizar con el dedo (móvil): pasar de foto como en el carrete
    let touchX = null, touchY = null;
    lb.addEventListener("touchstart", (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      touchX = touchY = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  })();


})();
