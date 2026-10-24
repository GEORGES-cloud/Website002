"""Descarga las fuentes de marca de Google Fonts y las deja en local.

Los PDF se imprimen con Chrome en modo headless. Si el CSS apunta a
fonts.googleapis.com, la impresion depende de que haya red en ese momento y
de que las fuentes lleguen antes que el print: un dia sale en Bodoni y otro
en Times. Con los .woff2 en disco el resultado es siempre el mismo.
"""
import os
import re
import sys
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
DESTINO = os.path.join(AQUI, "fuentes")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
# Las dos de la casa. Se piden con cursiva explicita: las cartas van enteras
# en cursiva y sin el eje ital la familia variable se inclina por software, que
# no es lo mismo ni de lejos.
FAMILIAS = [
    "Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;"
    "1,6..96,400;1,6..96,500",
    "Hanken+Grotesk:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500",
    # Para las cartas: Cinzel son capitales romanas inscritas (las de las
    # cartas de toda la vida), Cormorant Garamond tiene una de las mejores
    # cursivas de Google Fonts, y Pinyon Script es la inglesa de los rotulos.
    "Cinzel:wght@400;500;600",
    "Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;"
    "1,300;1,400;1,500;1,600",
    "Pinyon+Script",
    # Italiana: una romana de asta finisima y mucho caracter. Sustituye a la
    # inglesa de plumilla en los titulos, que era elegante pero remitia a
    # invitacion de boda y no a carta de restaurante.
    "Italiana",
]


def url_css(familias):
    return ("https://fonts.googleapis.com/css2?"
            + "&".join("family=" + f for f in familias)
            + "&display=block")


def pedir(url, ua=UA):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    # Cualquier familia que se pase por linea de comandos se suma a las de la
    # casa, con el formato de Google Fonts: "EB+Garamond:ital,wght@0,400;1,400".
    familias = FAMILIAS + sys.argv[1:]
    os.makedirs(DESTINO, exist_ok=True)
    css = pedir(url_css(familias)).decode("utf-8")

    urls = []
    for u in re.findall(r"https://[^)]+\.woff2", css):
        if u not in urls:
            urls.append(u)

    for i, u in enumerate(urls, 1):
        nombre = "zn-%02d.woff2" % i
        with open(os.path.join(DESTINO, nombre), "wb") as f:
            f.write(pedir(u))
        css = css.replace(u, "fuentes/" + nombre)
        print(nombre, "<-", u.rsplit("/", 1)[-1])

    with open(os.path.join(AQUI, "fuentes.css"), "w", encoding="utf-8") as f:
        f.write(css)
    print("\nfuentes.css escrito ·", len(urls), "archivos")


if __name__ == "__main__":
    main()
