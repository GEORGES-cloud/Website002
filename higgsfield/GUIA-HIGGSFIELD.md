# Hero en vídeo con Higgsfield — Guía paso a paso

Objetivo: convertir 3–4 fotos del restaurante en clips cortos con movimiento de
cámara (IA) y montarlos como vídeo del hero de la web (pantalla completa, 16:9).

Yo (Claude) ya te dejé las fotos **recortadas a 16:9 y listas para subir** en:

```
higgsfield/source/
  01-entrada.jpg    ← llegada (toldos ZEÑORÍO de noche)  ⭐ la principal
  02-terraza.jpg    ← ambiente (mesa con velas entre plantas)
  03-jardin.jpg     ← detalle (lámpara de latón + copas + bokeh verde/azul)
  04-paella.jpg     ← plato estrella (opcional, cenital)
```

Tú solo tienes que generarlas en Higgsfield y devolverme los .mp4. El resto
(montaje, fundidos, optimización web y colocarlo en la web) lo hago yo.

---

## 1) Ajustes generales (para TODOS los clips)

| Ajuste            | Valor recomendado                                  |
|-------------------|----------------------------------------------------|
| Modo              | **Image to Video** (subir imagen inicial)          |
| Formato / Aspect  | **16:9** (horizontal)                              |
| Duración          | **5 s** (o lo máximo que permita tu plan)          |
| Resolución/calidad| **1080p** / la más alta disponible                 |
| Movimiento        | **Lento y sutil** (es un fondo, no un tráiler)     |

> Consejo clave: para un hero que lleva texto y botones encima, el movimiento
> tiene que ser **suave**. Nada de zooms bruscos ni giros locos: un empuje lento
> (dolly/push-in) o un paneo mínimo quedan elegantes y se pueden poner en bucle.

Los prompts van **en inglés** porque estos modelos responden mejor así. Puedes
pegarlos tal cual.

---

## 2) Clip por clip

### 🎬 Clip 1 — Entrada / llegada  ⭐ (la más importante)
- **Imagen:** `01-entrada.jpg`
- **Preset de cámara:** *Dolly In* / *Push In* / *Slow Zoom In* (si te da a elegir)
- **Prompt:**
  ```
  Slow cinematic dolly-in toward the illuminated restaurant entrance at night,
  warm candle flame flickering gently inside the glass lantern, subtle glow on
  the awnings, soft depth of field, luxury Mediterranean restaurant, calm elegant
  atmosphere, gentle camera push forward, photorealistic, no people
  ```
- **Idea:** que la cámara se acerque despacio a la entrada, con la vela del farol
  temblando. Es el plano "de bienvenida".

### 🎬 Clip 2 — Terraza / ambiente
- **Imagen:** `02-terraza.jpg`
- **Preset de cámara:** *Push In* suave o *Pan Right* muy lento
- **Prompt:**
  ```
  Gentle slow push-in over an elegant candlelit dinner table at night, wine
  glasses softly reflecting warm light, lush tropical plants swaying almost
  imperceptibly in the background, cozy intimate restaurant terrace, cinematic
  shallow depth of field, photorealistic, no people
  ```

### 🎬 Clip 3 — Detalle / mesa
- **Imagen:** `03-jardin.jpg`
- **Preset de cámara:** *Slow Zoom In* o *Rack Focus* hacia la lámpara de latón
- **Prompt:**
  ```
  Extreme slow zoom onto a brass table lamp glowing warm on a set dinner table,
  crystal glasses catching the light, dreamy green and blue garden bokeh softly
  shimmering behind, luxurious calm night ambiance, cinematic, photorealistic,
  no people
  ```

### 🎬 Clip 4 — Paella (opcional, plato estrella)
- **Imagen:** `04-paella.jpg`
- **Preset de cámara:** *Orbit* muy lento o *Top-down slow rotate*
- **Prompt:**
  ```
  Slow gentle rotation over a traditional Spanish seafood paella seen from above,
  steam rising delicately, saffron rice glistening, mussels and prawns, appetizing
  food cinematography, warm soft light, photorealistic
  ```

---

## 3) Cómo descargar y devolvérmelos

1. Genera cada clip, elige la mejor variante y **descárgala** (.mp4).
2. Guárdalas en esta carpeta con estos nombres exactos:

   ```
   higgsfield/clips-descargados/
     clip1-entrada.mp4
     clip2-terraza.mp4
     clip3-jardin.mp4
     clip4-paella.mp4      (si haces la opcional)
   ```

3. Dime **"ya están los clips"** y yo:
   - los uno con fundidos encadenados,
   - los dejo en bucle, silenciados y optimizados para web (1080p, ligero),
   - reemplazo `public/assets/video/hero.mp4` y actualizo el póster,
   - lo pruebo en el navegador y te enseño el resultado.

---

## Notas
- Con **solo el Clip 1** ya tienes un hero estupendo si quieres ir rápido. Los
  demás suman, pero no son obligatorios.
- Si Higgsfield te deja poner **imagen inicial y final**, puedes dejar solo la
  inicial: el movimiento lo genera el preset/prompt.
- Si algún clip sale con artefactos raros (cristales que se deforman, texto que
  "baila"), baja la intensidad de movimiento o vuelve a generar: con hero conviene
  poco movimiento.
- ¿Prefieres además una versión **vertical (9:16)** para que en móvil se vea a
  pantalla completa sin recortes? Dímelo y te preparo las fotos verticales para
  generar esos clips también.
