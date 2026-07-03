/* =====================================================================
   Zeñorío · i18n ligero (ES por defecto, EN opcional)
   El español vive en el HTML; aquí solo definimos la traducción EN y
   restauramos el original al volver a ES. Sin dependencias.
   ===================================================================== */
(function () {
  const EN = {
    "a11y.skip": "Skip to content",
    "a11y.skipMenu": "Skip to menu",
    "nav.home": "Home",
    "nav.house": "The house",
    "nav.menu": "Menu",
    "nav.gallery": "Gallery",
    "nav.experience": "Experience",
    "nav.location": "Find us",
    "nav.book": "Book",

    "hero.eyebrow": "Restaurant · Nueva Andalucía, Marbella",
    "hero.title1": "The art of the",
    "hero.title2": "Mediterranean table",
    "hero.sub": "Market-driven Mediterranean cuisine, oak-fired grill and soulful rice dishes, served beneath the palms of a tropical garden in the heart of Marbella.",
    "hero.cta1": "Book a table",
    "hero.cta2": "View the menu",
    "hero.scroll": "Scroll",

    "story.eyebrow": "Our story",
    "story.title": "A son's tribute<br />to his father",
    "story.p1": "Zeñorío was born from the simplest kind of love: a son's wish to honour his father. Behind every rice dish, every flame of the grill and every fish from the market lies the hand of chef Federico Cardenete, who stands at the helm of the kitchen and has made cooking the craft of a lifetime.",
    "story.p2": "Here the Mediterranean is cooked slowly and with respect: local, seasonal produce, inherited technique and a contemporary eye. An elegant dining room that opens onto a tropical garden of palm trees, where every service unfolds unhurried. This is Zeñorío: a home built on affection, craft and the memory of the man who taught us to cook.",
    "story.s1": "Market produce",
    "story.s2": "Dry-aged beef",
    "story.s2u": "days",
    "story.chefLabel": "At the helm of the kitchen",

    "brand.sub": "Restaurant",

    "mq.1": "Mediterranean cuisine",
    "mq.2": "Oak-fired grill",
    "mq.3": "Soulful rice",
    "mq.4": "Tropical garden",
    "mq.5": "Market fish",
    "mq.6": "Marbella · Costa del Sol",

    "carta.cat1": "Boards",
    "carta.cat2": "Starters",
    "carta.cat3": "Salads",
    "carta.cat4": "Classics",
    "carta.cat5": "Rice dishes",
    "carta.cat6": "Specialities",
    "carta.cat7": "Fish",
    "carta.cat8": "Meats",
    "carta.cat9": "Desserts",

    "foot.follow": "Follow us on Instagram ↗",

    "pillars.eyebrow": "The philosophy",
    "pillars.title": "Three ways to understand the table",
    "pillars.c1t": "Oak-fired grill",
    "pillars.c1p": "Fire as an ingredient. Dry-aged meats and market fish kissed by the embers, with just the right point and just the right smoke.",
    "pillars.c2t": "Soulful rice",
    "pillars.c2p": "From dry to creamy. Paellas and rice dishes made to order, with stocks cooked for hours and saffron as our signature.",
    "pillars.c3t": "Tropical garden",
    "pillars.c3p": "Dining under the palms. A green terrace and a lounge where time slows down to the rhythm of Marbella.",

    "feature.eyebrow": "The ritual of salt",
    "feature.title": "Fish, sealed in a crust of salt",
    "feature.p": "The day's catch from the market, encased in a crust of sea salt and baked whole. The salt seals in the juices and keeps the flavour of the sea intact; cracked open at the table and served at once, clean and tender. Pure Mediterranean.",
    "feature.cta": "Discover the menu",

    "menu.eyebrow": "The menu",
    "menu.teaser": "Boards and starters to share, paellas and rice, fish, meats and homemade desserts.",
    "menu.cta": "See the full menu",
    "carta.back": "Back to home",
    "carta.title": "It's about sharing",
    "carta.intro": "Those special moments, those unwritten recipes, and that traditional flavour.",
    "carta.arrocesNote": "Minimum 2 people · price per person",
    "carta.note": "Prices include VAT · S/M: market price · Allergen and intolerance information available — just ask.",
    "menu.title": "Mediterranean,<br />from garden and sea",
    "menu.t1": "To share",
    "menu.t2": "From the sea",
    "menu.t3": "Rice",
    "menu.t4": "From the grill",
    "menu.t5": "Sweets",
    "menu.t6": "Cellar",
    "menu.arrocesNote": "Minimum 2 people · price per person · made to order (25 min)",
    "menu.bodegaNote": "By the glass: Ronda, Rioja, Ribera del Duero, Rías Baixas and champagne. Ask for our sommelier's recommendations.",
    "menu.note": "Menu subject to market availability · 10% VAT included · Vegan, vegetarian and gluten-free options available · Please inform our team of any allergy or intolerance.",
    "menu.allergTitle": "Allergens",
    "menu.allergNote": "Allergen information for all our dishes is available in accordance with Regulation (EU) 1169/2011. Just ask our team — we're happy to help.",
    "ev.e": "Events & Private dining",
    "ev.t": "Celebrate your moment<br />beneath the palms",
    "ev.p": "Birthdays, corporate lunches, celebrations or private dinners. We design bespoke group menus and reserve spaces for your party, with all the charm of the garden.",
    "ev.l1": "Tailored group menus",
    "ev.l2": "Garden, terrace or lounge for exclusive use",
    "ev.l3": "Cocktails and music for your event",
    "ev.cta": "Request information",
    "ev.nav": "Events",

    "d.ostras": "Freshly shucked, cava and lemon mignonette.",
    "d.ensaladilla": "Potato, tuna, prawn and virgin olive oil mayonnaise.",
    "d.pilpil": "Sautéed with garlic, chilli and Arbequina olive oil.",
    "d.chistorra": "Traditional sausage with garlic, salt and paprika, in cider.",
    "d.croquetas": "Creamy, with artisan béchamel and acorn-fed ham.",
    "d.burrata": "Garden tomato, basil and pistachio pesto.",
    "d.remolacha": "Roasted beetroot, goat cheese and caramelised walnuts.",
    "d.alcachofas": "Slow-confit artichokes, crispy ham and aioli.",
    "d.albondigas": "A timeless recipe in marcona almond sauce.",
    "d.tartar": "Almadraba tuna, avocado, sesame and citrus ponzu.",
    "d.jamon": "Hand-carved, crystal bread and tomato.",
    "d.mejillones": "Steamed with lemon, bay leaf and a hint of fennel.",
    "d.gambaroja": "Grilled, sea-salt flakes and olive oil.",
    "d.pulpo": "Smoked potato parmentier and Vera paprika.",
    "d.lubina": "Baked in a sea-salt crust, pure and simple.",
    "d.rodaballo": "Garlic refrito and a touch of sherry vinegar.",
    "d.sashimi": "Thinly sliced, virgin olive oil and lime zest.",
    "d.calamares": "Andalusian-style, floured and fried in olive oil, lemon.",
    "d.valenciana": "Free-range chicken, rabbit, green beans and garrofó.",
    "d.carabineros": "Creamy and intense, with red prawn from the coast.",
    "d.negro": "Squid ink, cuttlefish and saffron aioli.",
    "d.fideua": "Fine noodles, prawns, squid and a soft aioli.",
    "d.verduras": "From the garden, saffron and extra virgin olive oil.",
    "d.chuleton": "≈1 kg · 45-day aged · over holm-oak embers.",
    "d.solomillo": "Grilled foie and a Pedro Ximénez reduction.",
    "d.cordero": "Slow-roasted, panadera potatoes and fresh rosemary.",
    "d.secreto": "Acorn-fed Iberian pork, sea salt and Padrón peppers.",
    "d.pato": "Lacquered, thin crepe, hoisin sauce and spring onion.",
    "d.pollo": "Free-range, marinated in citrus and herbs, charcoal-grilled.",
    "d.cheesecake": "Creamy inside, golden outside.",
    "d.torrija": "Brioche, infused milk and cinnamon ice cream.",
    "d.coulant": "Molten heart and bourbon vanilla ice cream.",
    "d.sorbete": "Citrusy and light, to close the table.",
    "d.frutas": "A market selection with fresh mint.",
    "d.sangria": "Cava, seasonal fruit and our secret touch.",
    "d.gintonic": "Mediterranean botanicals, citrus and rosemary.",
    "d.rebujito": "Manzanilla sherry and soda, very cold, very southern.",
    "d.vermut": "Red, with blood orange and gordal olive.",
    "d.champagne": "A fine bubble to toast beneath the palms.",

    "gallery.eyebrow": "The gallery",
    "gallery.title": "Pleasure begins with the eyes",
    "gallery.c1": "The garden at night",
    "gallery.c2": "The art of rice",
    "gallery.c3": "The terrace",
    "gallery.c4": "Oysters & caviar",
    "gallery.c5": "Bluefin tuna",
    "gallery.c6": "The dining room",
    "gallery.c7": "The cellar",
    "gallery.c8": "Galician-style octopus",
    "gallery.c9": "Broken eggs with red shrimp",
    "gallery.c10": "Tuna tartare",
    "gallery.c11": "Black rice",
    "gallery.c12": "Zeñorío lasagna",
    "gallery.c13": "Seafood paella",
    "gallery.c14": "Peppered beef tenderloin",
    "gallery.c15": "Confit artichokes",

    "exp.eyebrow": "The experience",
    "exp.title": "More than dining — staying",
    "exp.c1e": "The garden",
    "exp.c1t": "A tropical oasis",
    "exp.c1p": "Palm trees, lush greenery and our famous peacock. Dining outdoors at Zeñorío means escaping Marbella without ever leaving it.",
    "exp.c2e": "Al fresco",
    "exp.c2t": "Dinners under the stars",
    "exp.c2p": "Warm Costa del Sol nights call for a terrace, a breeze and a fine table.",
    "exp.c3e": "Lounge & drinks",
    "exp.c3t": "The perfect after-dinner",
    "exp.c3p": "Cocktails, live music at weekends and an atmosphere that invites you to linger.",

    "rev.eyebrow": "What they say",
    "rev.title": "Guests who return",
    "rev.q1": "“An outstanding experience: a warm welcome, attentive service and excellent cuisine. Our new favourite restaurant in Marbella.”",
    "rev.src1": "Google",
    "rev.q2": "“A gorgeous place, with superb food and wonderful garden surroundings. The rice — spectacular.”",
    "rev.src2": "Tripadvisor",
    "rev.q3": "“Exceptional flexibility, impeccable presentation and a unique setting under the palms. We'll be back for sure.”",
    "rev.src3": "TheFork",
    "rev.badge": "Mediterranean · Nueva Andalucía",

    "res.eyebrow": "Reservations",
    "res.title": "Your table<br />is waiting",
    "res.p": "Book in seconds. We confirm availability right away and, if you prefer, close your reservation instantly on WhatsApp.",
    "res.tel": "Phone & WhatsApp",
    "res.addr": "Where we are",
    "res.hours": "Opening hours",
    "res.hoursVal": "Tuesday to Sunday · 18:30 – 23:30<br />Monday closed",

    "form.name": "Full name",
    "form.namePh": "Your name",
    "form.phone": "Phone",
    "form.guests": "Guests",
    "form.date": "Date",
    "form.time": "Time",
    "form.notes": "Comments (optional)",
    "form.notesPh": "Allergies, special occasion, a table in the garden...",
    "form.submit": "Request reservation",

    "loc.eyebrow": "How to get here",
    "loc.title": "In the heart of Nueva Andalucía",
    "loc.mon": "Monday",
    "loc.closed": "Closed",
    "loc.tuesun": "Tuesday – Sunday",
    "loc.directions": "Get directions",
    "loc.call": "Call",

    "foot.tagline": "The art of the Mediterranean table. Grill, rice and garden in Nueva Andalucía.",
    "foot.explore": "Explore",
    "foot.contact": "Contact",
    "foot.hours": "Tue–Sun · 18:30–23:30",
    "foot.news": "News",
    "foot.newsP": "Events, seasonal menus and special nights.",
    "foot.rights": "All rights reserved",
    "foot.legal": "Legal notice",
    "foot.privacy": "Privacy",
    "foot.cookies": "Cookies",

    "brand.sub": "Restaurant",
    "home.casaTeaser": "Zeñorío was born from a son's wish to honour his father. Market-driven Mediterranean cuisine, holm-oak embers and a tropical garden where time slows down.",
    "home.casaCta": "Get to know us",
    "casa.philEyebrow": "The philosophy",
    "casa.philTitle": "Fire, rice and garden",
    "casa.philP": "Three hallmarks: holm-oak embers as an ingredient, rices and paellas made to order with stocks cooked for hours, and a tropical garden where dining outdoors means escaping Marbella without ever leaving it.",
    "casa.cta": "View the menu",
    "exp.merged.e": "The garden · Al fresco",
    "exp.merged.t": "Dinners under the palms",
    "exp.merged.p": "A tropical oasis of palm trees, lush greenery and our famous peacock. Warm Costa del Sol nights call for a terrace and a breeze: dining outdoors at Zeñorío means escaping Marbella without ever leaving it.",
    "rev.hint": "← Swipe to read more →"
  };

  // Captura del español original para poder restaurarlo.
  const original = new Map();
  const originalPh = new Map();

  function cache() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      original.set(el, el.innerHTML);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      originalPh.set(el, el.getAttribute("placeholder") || "");
    });
  }

  function apply(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (lang === "en" && EN[key] != null) el.innerHTML = EN[key];
      else if (original.has(el)) el.innerHTML = original.get(el);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (lang === "en" && EN[key] != null) el.setAttribute("placeholder", EN[key]);
      else if (originalPh.has(el)) el.setAttribute("placeholder", originalPh.get(el));
    });
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    try { localStorage.setItem("zenorio-lang", lang); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    cache();
    let lang = "es";
    try { lang = localStorage.getItem("zenorio-lang") || "es"; } catch (e) {}
    if (lang === "en") apply("en");
    else apply("es");

    document.querySelectorAll(".lang button").forEach((btn) => {
      btn.addEventListener("click", () => apply(btn.dataset.lang));
    });
  });
})();
