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

# ------------------------------------------------------------- el grave
# El grave SI existe en la fuente, pero como acento sueltito ya colocado a
# su altura (su caja empieza en y=499). Como pieza de montaje no sirve: si
# lo pegas como componente, llega con esos 499 puestos y la marca se va al
# tejado. Se baja al origen, igual que se hizo con el agudo, y asi las dos
# marcas se colocan con la misma regla.
rec = RecordingPen(); gs["grave"].draw(rec)
tp = TTGlyphPen(None)
rec.replay(TransformPen(tp, Transform(ESC, 0, 0, ESC, -ESC * b[0], -ESC * b[1])))
glyf["grave.mark"] = tp.glyph()
ANCHO_GR = (b[2] - b[0]) * ESC
ALTO_GR  = (b[3] - b[1]) * ESC

# -------------------------------------------------------- el circunflejo
# Tampoco se inventa: un circunflejo es un agudo y un grave que se encuentran
# en el pico. Se tienen los dos trazos, asi que se montan. Van algo mas
# pequenios que sueltos -si no, el sombrerito sale enorme- y se solapan en la
# cumbre para que no se vea la junta.
ESC_CF = 0.74
SOLAPE = 0.26          # fraccion del ancho que comparten en el pico
_cf = TTGlyphPen(None)
_w = ANCHO_AG * ESC_CF
for _marca, _dx in (("acute", 0.0), ("grave.mark", _w * (1.0 - SOLAPE))):
    # se dibuja desde glyf y no desde el glyphSet: las piezas nuevas todavia
    # no tienen entrada en hmtx y el glyphSet la exige para servir un glifo.
    _r = RecordingPen(); glyf[_marca].draw(_r, glyf)
    _r.replay(TransformPen(_cf, Transform(ESC_CF, 0, 0, ESC_CF, _dx, 0)))
glyf["circumflex"] = _cf.glyph()
ANCHO_CF = _w * (2.0 - SOLAPE)

# ----------------------------------------------------------- la dieresis
# Esta la dibujo el disenador, pero no como pieza aparte: viene fundida
# dentro de adieresis, odieresis y udieresis. Se le saca de ahi quedandose
# solo con los contornos que van por encima de la letra -los dos puntos-,
# que son los que empiezan mas arriba de donde acaba la 'a' (276).
rec = RecordingPen(); gs["adieresis"].draw(rec)
_trozos, _act = [], []
for op, args in rec.value:
    _act.append((op, args))
    if op in ("closePath", "endPath"):
        _trozos.append(_act); _act = []
def _suelo(tr):
    ys = []
    for op, args in tr:
        for grupo in args:
            if isinstance(grupo, (list, tuple)):
                if grupo and isinstance(grupo[0], (list, tuple)):
                    ys += [p[1] for p in grupo]
                elif len(grupo) == 2 and all(isinstance(v, (int, float)) for v in grupo):
                    ys.append(grupo[1])
    return min(ys) if ys else 0
_puntos = [tr for tr in _trozos if _suelo(tr) > 300]
assert len(_puntos) == 2, "esperaba dos puntos de dieresis, veo %d" % len(_puntos)
_di = TTGlyphPen(None)
for tr in _puntos:
    for op, args in tr:
        getattr(_di, op)(*args)
_tmp = _di.glyph(); _tmp.recalcBounds(glyf)
# y se baja al origen, como las demas
rec2 = RecordingPen()
_tmp.draw(rec2, glyf)
_di2 = TTGlyphPen(None)
rec2.replay(TransformPen(_di2, Transform(1, 0, 0, 1, -_tmp.xMin, -_tmp.yMin)))
glyf["dieresis"] = _di2.glyph()
ANCHO_DI = _tmp.xMax - _tmp.xMin

# -------------------------------------------------------------- el anillo
# La 'a' sueca. Aqui no hay nada que copiar -la fuente no tiene ni un circulo
# cerrado pequenio- asi que se traza, con la pluma de la enie para que pese
# igual que el resto de las marcas. Dos vueltas: la de fuera en un sentido y
# la de dentro al reves, que es como TrueType entiende que hay un hueco. Si
# las dos giran igual, el anillo se rellena y sale un lunar.
def anillo(radio, grosor, n=40):
    out, inn = [], []
    for i in range(n):
        a = 2.0 * math.pi * i / n
        for lista, r in ((out, radio + grosor/2.0), (inn, radio - grosor/2.0)):
            lista.append((r * math.cos(a), r * math.sin(a)))
    return out, list(reversed(inn))

R_AN, G_AN = 52.0, GROSOR * 0.78
_fuera, _dentro = anillo(R_AN, G_AN)
_an = TTGlyphPen(None)
for _c in (_fuera, _dentro):
    _c = [(x + R_AN + G_AN/2.0, y + R_AN + G_AN/2.0) for (x, y) in _c]
    _an.moveTo(_c[0])
    for q in _c[1:]: _an.lineTo(q)
    _an.closePath()
glyf["ring"] = _an.glyph()
ANCHO_AN = 2.0 * R_AN + G_AN

# ------------------------------------------------------------- la cedilla
# Es su propia coma, encogida y puesta debajo de la letra. Una coma manuscrita
# ya es un rabito que baja y gira: exactamente lo que hace una cedilla.
ESC_CE = 0.82
bc = bbox("comma")
rec = RecordingPen(); gs["comma"].draw(rec)
_ce = TTGlyphPen(None)
rec.replay(TransformPen(_ce, Transform(ESC_CE, 0, 0, ESC_CE, -ESC_CE*bc[0], -ESC_CE*bc[3])))
glyf["cedilla"] = _ce.glyph()      # cuelga: su techo esta en y=0
ANCHO_CE = (bc[2] - bc[0]) * ESC_CE

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
    # castellano
    "aacute": ("a", "acute"), "eacute": ("e", "acute"), "iacute": ("dotlessi", "acute"),
    "oacute": ("o", "acute"), "uacute": ("u", "acute"), "ntilde": ("n", "tilde"),
    "Aacute": ("A", "acute"), "Eacute": ("E", "acute"), "Iacute": ("I", "acute"),
    "Oacute": ("O", "acute"), "Uacute": ("U", "acute"), "Ntilde": ("N", "tilde.cap"),
    # frances, sueco e italiano: son los que piden los textos de la web
    # escritos a mano. Van completos y no solo las cuatro letras que hoy
    # hacen falta, porque las traducciones cambian y un acento que falta en
    # esta fuente no se ve: escribe la letra pelada y se calla.
    "agrave": ("a", "grave.mark"), "egrave": ("e", "grave.mark"),
    "igrave": ("dotlessi", "grave.mark"), "ograve": ("o", "grave.mark"),
    "ugrave": ("u", "grave.mark"),
    "Agrave": ("A", "grave.mark"), "Egrave": ("E", "grave.mark"),
    "Igrave": ("I", "grave.mark"), "Ograve": ("O", "grave.mark"),
    "Ugrave": ("U", "grave.mark"),
    "acircumflex": ("a", "circumflex"), "ecircumflex": ("e", "circumflex"),
    "icircumflex": ("dotlessi", "circumflex"), "ocircumflex": ("o", "circumflex"),
    "ucircumflex": ("u", "circumflex"),
    "Acircumflex": ("A", "circumflex"), "Ecircumflex": ("E", "circumflex"),
    "Icircumflex": ("I", "circumflex"), "Ocircumflex": ("O", "circumflex"),
    "Ucircumflex": ("U", "circumflex"),
    # la dieresis de la a, la o y la u ya la dibujo el disenador; faltan estas
    "edieresis": ("e", "dieresis"), "idieresis": ("dotlessi", "dieresis"),
    "ydieresis": ("y", "dieresis"),
    "Edieresis": ("E", "dieresis"), "Idieresis": ("I", "dieresis"),
    "Ydieresis": ("Y", "dieresis"),
    "aring": ("a", "ring"), "Aring": ("A", "ring"),
    "ccedilla": ("c", "cedilla"), "Ccedilla": ("C", "cedilla"),
}
ANCHOS = {"acute": ANCHO_AG, "tilde": ANCHO_TL, "tilde.cap": ANCHO_TLC,
          "grave.mark": ANCHO_GR, "circumflex": ANCHO_CF, "dieresis": ANCHO_DI,
          "ring": ANCHO_AN, "cedilla": ANCHO_CE}

# La cedilla es la unica que va por debajo de la linea base, y ademas se
# centra de verdad bajo la letra: no lleva el desvio a la izquierda de las
# marcas de arriba, que existe porque la letra esta inclinada y el acento se
# apoya sobre el final del trazo. Abajo pasa lo contrario, el pie va detras.
ABAJO = {"cedilla"}
HUECO_ABAJO = 18.0     # lo que separa el rabito del pie de la letra

# ojo: asignar en glyf ya mete el nombre en el orden, asi que hay que
# anadir sin duplicar o maxp no cuadra al compilar.
MARCAS = ["acute", "tilde", "tilde.cap", "grave.mark", "circumflex",
          "dieresis", "ring", "cedilla"]
orden = list(f.getGlyphOrder())
for _n in MARCAS + ["dotlessi", "periodcentered"] + list(COMPUESTAS):
    if _n not in orden: orden.append(_n)
f.setGlyphOrder(orden)
glyf.glyphOrder = orden
for _n in MARCAS:
    hmtx[_n] = (int(ANCHOS[_n]), 0)
hmtx["dotlessi"] = hmtx["i"]

print("%-10s %-9s %8s %8s" % ("glifo", "base", "dx", "dy"))
for nuevo, (base, marca) in COMPUESTAS.items():
    bb = bbox(base)
    avance = hmtx[base][0]
    if marca in ABAJO:
        # Centrada de verdad bajo la letra, y colgando de la LINEA BASE, no
        # del fondo de la caja. Las mayusculas de esta fuente bajan hasta
        # -1.1 em con el rasgo final, asi que medir desde el fondo mandaba la
        # cedilla de la C a 781 unidades bajo el suelo, a hacer compania al
        # rabo de la letra en vez de al pie.
        dx = (bb[0] + bb[2]) / 2.0 - ANCHOS[marca] / 2.0
        dy = -HUECO_ABAJO
    else:
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
        0x00E0:"agrave",0x00E8:"egrave",0x00EC:"igrave",0x00F2:"ograve",
        0x00F9:"ugrave",
        0x00C0:"Agrave",0x00C8:"Egrave",0x00CC:"Igrave",0x00D2:"Ograve",
        0x00D9:"Ugrave",
        0x00E2:"acircumflex",0x00EA:"ecircumflex",0x00EE:"icircumflex",
        0x00F4:"ocircumflex",0x00FB:"ucircumflex",
        0x00C2:"Acircumflex",0x00CA:"Ecircumflex",0x00CE:"Icircumflex",
        0x00D4:"Ocircumflex",0x00DB:"Ucircumflex",
        0x00EB:"edieresis",0x00EF:"idieresis",0x00FF:"ydieresis",
        0x00CB:"Edieresis",0x00CF:"Idieresis",0x0178:"Ydieresis",
        0x00E5:"aring",0x00C5:"Aring",
        0x00E7:"ccedilla",0x00C7:"Ccedilla",
        0x0131:"dotlessi",0x00B7:"periodcentered"}
# Los acentos sueltos -el ´ de U+00B4, el ¨, el ˆ, el ˚, el ¸- NO se mapean
# a estas piezas. Las piezas estan apoyadas en el origen porque se montan
# sobre una letra; un acento suelto tiene que ir a su altura, y si le pones
# la pieza sale pegado a la linea base, como caido. Lo que la fuente trajera
# para esos codigos se queda tal cual.
# La fuente lleva ademas una subtabla antigua de Macintosh que va por bytes
# (0..255) y en MacRoman, no en Unicode. Si le metes los codigos Unicode
# revienta al compilar; y si la dejas sin tocar, la fuente sigue escribiendo
# "Zenorio" en los programas de escritorio. Se recablean las dos, cada una
# en su idioma.
MACROMAN = {0xE1:"periodcentered", 0x87:"aacute", 0x8E:"eacute", 0x92:"iacute", 0x97:"oacute",
            0x9C:"uacute", 0x96:"ntilde", 0xE7:"Aacute", 0x83:"Eacute",
            0xEA:"Iacute", 0xEE:"Oacute", 0xF2:"Uacute", 0x84:"Ntilde",
            0x88:"agrave", 0x8F:"egrave", 0x93:"igrave", 0x98:"ograve", 0x9D:"ugrave",
            0xCB:"Agrave", 0xE9:"Egrave", 0xED:"Igrave", 0xF1:"Ograve", 0xF4:"Ugrave",
            0x89:"acircumflex", 0x90:"ecircumflex", 0x94:"icircumflex",
            0x99:"ocircumflex", 0x9E:"ucircumflex",
            0xE5:"Acircumflex", 0xE6:"Ecircumflex", 0xEB:"Icircumflex",
            0xEF:"Ocircumflex", 0xF3:"Ucircumflex",
            0x91:"edieresis", 0x95:"idieresis", 0xD8:"ydieresis",
            0xE8:"Edieresis", 0xEC:"Idieresis", 0xD9:"Ydieresis",
            0x8C:"aring", 0x81:"Aring",
            0x8D:"ccedilla", 0x82:"Ccedilla"}
for sub in f["cmap"].tables:
    porbytes = (sub.platformID == 1) or (sub.format in (0, 6))
    fuente_mapa = MACROMAN if porbytes else MAPA
    for cp, g in fuente_mapa.items():
        if porbytes and cp > 255:
            continue
        sub.cmap[cp] = g

for n in list(COMPUESTAS) + MARCAS + ["dotlessi", "periodcentered"]:
    glyf[n].recalcBounds(glyf)

f.save(DST)
print("\nTTF: %s  (%d bytes)" % (DST, os.path.getsize(DST)))

# ---------------------------------------------------------- comprobacion
# No vale con mirar si el codigo esta en el cmap: el problema de esta fuente
# era justo que estaba, apuntando al glifo de la letra pelada. Asi que se
# comprueba que el glifo sea OTRO, y ademas que de verdad dibuje algo encima.
import unicodedata
g2 = TTFont(DST); c2 = g2.getBestCmap(); gl2 = g2["glyf"]; gs2 = g2.getGlyphSet()
LETRAS = ("\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00d1"
          "\u00e0\u00e8\u00ec\u00f2\u00f9\u00c0\u00c8\u00cc\u00d2\u00d9"
          "\u00e2\u00ea\u00ee\u00f4\u00fb\u00c2\u00ca\u00ce\u00d4\u00db"
          "\u00eb\u00ef\u00ff\u00cb\u00cf"
          "\u00e5\u00c5\u00e7\u00c7"
          "\u00e4\u00f6\u00fc\u00c4\u00d6\u00dc")
malas = []
print("\ncomprobacion, %d letras acentuadas:" % len(LETRAS))
for ch in LETRAS:
    pelada = unicodedata.normalize("NFD", ch)[0]
    g, gp = c2.get(ord(ch)), c2.get(ord(pelada))
    if g is None:
        malas.append((ch, "no esta en el cmap")); continue
    if g == gp:
        malas.append((ch, "escribe la letra pelada (%s)" % g)); continue
    # Y tiene que llevar tinta de mas que la pelada. Se cuentan los contornos
    # con el glifo desmontado: base + marca siempre da mas trazos que la base
    # sola. Mirar solo la caja no vale: la cedilla de la C cae DENTRO de la
    # caja de la C, porque esa mayuscula ya baja 763 unidades con su rasgo,
    # y el glifo correcto parecia malo.
    def trazos(nombre):
        # OJO: con un boligrafo normal, un glifo compuesto no le cuenta ni un
        # trazo. Le manda "aqui va la 'a' y aqui el acento" y se queda tan
        # ancho; los contornos no pasan por el. Hay que usar el que desmonta
        # los compuestos, o salen todas las letras mal menos las de una pieza.
        from fontTools.pens.recordingPen import DecomposingRecordingPen
        r = DecomposingRecordingPen(gs2)
        gs2[nombre].draw(r)
        return sum(1 for op, _a in r.value if op == "moveTo")
    if gl2[g].numberOfContours == 0:
        malas.append((ch, "glifo vacio")); continue
    # La i acentuada pierde el punto para ganar el acento, asi que tiene los
    # mismos trazos que la i y hay que compararla con la i SIN punto.
    contra = "dotlessi" if gp == "i" else gp
    if trazos(g) <= trazos(contra):
        malas.append((ch, "no lleva tinta de mas que la pelada"))
if malas:
    for ch, por in malas:
        print("   MAL  %s  U+%04X  %s" % (ch, ord(ch), por))
    raise SystemExit("\n%d letras mal de %d" % (len(malas), len(LETRAS)))
print("   todas bien: cada una con glifo propio y con un trazo mas que su pelada")
