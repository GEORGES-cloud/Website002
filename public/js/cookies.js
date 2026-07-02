/* =====================================================================
   Zeñorío · consentimiento de cookies (RGPD) + carga condicional de
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
    // Idioma: el mismo que guarda i18n.js (por defecto ES)
    var en = false;
    try { en = localStorage.getItem("zenorio-lang") === "en"; } catch (e) {}
    var T = en
      ? {
          aria: "Cookie notice",
          txt: "We use our own and third-party cookies to improve your experience and analyse site usage. You can accept them or reject the non-essential ones. <a href=\"/cookies.html\">More information</a>.",
          rej: "Reject",
          acc: "Accept",
        }
      : {
          aria: "Aviso de cookies",
          txt: "Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso del sitio. Puedes aceptarlas o rechazar las no esenciales. <a href=\"/cookies.html\">Más información</a>.",
          rej: "Rechazar",
          acc: "Aceptar",
        };
    var el = document.createElement("div");
    el.id = "ck-banner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", T.aria);
    el.innerHTML =
      '<div class="cookie-banner__in">' +
      '<p class="cookie-banner__txt">' + T.txt + '</p>' +
      '<div class="cookie-banner__btns"><button class="ck-rej" type="button">' + T.rej + '</button>' +
      '<button class="ck-acc" type="button">' + T.acc + '</button></div></div>';
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
