/* =====================================================================
   Zeñorío · interacciones
   ===================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = "34625848936";

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
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      });
    }
    if (document.readyState === "complete") setTimeout(promote, 300);
    else window.addEventListener("load", () => setTimeout(promote, 300));
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
  toTop && toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

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
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger && burger.setAttribute("aria-expanded", String(open));
  }
  burger && burger.addEventListener("click", () =>
    setMenu(!document.body.classList.contains("menu-open"))
  );
  navMobile && $$("a", navMobile).forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );
  // Los botones ES/EN del menú móvil también cierran el overlay
  navMobile && $$("button[data-lang]", navMobile).forEach((b) =>
    b.addEventListener("click", () => setMenu(false))
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

  /* ---- Scroll spy ---- */
  const navLinks = $$(".nav__links a");
  const ids = navLinks.map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("#"));
  if ("IntersectionObserver" in window && ids.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = "#" + e.target.id;
            navLinks.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = $(id);
      if (el) spy.observe(el);
    });
  }

  /* ---- Fecha mínima = hoy ---- */
  const fecha = $("#fecha");
  if (fecha) {
    const t = new Date();
    const iso = new Date(t.getTime() - t.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    fecha.min = iso;
    if (!fecha.value) fecha.value = iso;
  }

  /* ---- Formulario de reserva ---- */
  const form = $("#reservaForm");
  const msg = $("#formMsg");
  const submitBtn = $("#formSubmit");

  function showMsg(type, html) {
    if (!msg) return;
    msg.className = "form__msg show " + type;
    msg.innerHTML = html;
  }
  function waLink(d) {
    const txt = encodeURIComponent(
      "Hola, me gustaría reservar en Zeñorío.\n" +
        `• Nombre: ${d.nombre}\n` +
        `• Fecha: ${d.fecha} a las ${d.hora}\n` +
        `• Comensales: ${d.personas}\n` +
        `• Teléfono: ${d.telefono}` +
        (d.comentario ? `\n• Nota: ${d.comentario}` : "")
    );
    return `https://wa.me/${WA}?text=${txt}`;
  }

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
    lb.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Cerrar (Esc)">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Foto anterior">&#8249;</button>' +
      '<figure class="lightbox__stage">' +
      '<img class="lightbox__img" alt="" decoding="async" />' +
      '<figcaption class="lightbox__caption"></figcaption>' +
      "</figure>" +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Foto siguiente">&#8250;</button>' +
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
      const im = $("img", fig);
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Ampliar: " + (im ? im.alt : ""));
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

  form && form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const isEN = document.documentElement.lang === "en";
    submitBtn.disabled = true;
    submitBtn.textContent = isEN ? "Sending..." : "Enviando...";

    const okText = isEN
      ? "Thank you! We've received your request and will confirm shortly. You can also finish instantly on "
      : "¡Gracias! Hemos recibido tu solicitud y te confirmaremos en breve. También puedes finalizar al instante por ";

    try {
      const res = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad");
      const json = await res.json();
      showMsg("ok", okText + `<a href="${json.whatsapp}" target="_blank" rel="noopener">WhatsApp ↗</a>`);
      form.reset();
      if (fecha) fecha.value = fecha.min;
    } catch (err) {
      // Sin servidor (modo estático): la solicitud NO queda registrada en
      // ningún sitio, así que el paso por WhatsApp es OBLIGATORIO. El texto
      // debe dejarlo claro (no prometer una confirmación que no existe).
      const waText = isEN
        ? "One last step! Your request isn't confirmed yet — send it to us on WhatsApp with one tap: "
        : "¡Último paso! Tu solicitud aún no está confirmada — envíanosla por WhatsApp con un toque: ";
      showMsg("ok", waText + `<a href="${waLink(data)}" target="_blank" rel="noopener"><strong>${isEN ? "Send via WhatsApp" : "Enviar por WhatsApp"} ↗</strong></a>`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = isEN ? "Request reservation" : "Solicitar reserva";
      msg && msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

})();
