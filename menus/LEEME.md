# Cartas de Zeñorío

PDF listos para mandar o imprimir. Cada uno lleva **la portada original tal
cual** (la foto que mandó el restaurante) y detrás las hojas de carta
rehechas con el branding de la web: fondo espresso, todo en crema y blanco,
filetes de un pelo, Bodoni Moda en los títulos y Hanken Grotesk en los
platos. Sin fotos de platos y sin una gota de dorado.

| Carta | Español | Inglés | Hojas |
|---|---|---|---|
| Empresa (menús A · B · C) | `ZENORIO-EMPRESA-ES.pdf` | `ZENORIO-EMPRESA-EN.pdf` | portada + 3 |
| Halloween | `ZENORIO-HALLOWEEN-ES.pdf` | `ZENORIO-HALLOWEEN-EN.pdf` | portada + 1 |
| Nochevieja 2027 | `ZENORIO-NOCHEVIEJA-ES.pdf` | `ZENORIO-NOCHEVIEJA-EN.pdf` | portada + 1 |

## Cambiar un plato o un precio

Todo el contenido vive en `fuente/datos.py` — nombres, precios y lo que
incluye cada menú, en los dos idiomas. Se cambia ahí y se vuelve a lanzar:

```
cd menus/fuente
python generar.py
```

El diseño no se toca: está en `fuente/menus.css`. Las hojas se imprimen con
Chrome en headless y se les pega delante la portada del PDF original.

**Hace falta** la carpeta `fuente/originales/` con los tres PDF que mandó el
restaurante (no va al repo por tamaño: son 15 MB). Las fuentes ya están
descargadas en `fuente/fuentes/`; si hubiera que rehacerlas, `python
bajar_fuentes.py`.
