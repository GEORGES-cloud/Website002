# Los acentos de Blastyes

Blastyes la compró la casa a Creatype Studio (la dibujó Rian Rahardi, 2019).
El fichero original está en `original/Blastyes.ttf` y **no se toca**.

## El problema

La fuente de pago **no trae tilde ni eñe**. No es que falten y salga un
cuadrado: es peor. El `cmap` mapea `á é í ó ú ñ Á É Í Ó Ú Ñ` al glifo de la
letra **pelada**. Tecleas `Zeñorío` y dibuja `Zenorio`, sin avisar.

Comprobado glifo a glifo: `U+00F1` apunta a `n`, `U+00ED` apunta a `i`, y así
las catorce. Sí trae la diéresis alemana (`ä ö ü`), que es real.

## Lo que se le hizo

`acentos.py` genera los signos que faltaban:

- **El acento agudo no se inventa.** Es el trazo de su propia tilde grave
  (`grave`, el carácter `` ` ``), espejado y al 80%. Misma pluma, mismo gesto.
- **La eñe sí hay que dibujarla**, porque en la fuente no hay ninguna onda de
  la que tirar. Se traza con el grosor de su guion (35 unidades), que es su
  único trazo horizontal, subido a 42 porque una onda fina se parte en
  pantalla.
- **Dónde van las marcas lo decidió el diseñador**, no yo: se midió en sus
  diéresis (`adieresis`, `odieresis`, `udieresis`) la altura y el desvío
  lateral, y se copió. En minúscula las marcas van a la izquierda del centro
  —entre 54 y 90 unidades—, que es lo que hace una mano de verdad en una
  letra inclinada. Centrarlas es lo que delata un injerto.
- La `í` lleva una `i` sin punto construida aparte.
- Se añadió el punto volado `·`, que tampoco venía y salía como una caja. Es
  su propio punto, subido a media altura de equis.

También se recablea la tabla `cmap` antigua de Macintosh, que va por bytes y
en MacRoman: si solo arreglas la de Unicode, la fuente sigue escribiendo
«Zenorio» en Word o Illustrator.

## Cómo rehacerla

Primero, el original. **No está en el repo**, y es a propósito: este
repositorio es público y la Blastyes es una fuente comprada. Un `.ttf` ahí
dentro es un fichero instalable que cualquiera se descarga, y eso ya no es
servir la letra en una web, es repartirla. Así que la copia comprada va a
mano en `original/Blastyes.ttf` —está en el `.gitignore`— y de ahí tiran los
scripts. En la web solo se sirve el `.woff2`, que es como se sirve una fuente
en web y es el uso que contempla una licencia de webfont.

```
python acentos.py     # original/Blastyes.ttf -> Blastyes-ES.ttf
python remata.py      # -> BlastyesES.ttf + BlastyesES.woff2
```

Y el `.woff2` a `public/assets/fonts/`, subiendo el `?v=` del `@font-face`.

## Autoría

La fuente **sigue siendo de Creatype Studio**. Los campos de copyright,
fabricante, diseñador y URL de licencia se conservan intactos. Solo cambia el
nombre de familia a **Blastyes ES**, para no pisar a la original si alguien la
tiene instalada, y la descripción, que explica qué se le añadió.

## Lo que falta

- La tilde de la **Ñ mayúscula** queda alta y algo a la derecha. En la web no
  sale ninguna (los titulares van en caja de frase), pero está ahí.
- No hay kerning entre pares. La fuente original tampoco lo traía.
- Solo alfabeto latino: si algún día se escribe un titular en ruso, cae a la
  Bodoni. Está previsto en la pila de `--font-firma`.
