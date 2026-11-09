# -*- coding: utf-8 -*-
"""
Motor para dibujar una manuscrita desde cero.

Cada letra se describe como lo que es en realidad: el recorrido de la punta
del boligrafo. Una lista de puntos por trazo. El motor pasa una curva suave
por esos puntos (Catmull-Rom), la pinta con una punta redonda de grosor
constante -de ahi la monolinea-, la inclina, la vectoriza con potrace y la
mete en una fuente de verdad con fontTools.

Sistema de coordenadas de dibujo: x a la derecha, y hacia ARRIBA, linea base
en y=0. Altura de la x = 480, ascendentes 880, descendentes -300, mayusculas
900. Em de 1000 unidades.
"""
import io, math, os

UPM = 1000
XH, ASC, DESC, CAP = 480, 880, -300, 900
INCLINACION = 11.0          # grados; una firma nunca va recta
PLUMA = 23                  # grosor del trazo, en unidades de em
ESCALA = 3                  # el dibujo se hace a 3x para que potrace afine


def catmull(pts, paso=0.02):
    """Curva suave que pasa POR los puntos dados."""
    if len(pts) < 2:
        return list(pts)
    p = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(len(p) - 3):
        p0, p1, p2, p3 = p[i], p[i + 1], p[i + 2], p[i + 3]
        t = 0.0
        while t < 1.0:
            t2, t3 = t * t, t * t * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t +
                       (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
                       (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t +
                       (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
                       (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
            t += paso
    out.append(pts[-1])
    return out


def dibuja(trazos, ancho):
    """Pinta los trazos y devuelve el bitmap (negro sobre blanco)."""
    from PIL import Image, ImageDraw
    import numpy as np
    tan = math.tan(math.radians(INCLINACION))
    margen = 60
    W = int((ancho + 2 * margen) * ESCALA)
    H = int((ASC - DESC + 2 * margen) * ESCALA)

    def a_pixel(x, y):
        xs = x + y * tan                     # la inclinacion, como un cizallado
        px = (xs + margen) * ESCALA
        py = (ASC + margen - y) * ESCALA     # PIL tiene la y al reves
        return px, py

    im = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(im)
    r = PLUMA * ESCALA / 2.0
    for tr in trazos:
        if len(tr) == 1:
            px, py = a_pixel(*tr[0])
            d.ellipse([px - r, py - r, px + r, py + r], fill=0)
            continue
        for (x, y) in catmull(tr, 0.015):
            px, py = a_pixel(x, y)
            d.ellipse([px - r, py - r, px + r, py + r], fill=0)
    import numpy as np
    return np.array(im) < 128, margen


def glifo(trazos, ancho):
    """Bitmap -> contornos -> glifo TrueType."""
    import potrace
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    from fontTools.pens.cu2quPen import Cu2QuPen
    tt = TTGlyphPen(None)
    if not trazos:
        return tt.glyph()
    pen = Cu2QuPen(tt, max_err=0.6)
    arr, margen = dibuja(trazos, ancho)
    # OJO con la polaridad. Esta version de potrace, alimentada con la tinta
    # en True, devuelve el lienzo entero como contorno y se deja fuera el
    # borde de la letra: la o salia como una mancha. Pasandole el negativo
    # devuelve el par correcto -contorno exterior y hueco girando al reves-,
    # que es lo que TrueType necesita para vaciar la tripa de la letra.
    arr = ~arr
    try:
        path = potrace.Bitmap(arr).trace(turdsize=4)
    except ValueError:
        # Su optimizador de curvas se sale de dominio con algunas formas.
        # Sin el salen mas puntos de control, que a este tamano no se notan.
        path = potrace.Bitmap(arr).trace(turdsize=4, opticurve=False)

    def punto(p):
        x = (p.x / ESCALA) - margen
        y = (ASC + margen) - (p.y / ESCALA)
        return (x, y)

    alto, ancho_px = arr.shape

    def es_el_marco(curva):
        """Esta version de potrace devuelve siempre un contorno espurio del
           tamano del lienzo entero. Si se mete en el glifo, la letra sale en
           negativo: una mancha con la forma de la letra recortada dentro."""
        xs, ys = [curva.start_point.x], [curva.start_point.y]
        for s in curva:
            xs.append(s.end_point.x)
            ys.append(s.end_point.y)
        return (max(xs) - min(xs)) > ancho_px * 0.98 and (max(ys) - min(ys)) > alto * 0.98

    def emitir(curva, invertir):
        """Un contorno. Los huecos (la tripa de la 'o', el ojo de la 'e') van
           con el giro al reves: TrueType rellena por numero de vueltas, y si
           el hueco gira igual que el borde, se rellena y la letra sale como
           una mancha."""
        segs = [((None, seg.c, seg.end_point) if seg.is_corner
                 else (seg.c1, seg.c2, seg.end_point)) for seg in curva]
        if not segs:
            return
        if not invertir:
            pen.moveTo(punto(curva.start_point))
            for c1, c2, fin in segs:
                if c1 is None:
                    pen.lineTo(punto(c2))
                    pen.lineTo(punto(fin))
                else:
                    pen.curveTo(punto(c1), punto(c2), punto(fin))
        else:
            arranques = [curva.start_point] + [s[2] for s in segs[:-1]]
            pen.moveTo(punto(segs[-1][2]))
            for (c1, c2, _fin), ini in zip(reversed(segs), reversed(arranques)):
                if c1 is None:
                    pen.lineTo(punto(c2))
                    pen.lineTo(punto(ini))
                else:
                    pen.curveTo(punto(c2), punto(c1), punto(ini))
        pen.closePath()

    def recorrer(curvas, nivel):
        # potrace anida: cada contorno lleva sus huecos en .children, y los
        # huecos a su vez pueden llevar islas dentro. El nivel dice si toca
        # girar al reves o no.
        for c in curvas:
            if es_el_marco(c):
                recorrer((getattr(c, "children", None) or []), nivel)   # el marco no cuenta
                continue
            emitir(c, nivel % 2 == 1)
            recorrer((getattr(c, "children", None) or []), nivel + 1)

    recorrer(list(path), 0)
    return tt.glyph()
