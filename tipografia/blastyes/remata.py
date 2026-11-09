# -*- coding: utf-8 -*-
"""Renombra (sin borrar a quien la hizo) y saca el woff2."""
import os
from fontTools.ttLib import TTFont

SRC = os.path.join(os.getcwd(), "Blastyes-ES.ttf")
f = TTFont(SRC)

NUEVOS = {
    1:  "Blastyes ES",
    3:  "1.002; Blastyes ES; acentos castellanos anadidos",
    4:  "Blastyes ES",
    5:  "Version 1.002; acentos anadidos 2026",
    6:  "BlastyesES-Regular",
    10: ("Blastyes, de Rian Rahardi para Creatype Studio Co., con los acentos "
         "castellanos (a e i o u con tilde y la ene) anadidos sobre sus propios "
         "trazos. Licencia adquirida por Zenorio Restaurante. Renombrada para no "
         "pisar a la original."),
    16: "Blastyes ES",
}
for nid, val in NUEVOS.items():
    f["name"].setName(val, nid, 3, 1, 0x409)   # windows unicode
    f["name"].setName(val, nid, 1, 0, 0)       # macintosh

# los campos de autoria se quedan como estan: 0 copyright, 7 marca,
# 8 fabricante, 9 disenador, 11 y 14 urls.

ttf = os.path.join(os.getcwd(), "BlastyesES.ttf")
f.save(ttf)

g = TTFont(ttf); g.flavor = "woff2"
woff2 = os.path.join(os.getcwd(), "BlastyesES.woff2")
g.save(woff2)

print("TTF  : %6d bytes" % os.path.getsize(ttf))
print("WOFF2: %6d bytes  <- lo que viaja al navegador" % os.path.getsize(woff2))

h = TTFont(woff2)
cmap = h.getBestCmap()
print("\nglifos: %d   caracteres: %d" % (h["maxp"].numGlyphs, len(cmap)))
print("\nnombre con el que se instala:")
for r in h["name"].names:
    if r.nameID in (0,1,4,9,8) and r.platformID == 3:
        print("   [%d] %s" % (r.nameID, r.toUnicode()[:90]))
print("\nprueba final, caracter a caracter de 'Zenorio' con acentos:")
for ch in "Zeñorío":
    print("   %s -> %s" % (ch, cmap.get(ord(ch), "FALTA")))
