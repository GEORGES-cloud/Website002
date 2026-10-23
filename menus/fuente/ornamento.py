# -*- coding: utf-8 -*-
"""Dibuja las orlas de las cartas y las deja en _ornamento.css.

   python ornamento.py

Hay TRES juegos, uno por concepto, porque cada carta tiene que oler a lo
suyo sin dejar de ser la misma casa:

  grupos      · rama de olivo. La mesa larga, el mediterraneo, lo de siempre.
  halloween   · rama desnuda y luna creciente. Seco, de noche, sin un solo
                guino de disfraz: lo que da miedo en una carta es lo barato.
  nochevieja  · chispa de fuego de artificio y estrellas pequenas.

Los tres comparten el mismo trazo —linea fina, sin relleno, como dibujado
a pluma— para que cambien de ambiente pero no de familia.

Las orlas no son imagenes: son SVG metidos en el CSS como data URI, asi
que no hay archivos que empaquetar, no se pixelan por mucho que se amplien
y el color se cambia en un sitio.

Se generan en vez de escribirse a mano porque cada juego son cuatro
esquinas y dos remates que salen de DOS dibujos girados y espejados. A
mano habria que copiar el mismo trazado seis veces por concepto —
dieciocho en total — y mantenerlos sincronizados.

Cada dibujo va en una caja de 120x120 con el vertice de la esquina en el
origen; los remates, en una de 240x60.
"""
import io
import os
import re

AQUI = os.path.dirname(os.path.abspath(__file__))

# --- grupos: rama de olivo ------------------------------------------------
ESQUINA_GRUPOS = """
<path d="M8 114 C8 76 24 46 52 27 C70 15 92 9 112 8"/>
<path d="M30 78 C22 70 23 57 33 52 C39 61 38 73 30 78 Z"/>
<path d="M44 60 C37 50 40 38 51 34 C56 44 53 56 44 60 Z"/>
<path d="M62 42 C57 31 63 20 75 19 C78 31 72 40 62 42 Z"/>
<path d="M84 27 C81 16 89 7 100 8 C101 19 94 27 84 27 Z"/>
<path d="M22 92 C31 90 38 95 39 103 C31 106 23 101 22 92 Z"/>
<path d="M40 70 C49 67 57 72 58 80 C50 83 42 79 40 70 Z"/>
<path d="M58 50 C67 48 74 53 75 61 C67 64 60 59 58 50 Z"/>
<circle cx="26" cy="86" r="1.7"/>
<circle cx="47" cy="65" r="1.6"/>
<circle cx="70" cy="45" r="1.6"/>
"""
REMATE_GRUPOS = """
<path d="M8 30 L96 30"/>
<path d="M112 30 C112 23 117 18 124 18 C124 25 119 30 112 30 Z"/>
<path d="M128 30 C128 23 123 18 116 18 C116 25 121 30 128 30 Z"/>
<path d="M120 12 L120 30"/>
<circle cx="104" cy="30" r="2"/>
<circle cx="136" cy="30" r="2"/>
<path d="M144 30 L232 30"/>
"""

# --- halloween: rama desnuda y luna ---------------------------------------
# Las ramillas NACEN del tronco (empiezan en un punto de la curva y salen
# hacia fuera). En la primera version flotaban al lado y el dibujo parecia
# un monton de arcos sueltos, no una rama.
ESQUINA_HALLOWEEN = """
<path d="M7 116 C7 78 21 48 47 28 C65 14 87 7 112 6"/>
<path d="M13 88 C23 90 31 97 34 108"/>
<path d="M22 70 C30 70 36 74 39 81"/>
<path d="M34 53 C45 55 53 63 56 74"/>
<path d="M47 38 C55 39 61 44 63 51"/>
<path d="M62 23 C72 27 78 36 79 47"/>
<path d="M79 14 C86 16 91 21 93 28"/>
<path d="M99 9 C107 13 112 20 113 29"/>
<path d="M34 108 C38 110 40 113 40 117"/>
<path d="M56 74 C61 76 64 80 64 85"/>
<path d="M79 47 C84 49 87 53 88 58"/>
<circle cx="40" cy="117" r="1.4"/>
<circle cx="64" cy="85" r="1.3"/>
<circle cx="88" cy="58" r="1.3"/>
<circle cx="113" cy="29" r="1.3"/>
"""
REMATE_HALLOWEEN = """
<path d="M8 30 L100 30"/>
<path d="M120 14 C111 16 105 23 105 31 C105 39 111 46 120 48
         C113 44 109 38 109 31 C109 24 113 18 120 14 Z"/>
<circle cx="108" cy="30" r="1.8"/>
<circle cx="132" cy="30" r="1.8"/>
<path d="M140 30 L232 30"/>
"""

# --- nochevieja: chispa y estrellas ---------------------------------------
def chispa(cx, cy, r):
    """Estrella de cuatro puntas con los lados hundidos: la chispa de toda
    la vida. Con cuatro lineas rectas salian cruces de farmacia."""
    k = r * 0.26
    return (
        '<path d="M%g %g C%g %g %g %g %g %g C%g %g %g %g %g %g '
        'C%g %g %g %g %g %g C%g %g %g %g %g %g Z"/>' % (
            cx, cy - r,
            cx + k, cy - k, cx + k, cy - k, cx + r, cy,
            cx + k, cy + k, cx + k, cy + k, cx, cy + r,
            cx - k, cy + k, cx - k, cy + k, cx - r, cy,
            cx - k, cy - k, cx - k, cy - k, cx, cy - r))


ESQUINA_NOCHEVIEJA = (
    '<path d="M8 114 C8 74 26 44 56 26 C74 15 94 9 114 8"/>'
    + chispa(28, 86, 9)
    + chispa(45, 64, 6)
    + chispa(62, 46, 8.5)
    + chispa(80, 31, 5.5)
    + chispa(98, 19, 7)
    + '<circle cx="17" cy="100" r="1.5"/>'
    + '<circle cx="112" cy="11" r="1.5"/>'
)
REMATE_NOCHEVIEJA = (
    '<path d="M8 30 L98 30"/>'
    + chispa(120, 30, 16)
    + chispa(104, 22, 5)
    + chispa(136, 38, 5)
    + '<path d="M142 30 L232 30"/>'
)

TEMAS = {
    "grupos": (ESQUINA_GRUPOS, REMATE_GRUPOS, "#3A332A"),
    "halloween": (ESQUINA_HALLOWEEN, REMATE_HALLOWEEN, "#2B2724"),
    "nochevieja": (ESQUINA_NOCHEVIEJA, REMATE_NOCHEVIEJA, "#33302B"),
}


def svg(inner, caja, tinta, transform=""):
    g = '<g transform="%s">%s</g>' % (transform, inner) if transform else inner
    return (
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %d %d' fill='none' "
        "stroke='%s' stroke-width='1.6' stroke-linecap='round' "
        "stroke-linejoin='round'>%s</svg>" % (caja[0], caja[1], tinta, g)
    )


def uri(texto):
    """Data URI de un SVG, con lo justo escapado para que valga dentro de CSS."""
    t = re.sub(r"\s+", " ", texto).strip()
    t = (t.replace("%", "%25").replace("#", "%23").replace("<", "%3C")
          .replace(">", "%3E").replace('"', "'"))
    return 'url("data:image/svg+xml,%s")' % t


def bloque(tema, esquina, remate, tinta):
    capas = [
        uri(svg(esquina, (120, 120), tinta)),
        uri(svg(esquina, (120, 120), tinta, "translate(120,0) scale(-1,1)")),
        uri(svg(esquina, (120, 120), tinta, "translate(0,120) scale(1,-1)")),
        uri(svg(esquina, (120, 120), tinta, "translate(120,120) scale(-1,-1)")),
        uri(svg(remate, (240, 60), tinta)),
        uri(svg(remate, (240, 60), tinta, "translate(0,60) scale(1,-1)")),
    ]
    return """.tema-%s .marca-agua {
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
""" % (tema, ",\n    ".join(capas))


def main():
    cabecera = """/* =====================================================================
   GENERADO POR ornamento.py — no editar a mano.

   Una orla por concepto: olivo para los menús de grupos, rama desnuda y
   luna para Halloween, chispa y estrellas para Nochevieja. Las tres con
   el mismo trazo fino, de pluma, para que cambie el ambiente y no la casa.

   Van en .marca-agua porque es el único hueco libre del HTML, que es fijo:
   ese div llevaba la Z de fondo, que en estas cartas se esconde.

   Para cambiar un dibujo o un color se toca ornamento.py y se relanza.
   ===================================================================== */
"""
    css = cabecera + "\n".join(
        bloque(tema, *datos) for tema, datos in TEMAS.items())
    io.open(os.path.join(AQUI, "_ornamento.css"), "w",
            encoding="utf-8", newline="").write(css)
    print("escrito _ornamento.css ·", len(css), "bytes ·", len(TEMAS), "temas")

    # Hojas sueltas para mirar los dibujos en grande antes de montarlos.
    for tema, (esq, rem, tinta) in TEMAS.items():
        for nombre, dibujo, caja in (("esquina", esq, (120, 120)),
                                     ("remate", rem, (240, 60))):
            ancho = 400 if nombre == "esquina" else 760
            alto = 400 if nombre == "esquina" else 190
            io.open(os.path.join(AQUI, "_prueba-%s-%s.svg" % (tema, nombre)),
                    "w", encoding="utf-8").write(
                svg(dibujo, caja, tinta).replace(
                    "<svg ", "<svg width='%d' height='%d' " % (ancho, alto)))
    print("pruebas: _prueba-<tema>-<esquina|remate>.svg")


if __name__ == "__main__":
    main()
