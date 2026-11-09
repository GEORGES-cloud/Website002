# La letra de la casa

`ZenorioMano` no es una fuente comprada ni descargada: está dibujada aquí.
Cada letra es el recorrido de la punta del bolígrafo, escrito como una lista
de puntos en `letras.py`. `motor.py` pasa una curva suave por esos puntos, la
pinta con una punta redonda de grosor constante —de ahí la monolínea—, la
inclina 11 grados, la vectoriza con potrace y `construir.py` arma con todo
ello un `.woff2` de verdad.

No lleva una sola curva de tipografía de terceros, así que no hay licencia
que pagar ni que renovar: es de la casa.

## Para cambiar una letra

Se edita su lista de puntos en `letras.py` y se vuelve a construir:

    OUT=./salida python tipografia/construir.py

Eso deja en `salida/` el `.ttf`, el `.woff2` y dos muestras en PNG para
mirarlas. Cuando guste, el `.woff2` se copia a `public/assets/fonts/` y se
sube el `?v=` en `styles.css`.

## Lo que falta por pulir

- La `b` y la `p` tienen el ojo algo abierto.
- La `G` cruza un poco raro.
- No hay kerning: las letras van una detrás de otra con su ancho tal cual.

## Dónde se usa

Solo en `.signature`, la firma del chef en La casa. A propósito: en los
titulares se come a la Bodoni.
