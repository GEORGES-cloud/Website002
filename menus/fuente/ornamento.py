# -*- coding: utf-8 -*-
"""Dibuja la orla de filigrana de la carta «Carbón» y la deja en _ornamento.css.

   python ornamento.py

La orla no es una imagen: es un SVG metido en el CSS como data URI, asi que
no hay archivo que empaquetar, no se pixela por mucho que se amplie y el
color se cambia en un sitio.

Se genera en vez de escribirse a mano porque son cuatro esquinas, dos
remates arriba y abajo y dos medallones a los lados, y todos salen de DOS
dibujos girados y espejados. A mano habria que copiar el mismo trazado ocho
veces y mantenerlo sincronizado.

El dibujo es la voluta de acanto de las orlas tipograficas del XIX: un
roleo grande que gira hacia dentro, un contra-roleo mas pequeno, tres hojas
y unas volutillas sueltas. Trazado en una caja de 120x120 con el vertice de
la esquina en (0,0).
"""
import io
import os
import re

AQUI = os.path.dirname(os.path.abspath(__file__))
TINTA = "#2E2C29"   # carbon, nunca negro puro: el negro plano no es de papel

# --- esquina, caja 120x120, vertice en el origen --------------------------
ESQUINA = """
<path d="M8 114 C8 68 26 36 58 19 C76 9 97 9 106 19 C114 28 111 43 100 47
         C89 51 79 44 81 34 C83 26 93 23 98 30"/>
<path d="M8 114 C12 88 24 70 45 60 C58 54 69 59 70 70 C71 80 61 86 54 81
         C48 76 51 67 58 68"/>
<path d="M30 46 C19 37 19 21 32 14 C40 25 40 39 30 46 Z"/>
<path d="M58 23 C54 10 64 1 77 4 C77 17 70 23 58 23 Z"/>
<path d="M22 86 C14 78 16 65 27 61 C32 71 30 82 22 86 Z"/>
<path d="M44 92 C52 89 59 93 60 101 C52 104 45 100 44 92 Z"/>
<path d="M74 52 C82 48 90 52 91 60 C83 64 76 60 74 52 Z"/>
<path d="M8 114 C8 105 12 100 20 99"/>
<path d="M16 102 C16 95 20 90 27 89"/>
<circle cx="37" cy="56" r="2"/>
<circle cx="63" cy="33" r="1.8"/>
<circle cx="94" cy="12" r="1.8"/>
<circle cx="18" cy="72" r="1.6"/>
"""

# --- remate del centro de los lados: dos roleos enfrentados y un rombo ----
REMATE = """
<path d="M4 30 L74 30"/>
<circle cx="80" cy="30" r="2"/>
<path d="M90 30 C98 30 104 25 104 18 C104 12 98 9 94 12 C90 15 92 21 98 21"/>
<path d="M90 30 C98 30 104 35 104 42 C104 48 98 51 94 48 C90 45 92 39 98 39"/>
<path d="M120 20 L126 30 L120 40 L114 30 Z"/>
<path d="M130 30 C138 30 144 25 144 18 C144 12 138 9 134 12 C130 15 132 21 138 21"/>
<path d="M130 30 C138 30 144 35 144 42 C144 48 138 51 134 48 C130 45 132 39 138 39"/>
<circle cx="160" cy="30" r="2"/>
<path d="M166 30 L236 30"/>
"""


def svg(inner, caja, transform=""):
    g = '<g transform="%s">%s</g>' % (transform, inner) if transform else inner
    return (
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %d %d' fill='none' "
        "stroke='%s' stroke-width='%s' stroke-linecap='round' "
        "stroke-linejoin='round'>%s</svg>"
        % (caja[0], caja[1], TINTA, "1.7", g)
    )


def uri(texto):
    """Data URI de un SVG, con lo justo escapado para que valga dentro de CSS."""
    t = re.sub(r"\s+", " ", texto).strip()
    t = (t.replace("%", "%25").replace("#", "%23").replace("<", "%3C")
          .replace(">", "%3E").replace('"', "'"))
    return 'url("data:image/svg+xml,%s")' % t


def main():
    capas = [
        uri(svg(ESQUINA, (120, 120))),                                   # arriba izq
        uri(svg(ESQUINA, (120, 120), "translate(120,0) scale(-1,1)")),   # arriba der
        uri(svg(ESQUINA, (120, 120), "translate(0,120) scale(1,-1)")),   # abajo izq
        uri(svg(ESQUINA, (120, 120), "translate(120,120) scale(-1,-1)")),# abajo der
        uri(svg(REMATE, (240, 60))),                                     # centro arriba
        uri(svg(REMATE, (240, 60), "translate(0,60) scale(1,-1)")),      # centro abajo
    ]

    css = """/* =====================================================================
   GENERADO POR ornamento.py — no editar a mano.

   La orla de filigrana de la carta «Carbón»: cuatro esquinas (el mismo
   roleo girado y espejado) y dos remates en el centro de los lados cortos.
   Para cambiar el dibujo o el color se toca ornamento.py y se relanza.

   Va en .marca-agua porque es el único hueco libre del HTML, que es fijo:
   ese div llevaba la Z de fondo, que en esta carta se esconde.
   ===================================================================== */
.marca-agua {
  background-image:
    %s;
  background-repeat: no-repeat;
  background-position:
    left top, right top, left bottom, right bottom,
    center top, center bottom;
  background-size:
    var(--orla) var(--orla),
    var(--orla) var(--orla),
    var(--orla) var(--orla),
    var(--orla) var(--orla),
    var(--remate) calc(var(--remate) / 4),
    var(--remate) calc(var(--remate) / 4);
}
""" % ",\n    ".join(capas)

    destino = os.path.join(AQUI, "_ornamento.css")
    io.open(destino, "w", encoding="utf-8", newline="").write(css)
    print("escrito _ornamento.css ·", len(css), "bytes")

    # Hojas sueltas para mirar los dos dibujos en grande antes de montarlos.
    io.open(os.path.join(AQUI, "_prueba-esquina.svg"), "w", encoding="utf-8").write(
        svg(ESQUINA, (120, 120)).replace("<svg ", "<svg width='460' height='460' "))
    io.open(os.path.join(AQUI, "_prueba-remate.svg"), "w", encoding="utf-8").write(
        svg(REMATE, (240, 60)).replace("<svg ", "<svg width='720' height='180' "))
    print("pruebas: _prueba-esquina.svg · _prueba-remate.svg")


if __name__ == "__main__":
    main()
