/* =====================================================================
   Zeñorio · consentimiento de cookies (RGPD) + carga condicional de
   analítica. La analítica SOLO se carga si el usuario acepta Y si has
   puesto tus IDs reales abajo (mientras tengan "XXX" no carga nada).
   ===================================================================== */
(function () {
  "use strict";
  var KEY = "zenorio-cookies";

  // 👉 PON AQUÍ TUS IDs (déjalos como están para no cargar nada todavía)
  var GA_ID = "G-XXXXXXXXXX";        // Google Analytics 4
  var PIXEL_ID = "XXXXXXXXXXXXXXX";  // Meta (Facebook) Pixel

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function configured(id) { return id && id.indexOf("XXX") === -1; }

  function loadGA() {
    if (!configured(GA_ID)) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  function loadPixel() {
    if (!configured(PIXEL_ID)) return;
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", PIXEL_ID); fbq("track", "PageView");
  }

  function enableAll() { loadGA(); loadPixel(); }
  function hide() { var b = document.getElementById("ck-banner"); if (b) b.remove(); }
  function accept() { set("all"); hide(); enableAll(); }
  function reject() { set("essential"); hide(); }

  function showBanner() {
    if (document.getElementById("ck-banner")) return;
    var el = document.createElement("div");
    el.id = "ck-banner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Aviso de cookies");
    el.innerHTML =
      '<div class="cookie-banner__in">' +
      '<p class="cookie-banner__txt">Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso del sitio. ' +
      'Puedes aceptarlas o rechazar las no esenciales. <a href="/cookies.html">Más información</a>.</p>' +
      '<div class="cookie-banner__btns"><button class="ck-rej" type="button">Rechazar</button>' +
      '<button class="ck-acc" type="button">Aceptar</button></div></div>';
    document.body.appendChild(el);
    el.querySelector(".ck-acc").addEventListener("click", accept);
    el.querySelector(".ck-rej").addEventListener("click", reject);
  }

  window.ZenorioCookies = {
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} showBanner(); },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var c = get();
    if (c === "all") enableAll();
    else if (c === "essential") { /* solo esenciales: nada */ }
    else showBanner();
  });
})();
