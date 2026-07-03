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
