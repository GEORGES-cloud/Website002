# -*- coding: utf-8 -*-
"""Genera las cartas en PDF: portada original + hojas de menu nuevas.

   python generar.py                          # las cartas buenas, a menus/
   python generar.py variantes/jazz.css       # una propuesta, a menus/pruebas/

Para cada carta y cada idioma arma un HTML con la hoja de estilo, lo imprime
con Chrome en headless y le pega delante la portada (la pagina 1 del PDF que
mando el restaurante, que se conserva tal cual).

El argumento opcional es una hoja de estilo alternativa: sirve para montar las
propuestas de diseno sin tocar las cartas buenas. Con propuesta solo se saca el
espanol y todo va a menus/pruebas/, que no entra en el repo.
"""
import io
import os
import re
import subprocess
import sys

import fitz

AQUI = os.path.dirname(os.path.abspath(__file__))
# Se lanza con python -I (modo aislado) porque en originales/ hay PDF que
# vinieron de fuera; -I quita de sys.path la carpeta del script, asi que hay
# que reponerla a mano para poder importar los datos.
sys.path.insert(0, AQUI)
from datos import CARTAS, PIE  # noqa: E402

MENUS = os.path.dirname(AQUI)
RAIZ = os.path.dirname(MENUS)
ORIGINALES = os.path.join(AQUI, "originales")
TRABAJO = os.path.join(AQUI, "_trabajo")

FORMATOS = {
    # ancho, alto, escala de la letra. El A4 de siempre y el cartel 4:5 que
    # traia el PDF de Halloween (810 × 1012,5 pt), que se respeta para que
    # la hoja nueva case con su portada.
    "a4":     {"ancho": "210mm", "alto": "297mm", "raiz": "10pt"},
    "cartel": {"ancho": "285.75mm", "alto": "357.1875mm", "raiz": "13.6pt"},
}

CHROME = next((c for c in [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
] if os.path.exists(c)), None)


def z_svg():
    """La Z de la marca, tal cual vive en la web."""
    ruta = os.path.join(RAIZ, "public", "assets", "img", "logo-z.svg")
    svg = io.open(ruta, encoding="utf-8").read()
    # fuera el role/aria: aqui es decoracion, no un logotipo que anunciar
    return re.sub(r'\s(role|aria-label)="[^"]*"', "", svg).strip()


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def titulo_html(t):
    """El ampersand, en cursiva: es el guino tipografico de las cartas buenas."""
    return esc(t).replace("&amp;", '<span class="amp">&amp;</span>')


def hoja(pag, lang, zeta):
    h = ['<section class="hoja">',
         '<div class="marca-agua">%s</div>' % zeta,
         '<header class="cabecera">',
         '<div class="sello">%s</div>' % zeta,
         '<h1 class="titulo">%s</h1>' % titulo_html(pag["titulo"][lang])]
    if pag.get("subtitulo"):
        h.append('<p class="subtitulo">%s</p>' % esc(pag["subtitulo"][lang]))
    h.append('<div class="filete"><span>&#9670;</span></div>')
    h.append("</header>")

    h.append('<div class="cuerpo">')
    for sec in pag["secciones"]:
        h.append('<section class="seccion">')
        ttl = esc(sec["ttl"][lang])
        if sec.get("nota"):
            ttl += '<span class="nota">%s</span>' % esc(sec["nota"][lang])
        h.append('<h2 class="seccion__ttl">%s</h2>' % ttl)
        for nombre, segunda in sec["platos"]:
            h.append('<div class="plato">')
            h.append('<p class="plato__n">%s</p>' % esc(nombre[lang]))
            if segunda:
                clase = "plato__d" if segunda.get("desc") else "plato__s"
                h.append('<p class="%s">%s</p>' % (clase, esc(segunda[lang])))
            h.append("</div>")
        h.append("</section>")
    h.append("</div>")

    h.append('<footer class="cierre">')
    if pag.get("incluye"):
        h.append('<p class="incluye">%s</p>' % esc(pag["incluye"][lang]))
    h.append('<p class="precio">%s<small>%s</small></p>'
             % (esc(pag["precio"]), "por persona" if lang == "es" else "per person"))
    if pag.get("notas"):
        h.append('<div class="notas">')
        for ttl, txt in pag["notas"]:
            h.append('<div class="nota-caja"><h4>%s</h4><p>%s</p></div>'
                     % (esc(ttl[lang]), esc(txt[lang])))
        h.append("</div>")
    h.append("</footer>")

    pie = PIE[lang]
    h.append('<p class="credito">%s</p>'
             % '<i>·</i>'.join('<span>%s</span>' % esc(x) for x in pie))
    h.append("</section>")
    return "\n".join(h)


def documento(carta, lang, css="menus.css"):
    f = FORMATOS[carta["formato"]]
    zeta = z_svg()
    hojas = "\n".join(hoja(p, lang, zeta) for p in carta["paginas"])
    return """<!DOCTYPE html>
<html lang="%s">
<head>
<meta charset="utf-8" />
<title>%s</title>
<link rel="stylesheet" href="%s" />
<style>
  @page { size: %s %s; margin: 0; }
  html { font-size: %s; }
  .hoja { --ancho: %s; --alto: %s; }
</style>
</head>
<body>
%s
</body>
</html>
""" % (lang, esc(carta["nombre"][lang]), css, f["ancho"], f["alto"], f["raiz"],
       f["ancho"], f["alto"], hojas)


def imprimir(html_path, pdf_path):
    subprocess.run([
        CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
        "--no-pdf-header-footer", "--virtual-time-budget=8000",
        "--print-to-pdf=" + pdf_path,
        "file:///" + html_path.replace("\\", "/"),
    ], check=True, capture_output=True, timeout=180)


def montar(origen, generado, salida):
    """Portada original + hojas nuevas."""
    doc = fitz.open()
    with fitz.open(origen) as src:
        doc.insert_pdf(src, from_page=0, to_page=0)
    with fitz.open(generado) as nuevo:
        doc.insert_pdf(nuevo)
    doc.save(salida, deflate=True, garbage=4)
    n = doc.page_count
    doc.close()
    return n


def main():
    if not CHROME:
        sys.exit("No encuentro Chrome ni Edge para imprimir el PDF.")
    css = sys.argv[1] if len(sys.argv) > 1 else "menus.css"
    propuesta = css != "menus.css"
    if not os.path.exists(os.path.join(AQUI, css)):
        sys.exit("No existe la hoja de estilo: " + css)
    marca = os.path.splitext(os.path.basename(css))[0]
    destino = os.path.join(MENUS, "pruebas") if propuesta else MENUS
    os.makedirs(destino, exist_ok=True)
    os.makedirs(TRABAJO, exist_ok=True)

    for carta in CARTAS:
        origen = os.path.join(ORIGINALES, carta["origen"])
        if not os.path.exists(origen):
            sys.exit("Falta el PDF original: " + origen)
        for lang in (("es",) if propuesta else ("es", "en")):
            base = "%s-%s-%s" % (marca, carta["slug"], lang)
            html_path = os.path.join(AQUI, base + ".html")
            io.open(html_path, "w", encoding="utf-8").write(documento(carta, lang, css))
            crudo = os.path.join(TRABAJO, base + ".pdf")
            imprimir(html_path, crudo)
            if propuesta:
                salida = os.path.join(destino, "%s-%s.pdf" % (marca.upper(), carta["slug"]))
            else:
                salida = os.path.join(
                    destino, "ZENORIO-%s-%s.pdf" % (carta["slug"].upper(), lang.upper()))
            n = montar(origen, crudo, salida)
            print("%-46s %d paginas" % (os.path.basename(salida), n))


if __name__ == "__main__":
    main()
