# -*- coding: utf-8 -*-
"""
Le pone a Blastyes la tilde y la enie que no trae, con su propia mano.

 - El acento agudo NO se inventa: es el trazo de su propia tilde grave,
   espejado y escalado. Misma pluma, mismo gesto.
 - La enie si hay que dibujarla porque en la fuente no hay ninguna onda.
   Se traza con el grosor de su guion, que es su unico trazo horizontal.
 - Donde van las marcas lo decidio el diseniador cuando dibujo la dieresis
   de la u alemana: le copio la altura y el desvio lateral en vez de
   centrarlas, que es lo que delata a un injerto.
"""
import os, math
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "original", "Blastyes.ttf")
DST = os.path.join(os.getcwd(), "Blastyes-ES.ttf")

f = TTFont(SRC)
glyf, hmtx = f["glyf"], f["hmtx"]
gs = f.getGlyphSet()

def bbox(nombre):
    bp = BoundsPen(gs); gs[nombre].draw(bp); return bp.bounds

# ---------------------------------------------------------------- el agudo
# el grave va de arriba-izquierda a abajo-derecha; espejado da el agudo.
ESC = 0.80
b = bbox("grave")
rec = RecordingPen(); gs["grave"].draw(rec)
tp = TTGlyphPen(None)
# espejo en x, escala, y apoyado en el origen
t = Transform(-ESC, 0, 0, ESC, ESC * b[2], -ESC * b[1])
rec.replay(TransformPen(tp, t))
glyf["acute"] = tp.glyph()
ANCHO_AG = (b[2] - b[0]) * ESC
ALTO_AG  = (b[3] - b[1]) * ESC

# ---------------------------------------------------------------- la enie
GROSOR = 42.0          # el guion de la fuente mide 35; la onda pide algo mas
def onda(ancho, alto, grosor, n=56):
    """Trazo ondulado con la punta afilada en los dos extremos."""
    cen = []
    for i in range(n + 1):
        t = i / float(n)
        x = t * ancho
        y = alto * math.sin(2 * math.pi * t) * 0.5 + 20.0 * t
        cen.append((x, y))
    def media(t):
        return (grosor / 2.0) * (0.34 + 0.66 * math.sin(math.pi * t) ** 0.55)
    izq, der = [], []
    for i, (x, y) in enumerate(cen):
        t = i / float(n)
        j = min(max(i, 1), n)
        dx = cen[j][0] - cen[j-1][0]; dy = cen[j][1] - cen[j-1][1]
        L = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / L, dx / L
        h = media(t)
        izq.append((x + nx*h, y + ny*h))
        der.append((x - nx*h, y - ny*h))
    # tapas redondas en los extremos
    def tapa(p, q, centro, pasos=7):
        a0 = math.atan2(p[1]-centro[1], p[0]-centro[0])
        a1 = math.atan2(q[1]-centro[1], q[0]-centro[0])
        r = math.hypot(p[0]-centro[0], p[1]-centro[1])
        if a1 < a0: a1 += 2*math.pi
        return [(centro[0]+r*math.cos(a0+(a1-a0)*k/pasos),
                 centro[1]+r*math.sin(a0+(a1-a0)*k/pasos)) for k in range(1, pasos)]
    pts = list(izq)
    pts += tapa(izq[-1], der[-1], cen[-1])
    pts += list(reversed(der))
    pts += tapa(der[0], izq[0], cen[0])
    return pts

def apoya(pts):
    """La onda se dibuja centrada en y=0, asi que la mitad queda por debajo.
       Si la colocas tal cual, la enie se te monta encima de la n. Se baja
       todo para que el punto mas bajo del trazo sea justo el cero."""
    suelo = min(q[1] for q in pts)
    izq = min(q[0] for q in pts)
    return [(q[0] - izq, q[1] - suelo) for q in pts]

def glifo_de_puntos(pts):
    pts = apoya(pts)
    p = TTGlyphPen(None)
    p.moveTo(pts[0])
    for q in pts[1:]: p.lineTo(q)
    p.closePath()
    return p.glyph()

ANCHO_TL, ALTO_TL = 205.0, 86.0
glyf["tilde"] = glifo_de_puntos(onda(ANCHO_TL, ALTO_TL, GROSOR))
glyf["tilde.cap"] = glifo_de_puntos(onda(355.0, 150.0, GROSOR * 1.55))
ANCHO_TLC = 355.0

# ------------------------------------------------------------- i sin punto
rec = RecordingPen(); gs["i"].draw(rec)
trozos, actual = [], []
for op, args in rec.value:
    actual.append((op, args))
    if op == "closePath" or op == "endPath":
        trozos.append(actual); actual = []
def extension(tr):
    ys = [p[1] for op, args in tr for grupo in args for p in (grupo if isinstance(grupo, (list, tuple)) and grupo and isinstance(grupo[0], (list, tuple)) else [grupo]) if isinstance(p, (list, tuple))]
    return (max(ys) - min(ys)) if ys else 0
trozos.sort(key=extension, reverse=True)
tp = TTGlyphPen(None)
for op, args in trozos[0]:
    getattr(tp, op)(*args)
glyf["dotlessi"] = tp.glyph()

# ------------------------------------------------- el punto volado
# La fuente no trae periodcentered y el separador sale como una caja.
# Es su mismo punto, levantado a media altura de equis.
_pc = TTGlyphPen({n: None for n in f.getGlyphOrder() + ["period"]})
_pc.addComponent("period", Transform(1, 0, 0, 1, 0, 140))
glyf["periodcentered"] = _pc.glyph()
hmtx["periodcentered"] = (170, 0)

# --------------------------------------------------------- donde van
# medido en sus propias dieresis
CENTRO_MIN = 0.31      # fraccion del avance, en minuscula
CENTRO_MAY = 0.60      # en mayuscula
BASE_MIN   = 330.0     # altura del pie de la marca, en minuscula
HUECO_MAY  = 70.0      # sobre lo alto de la mayuscula

COMPUESTAS = {
    "aacute": ("a", "acute"), "eacute": ("e", "acute"), "iacute": ("dotlessi", "acute"),
    "oacute": ("o", "acute"), "uacute": ("u", "acute"), "ntilde": ("n", "tilde"),
    "Aacute": ("A", "acute"), "Eacute": ("E", "acute"), "Iacute": ("I", "acute"),
    "Oacute": ("O", "acute"), "Uacute": ("U", "acute"), "Ntilde": ("N", "tilde.cap"),
}
ANCHOS = {"acute": ANCHO_AG, "tilde": ANCHO_TL, "tilde.cap": ANCHO_TLC}

# ojo: asignar en glyf ya mete el nombre en el orden, asi que hay que
# anadir sin duplicar o maxp no cuadra al compilar.
orden = list(f.getGlyphOrder())
for _n in ["acute", "tilde", "tilde.cap", "dotlessi", "periodcentered"] + list(COMPUESTAS):
    if _n not in orden: orden.append(_n)
f.setGlyphOrder(orden)
glyf.glyphOrder = orden
hmtx["acute"] = (int(ANCHO_AG), 0)
hmtx["tilde"] = (int(ANCHO_TL), 0)
hmtx["tilde.cap"] = (int(ANCHO_TLC), 0)
hmtx["dotlessi"] = hmtx["i"]

print("%-10s %-9s %8s %8s" % ("glifo", "base", "dx", "dy"))
for nuevo, (base, marca) in COMPUESTAS.items():
    bb = bbox(base)
    avance = hmtx[base][0]
    may = base.isupper() or base in ("I",)
    frac = CENTRO_MAY if base[0].isupper() else CENTRO_MIN
    cen = frac * avance
    dx = cen - ANCHOS[marca] / 2.0
    dy = (bb[3] + HUECO_MAY) if base[0].isupper() else BASE_MIN
    tp = TTGlyphPen({n: None for n in orden})
    tp.addComponent(base, Transform(1, 0, 0, 1, 0, 0))
    tp.addComponent(marca, Transform(1, 0, 0, 1, round(dx), round(dy)))
    glyf[nuevo] = tp.glyph()
    hmtx[nuevo] = (avance, 0)
    print("  %-8s %-9s %8.0f %8.0f" % (nuevo, base, dx, dy))

# --------------------------------------------------------- recablear cmap
MAPA = {0x00E1:"aacute",0x00E9:"eacute",0x00ED:"iacute",0x00F3:"oacute",
        0x00FA:"uacute",0x00F1:"ntilde",
        0x00C1:"Aacute",0x00C9:"Eacute",0x00CD:"Iacute",0x00D3:"Oacute",
        0x00DA:"Uacute",0x00D1:"Ntilde",
        0x0131:"dotlessi",0x00B4:"acute",0x02DC:"tilde",0x00B7:"periodcentered"}
# La fuente lleva ademas una subtabla antigua de Macintosh que va por bytes
# (0..255) y en MacRoman, no en Unicode. Si le metes los codigos Unicode
# revienta al compilar; y si la dejas sin tocar, la fuente sigue escribiendo
# "Zenorio" en los programas de escritorio. Se recablean las dos, cada una
# en su idioma.
MACROMAN = {0xE1:"periodcentered", 0x87:"aacute", 0x8E:"eacute", 0x92:"iacute", 0x97:"oacute",
            0x9C:"uacute", 0x96:"ntilde", 0xE7:"Aacute", 0x83:"Eacute",
            0xEA:"Iacute", 0xEE:"Oacute", 0xF2:"Uacute", 0x84:"Ntilde"}
for sub in f["cmap"].tables:
    porbytes = (sub.platformID == 1) or (sub.format in (0, 6))
    fuente_mapa = MACROMAN if porbytes else MAPA
    for cp, g in fuente_mapa.items():
        if porbytes and cp > 255:
            continue
        sub.cmap[cp] = g

for n in list(COMPUESTAS) + ["acute","tilde","tilde.cap","dotlessi","periodcentered"]:
    glyf[n].recalcBounds(glyf)

f.save(DST)
print("\nTTF: %s  (%d bytes)" % (DST, os.path.getsize(DST)))

# comprobacion
g2 = TTFont(DST); c2 = g2.getBestCmap()
print("\ncomprobacion de que ya NO comparten glifo:")
for ch in "\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00d1":
    base = {"\u00e1":"a","\u00e9":"e","\u00ed":"i","\u00f3":"o","\u00fa":"u","\u00f1":"n","\u00c1":"A","\u00d1":"N"}[ch]
    print("   %s -> %-10s  (la pelada %s -> %s)  %s" % (
        ch, c2[ord(ch)], base, c2[ord(base)],
        "BIEN" if c2[ord(ch)] != c2[ord(base)] else "MAL"))
