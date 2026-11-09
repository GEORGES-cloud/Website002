# -*- coding: utf-8 -*-
"""Arma la fuente y saca muestras para mirarla."""
import io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

import motor
from letras import LETRAS, ACENTOS, ACENTUADAS, SIN_PUNTO, SIGNOS

OUT = os.environ["OUT"]
os.makedirs(OUT, exist_ok=True)
NOMBRE = "Zenorio Mano"

NOMBRES = {
    " ": "space", ".": "period", ",": "comma", ";": "semicolon", ":": "colon",
    "-": "hyphen", "'": "quotesingle", "’": "quoteright", "!": "exclam",
    "¡": "exclamdown", "?": "question", "¿": "questiondown",
    "&": "ampersand", "·": "periodcentered", "€": "Euro",
    "á": "aacute", "é": "eacute", "í": "iacute", "ó": "oacute",
    "ú": "uacute", "ü": "udieresis", "ñ": "ntilde",
    "Á": "Aacute", "É": "Eacute", "Í": "Iacute", "Ó": "Oacute",
    "Ú": "Uacute", "Ñ": "Ntilde",
}


def nombre(ch):
    return NOMBRES.get(ch, ch)


def con_acento(ch):
    """Monta una vocal acentuada: la letra de siempre mas el acento, centrado
       sobre ella. Asi el acento es identico en todas, que es justo lo que
       hace una mano de verdad."""
    base, tipo = ACENTUADAS[ch]
    ancho, trazos = LETRAS[base]
    trazos = [list(t) for t in trazos]
    if ch in SIN_PUNTO:          # la i pierde su punto si lleva tilde
        del trazos[SIN_PUNTO[ch]]
    centro = ancho / 2.0
    alto_extra = 0 if base.islower() else 300   # sobre mayuscula, mas arriba
    for t in ACENTOS[tipo]:
        trazos.append([(x + centro, y + alto_extra) for (x, y) in t])
    return ancho, trazos


def construir():
    todo = {}
    for ch, v in LETRAS.items():
        todo[ch] = v
    for ch, v in SIGNOS.items():
        todo[ch] = v
    for ch in ACENTUADAS:
        todo[ch] = con_acento(ch)

    orden = [".notdef"]
    glifos = {".notdef": TTGlyphPen(None).glyph()}
    metricas = {".notdef": (600, 0)}
    cmap = {}
    for ch, (ancho, trazos) in sorted(todo.items()):
        g = nombre(ch)
        orden.append(g)
        glifos[g] = motor.glifo(trazos, ancho)
        metricas[g] = (int(ancho), 0)
        cmap[ord(ch)] = g

    fb = FontBuilder(motor.UPM, isTTF=True)
    fb.setupGlyphOrder(orden)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glifos)
    fb.setupHorizontalMetrics(metricas)
    fb.setupHorizontalHeader(ascent=int(motor.ASC + 220), descent=int(motor.DESC - 80))
    fb.setupNameTable({
        "familyName": NOMBRE,
        "styleName": "Regular",
        "uniqueFontIdentifier": NOMBRE + " 0.2",
        "fullName": NOMBRE,
        "psName": NOMBRE.replace(" ", ""),
        "version": "Version 0.2",
        "copyright": "Zenorio Restaurante. Letra dibujada para la casa.",
        "licenseDescription": "Propiedad de Zenorio. No contiene tipografia de terceros.",
    })
    fb.setupOS2(sTypoAscender=int(motor.ASC + 220), sTypoDescender=int(motor.DESC - 80),
                usWinAscent=int(motor.ASC + 400), usWinDescent=int(-motor.DESC + 220),
                sxHeight=int(motor.XH), sCapHeight=int(motor.CAP))
    fb.setupPost()
    ttf = os.path.join(OUT, "ZenorioMano.ttf")
    fb.save(ttf)
    f = TTFont(ttf)
    f.flavor = "woff2"
    woff2 = os.path.join(OUT, "ZenorioMano.woff2")
    f.save(woff2)
    return ttf, woff2, len(cmap)


def hoja(ttf, lineas, nombre_png, cuerpo=115):
    from PIL import Image, ImageDraw, ImageFont
    fuente = ImageFont.truetype(ttf, cuerpo)
    alto = 70 + len(lineas) * int(cuerpo * 1.55)
    im = Image.new("RGB", (1680, alto), (0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 40
    for L in lineas:
        d.text((60, y), L, font=fuente, fill=(255, 255, 255))
        y += int(cuerpo * 1.55)
    p = os.path.join(OUT, nombre_png)
    im.save(p)
    return p


if __name__ == "__main__":
    ttf, woff2, n = construir()
    print("glifos: %d   ttf: %d bytes   woff2: %d bytes"
          % (n, os.path.getsize(ttf), os.path.getsize(woff2)))
    print(hoja(ttf, ["abcdefghijklm", "nopqrstuvwxyz",
                     "ABCDEFGHIJKLM", "NOPQRSTUVWXYZ",
                     "áéíóúüñ  ÁÉÍÓÚÑ  .,;:-·'!¡?¿&€"],
                "abecedario.png"))
    print(hoja(ttf, ["Zeñorío", "Federico Cardenete",
                     "Mediterráneo, de la huerta y la lonja"],
               "muestra.png", 130))
