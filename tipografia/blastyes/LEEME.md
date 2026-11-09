# Los acentos de Blastyes

Blastyes la compró la casa a Creatype Studio (la dibujó Rian Rahardi, 2019).
El fichero original está en `original/Blastyes.ttf` y **no se toca**.

## El problema

La fuente de pago **no trae tilde ni eñe**. No es que falten y salga un
cuadrado: es peor. El `cmap` mapea `á é í ó ú ñ Á É Í Ó Ú Ñ` al glifo de la
letra **pelada**. Tecleas `Zeñorío` y dibuja `Zenorio`, sin avisar.

Comprobado glifo a glifo: `U+00F1` apunta a `n`, `U+00ED` apunta a `i`, y así
las catorce. Sí trae la diéresis alemana (`ä ö ü`), que es real.

Y no era solo el castellano. La web se traduce a seis idiomas, y la misma
trampa estaba puesta para el francés y el sueco: `à â è å` y compañía también
apuntaban a la letra pelada. La frase francesa habría salido «Voila Zenorio :
une maison batie», y la sueca «byggt pa värme». Un senuelo no se ve nunca;
por eso hay una comprobación automática al final de `acentos.py` que **falla
el build** si alguna letra acentuada comparte glifo con su pelada o no lleva
un trazo más que ella.

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

Después se añadieron las marcas de los otros idiomas, con el mismo criterio
de no inventar nada que la fuente ya tuviera:

- **El grave** existía, pero como acento suelto ya colocado a su altura (su
  caja arranca en `y=499`). Como pieza de montaje no sirve, así que se baja
  al origen igual que el agudo. De ahí salen `à è ì ò ù`.
- **El circunflejo** es un agudo y un grave que se encuentran en el pico,
  al 74% y solapados un 26% para que no se vea la junta. `â ê î ô û`.
- **La diéresis** la dibujó el diseñador, pero fundida dentro de `adieresis`:
  no hay pieza suelta. Se le sacan los dos puntos quedándose con los
  contornos que empiezan por encima de la `a` (y > 300). De ahí `ë ï ÿ`.
- **El anillo** de la `å` sueca sí hay que trazarlo: la fuente no tiene ni un
  círculo pequeño del que tirar. Va con la pluma de la eñe para que pese
  igual, y con la vuelta de dentro girando al revés, que es como TrueType
  entiende que hay un hueco. Si las dos giran igual, sale un lunar.
- **La cedilla** es su propia coma, al 82% y colgada de la línea base. Ojo
  con esto: colgarla del fondo de la caja mandaba la de la `Ç` a 781 unidades
  bajo el suelo, porque las mayúsculas de esta fuente bajan muchísimo con el
  rasgo final.

Los acentos **sueltos** (`´ ¨ ˆ ˚ ¸`) no se remapean a estas piezas: están
apoyadas en el origen porque se montan sobre una letra, y un acento suelto
saldría pegado a la línea base.

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

- **Las mayúsculas acentuadas** llevan la marca alta y a la derecha. Se
  comparó con las que dibujó el diseñador midiendo dónde cae la marca sobre
  el ancho de la letra: `Ä` al 65%, `Ö` al 65%, `Ü` al 55%, y la `É` del
  injerto al 59%. O sea, dentro de su rango y no fuera. Es el estilo de la
  fuente: estas mayúsculas llevan un rasgo de salida largo hacia la derecha
  y el diseñador pone la marca sobre él, no sobre el cuerpo de la letra.
  Dicho eso, en la web ahora **sí** sale una: el antetítulo francés
  «Événements». A cuerpo de rótulo (26 px) pasa, pero a tamaños grandes el
  acento de la `É` parece posarse sobre la `v` siguiente. Si algún día
  molesta, se corrige solo ese glifo bajándole el `CENTRO_MAY`, a sabiendas
  de que entonces la `É` deja de ir como la `Ä` del diseñador.
- No hay kerning entre pares. La fuente original tampoco lo traía.
- **Nada de cirílico**, y eso en esta web importa porque se traduce al ruso.
  Dejarlo al respaldo de fuentes no vale: el navegador sustituye *letra a
  letra*, no frase a frase, así que «Это и есть Zeñorío» saldría con
  «Zeñorío» de puño y el resto de Bodoni, y encima en un cuerpo subido un 30%
  para compensar la equis diminuta de la manuscrita. Por eso en `styles.css`
  hay una regla `html[lang="ru"]` que quita la mano y devuelve la letra
  compuesta en su cuerpo normal. Esto importa más desde que la mano se usa
  en los 27 rótulos cortos (antetítulos y categorías de la carta), que son
  justo los que en ruso van en cirílico. La firma del chef sí se queda:
  «Federico Cardenete» es latino en los seis idiomas.
- Si algún día se traduce a un idioma con alfabeto propio (griego, árabe,
  japonés), hay que añadirlo a esa misma regla. Lo que no puede pasar es
  dejarlo al respaldo y confiar.
