# Arte de la expansión — 7 de septiembre de 2026

Generación con `image_gen` integrado en Codex. No se utilizó CLI ni proveedor/API
de pago configurado aparte. Referencias del propio juego; mantener pixel art
detallado, contornos azul marino, metal bronce, luces cian/ámbar y siluetas legibles.

## Entregables y preparación

| Archivo final | Contenido | Preparación |
| --- | --- | --- |
| `expansion-enemies-v2.png` | Centinela, Vigía y Custodio; cuatro poses cada uno | Fondo neutral eliminado, alfa real, recortes medidos en `expansion-frames.js` |
| `world-expansion.png` | Estatuas / reloj / observatorio / corazón en cuadrícula 2×2 | Imagen original; muestreo con borde interior para evitar mezcla entre paneles |
| `expansion-props-v2.png` | Sello / engranaje / lente / corazón en cuadrícula 2×2 | Magenta eliminado, alfa real, recortes en `expansion-prop-frames.js` |

`expansion-art.js` dibuja las poses con altura de referencia común por personaje;
los estados agachados no se agrandan para llenar el cuadro. Las señales de ataque
siguen separadas del sprite. Los fondos los carga `world-art.js`. Ambos funcionan
en el Canvas de mundo compartido por la presentación PixiJS y su respaldo Canvas.

La limpieza de fondos por código fue autorizada expresamente por el usuario en
esta conversación. Se conserva la herramienta reproducible:

```text
python tools/prepare-expansion-assets.py <atlas-enemigos-original.png>
python tools/prepare-expansion-assets.py <atlas-trofeos-original.png> --props
```

Requiere Pillow, NumPy y SciPy. El script verifica las dimensiones de las fuentes;
un atlas regenerado con otros límites requiere medir de nuevo, no reutilizar los
recortes a ciegas. Los PNG finales ya están preparados para despliegue estático.

## Fuentes locales de generación

Directorio original (fuera del repositorio):
`C:/Users/mtare/.codex/generated_images/01a07ab7-d8c6-77b2-a87c-04f694438c15/`

- Enemigos: `exec-82ce6151-cc17-48fb-88a5-20e787e53a8d.png`, 1448×1086.
- Fondos: `exec-647ff402-f16c-42b6-aabc-883c5e8d21bd.png`, 1619×971.
- Trofeos: `exec-6a717810-8edc-4f8d-bf09-f84c62597a39.png`, 1254×1254.

## Prompts utilizados

### Enemigos

Create ONE production sprite sheet for Phantomas. The reference image is STYLE
REFERENCE ONLY: match its polished detailed 16-bit pixel art, crisp pixel clusters,
dark navy outlines, three-tone material highlights and cute sinister proportions.
Do NOT copy the magenta backdrop. True transparent background requested, if
impossible flat solid pure magenta #ff00ff, never checkerboard. Grid exactly FOUR
columns by THREE rows, all cells equal and well separated, no text, no labels, no
gridlines, every body completely inside its cell with generous margins. Row1 four
poses of same stocky blue-grey carved STONE SENTINEL with bronze shoulder plates,
amber eyes, stone boots, facing RIGHT: idle, crouched winding up charge, running
charging right, kneeling exhausted eyes dim. Same character same scale baseline
across four. Row2 four poses of same hooded spectral WATCHER, rich purple tattered
cloak, ornate small bronze collar and ONE large cyan-violet glowing eye, floating
FRONT three-quarter slightly right, distinct from a sheet ghost: idle, preparing
eye open, firing arms/robe spread but no projectile, exhausted with dim eye. Row3
four poses of the same impressive museum boss CUSTODIAN, ancient stone and bronze
automaton with ornate Egyptian/gothic carved mask, large shoulder armor, heavy
stone hands, prominent glowing amber round chest core, violet eyes, full body
FRONT facing slightly LEFT: idle, aiming left hand raised, damaged braced with
visible fissures, deactivated kneeling core dark. Boss visually larger and more
imposing than sentinel but all four boss poses share same scale. Detailed polished
production pixel game sprites not smooth vector shapes, not 3D rendered. No
ground, no scenery, no UI, no baked light halos around silhouette, no cast
shadows, no cropped extremities. Sprite alpha clean including interior holes.
Actual game asset atlas, overall landscape 4:3.

### Escenarios

Referencia: `garden-background.png` del proyecto.

Production background atlas for four new Phantomas levels. Reference is ONLY
style: detailed crisp 16-bit pixel art moonlit atmosphere, dark indigo shadows,
square pixel clusters, warm amber lights and beautiful depth. ONE image arranged
EXACTLY 2 columns x 2 rows, four equal WIDE landscape panels, no gaps no border no
labels; overall landscape ratio 5:3, each panel also 5:3. TOP LEFT: haunted GARDEN
OF STATUES at midnight, ivy-covered broken marble sculptures, distant ornate
mausoleum and blue moon through cypress trees, layered blue mist, overgrown garden.
TOP RIGHT: interior CLOCK TOWER, immense bronze clock face behind beams,
interlocking brass gears and thick chains in deep blue shadow, warm amber light
filtering through clock numerals without legible text. BOTTOM LEFT: ancient gothic
OBSERVATORY interior, open dome framing starry sky and cyan moon, huge elegant
brass telescope and armillary sphere in BACKGROUND with deep blue stone and gold
trim. BOTTOM RIGHT: underground HEART CHAMBER, monumental stone vault with a
suspended luminous amber-red crystalline mechanical heart, bronze ribs and
restrained orange furnace light, deep blue shadows and dark stone, not futuristic.
These are distant background plates only: no characters, no enemies, no UI, no
collectibles, NO playable foreground floor, NO horizontal gameplay platforms, no
immediate foreground objects. Flat side-view 2D game background, not isometric.
Architecture detailed and evocative but center and lower play area low contrast
and unobstructed so added sprites and platforms remain legible. Every panel is
fully separate its own scene, same polished pixel-art family as reference, no
photorealism or smooth 3D. No letter labels or words anywhere.

### Trofeos

Referencia: `world-enemies.png` del proyecto, utilizada como referencia de acabado.

Create a production item sprite atlas in the same detailed 16-bit pixel art style
as the reference, but with NO characters. Exactly FOUR large isolated collectible
trophies in a 2x2 equal-cell square grid. True transparent background, if impossible
pure solid magenta #ff00ff, never checkerboard. Top left: ornate circular bronze
SEAL embossed with a gothic lion emblem, on small dark blue stone plinth with gold
trim. Top right: substantial intricate brass GEAR with eight teeth and dark hollow
center, upright on matching plinth. Bottom left: magical pale cyan crystal LENS
held in a bronze astronomical ring, upright on matching plinth. Bottom right:
vivid ruby crystal HEART unmistakably heart-shaped with two lobes and bottom point,
bronze filigree cage around its edges, on matching plinth. Detailed rich carved
surfaces, crisp dark navy outlines, highlights and deliberate square pixels,
three-tone material ramps matching the reference. Front view for a side-scrolling
gothic game. All four items same approximate scale filling center 65 percent of
each cell, ample space, fully isolated with margins, no touching neighbors, no
text, no numbers, no frames, no scenery, no shadows underneath, no external glow
halo. High quality readable small in game, not flat geometric icons, no smooth
gradients or 3D render.

## Validación

Ver `../review/REVISION-CONSTRUCTOR-v2.1.md` y sus seis capturas. La revisión incluye
las 72 vistas con PixiJS y con Canvas, los cuatro trofeos, poses, jefe y segmentos
nuevos. Esta documentación no supone aprobación artística final del usuario ni
despliegue en producción.
