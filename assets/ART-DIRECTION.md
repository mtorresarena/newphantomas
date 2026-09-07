# Recursos gráficos de la muestra del jardín

Fecha: 2026-09-07. Generación mediante la herramienta integrada `image_gen`; no se usó la API de pago por CLI.

Referencia visual aportada por el usuario: `ChatGPT Image 7 sept 2026, 09_09_01.png`.

## Recursos de producción

- `garden-background.png`: fondo nocturno ilustrado, 1619 × 971. Se mueve lentamente con la cámara.
- `garden-robot.png`: atlas RGBA, 1774 × 887; cuatro poses de carrera, reposo, salto, caída y daño.
- `garden-props.png`: atlas RGBA, 1774 × 887; árbol, saco, llave, calavera y cuatro poses de murciélago.
- `garden-frames.js`: recortes y pivotes medidos sobre los atlas.
- `garden-terrain.js`: terreno, plataformas, pinchos y ácido pixelados; extensión del dibujo procedural existente.
- `garden-ui.js`: fuente bitmap original y marcador, sin fuentes externas.

El generador entregó los atlas como RGB con un fondo de cuadros, también después de solicitar una corrección. El usuario autorizó explícitamente limpiar ese fondo por código. `tools/prepare-garden-assets.py` elimina el fondo, conserva las partes blancas de robot/calavera, limpia el halo del borde y calcula recortes y pivotes de ojos para el murciélago. No cambia la resolución del dibujo. Los PNG finales contienen transparencia real y se sirven desde este proyecto. Los originales generados permanecen en el directorio de imágenes de Codex.

Los gráficos se dibujan sobre los mismos mapas y cuerpos de colisión de la versión anterior. La mejora del escenario se limita al jardín; el robot, los objetos compatibles y el marcador comparten el aspecto nuevo durante la aventura. G y el botón de comparación alternan presentación sin reiniciar ni cambiar la simulación.

## Prompt: Fondo del jardín

```text
Use case: stylized-concept. Asset type: production background for a 2D side-scrolling pixel-art platform game, landscape 1920 x 1152.
Use the supplied reference ONLY as art direction: beautiful richly detailed 16-bit pixel art, dark indigo moonlit forest and distant haunted castle with small warm golden windows, blue mountains and silhouetted fir trees. Create a NEW background plate matching the reference atmosphere and visual quality.
Composition: upper 55% mostly open midnight-blue sky with subtle pixel clouds, a luminous pale full moon in upper-right quadrant; distant castle toward right around 75% width, rising from the woods; layered dark blue woodland and undergrowth in bottom 45%, dark along bottom edge. The castle is distant scenery, not playable architecture. The image fills the whole frame.
Critical: ONLY scenery, NO robot, NO characters/enemies, NO money bags, NO game UI or text, NO platforms, NO foreground playable grass ledge, NO soil cross-section, NO acid pools. Those will be separate game objects. Pixel edges are clean, deliberate square pixels and limited shading ramps. No smooth 3D/vector art. No border, labels or watermark.
```

## Prompt: Animaciones del robot

```text
Use case: stylized-concept. Asset type: game character sprite sheet on GENUINELY TRANSPARENT alpha background.
The supplied image is a style and robot identity reference only. Draw the same small charming silver robot thief: large rounded helmet, wide black glass visor, two bright cyan eyes, small silver body, tiny hands and boots, cyan chest light. Detailed crisp 16-bit pixel-art matching reference, 3/4 side view facing RIGHT.
Deliver a strict 4 columns x 2 rows sprite sheet, 1024 x 512, each cell exactly 256 x 256. EIGHT full-body frames of SAME character at IDENTICAL scale. Robot height ~190 pixels and width ~135 pixels in every cell, feet on y=224 baseline of each cell, centered horizontally. Nothing crosses a cell boundary. No shadows under feet, no background, no grid lines, no labels, no text.
Top row: 4 successive RUN cycle poses (left leg forward, passing, right leg forward, passing), arms swinging, consistent helmet and proportions.
Bottom row: IDLE standing pose, JUMP rising knees slightly tucked, FALL descending legs extended, HURT startled arms out.
All sprite frames face RIGHT. Dark navy outline with clean pixel edges, bright silver planes, restrained blue shadows and cyan highlights. Animation must remain recognizable and aligned; head doesn't change size. Actual transparent alpha around and between sprites, not a checkerboard drawn into the image.
```

## Prompt: Árbol, objetos y murciélago

```text
Use case: stylized-concept. Asset type: production game props and enemy sprites atlas on GENUINELY TRANSPARENT alpha background, 1024 x 512 pixels, strict 4 columns x 2 rows, each cell exactly 256 x 256.
Reference image supplies only visual style: rich high-quality crisp 16-bit pixel art from the moonlit robot platformer, clean square-pixel clusters and subtle dark outlines.
ROW 1 from left to right:
cell 1: a full isolated leafy tree, emerald/lime green moonlit canopy with darker blue-green shadows, brown trunk, no ground; whole tree centered, 220px tall, up to210px wide, bottom at y240.
cell 2: one gold money sack with tied neck and dark dollar symbol $, front view, 160px tall, 125px wide centered.
cell 3: one gold skeleton key, horizontal, readable big circular bow and two teeth, 170px wide, 90px high centered.
cell 4: one ivory skull enemy facing front, wide dark eye sockets, small teeth, crisp highlights, 170px tall/170px wide centered.
ROW 2: four successive wing flap animation frames of ONE SAME small purple bat enemy, facing front with pink-red glowing eyes and purple membrane wings. Frame1 wings up, frame2 wings stretched horizontally, frame3 wings down, frame4 wings stretched horizontally. Body identical and center fixed at each cell's center; entire bat within200px width and150px height, ample transparent gutters. Simple tiny bat body, menacing but cute.
Actual transparent alpha everywhere around each object. Do not include checkerboard pattern, background, platforms, game UI, labels, frames, grid lines or watermark. All objects fully visible isolated. Pixel-art rendering and visual quality match reference.
```

## Corrección solicitada al generador

```text
Use case: background-extraction. Edit target: attached robot sprite sheet. Remove the entire white/light-gray checkerboard backdrop and replace it with REAL alpha-channel transparency. The checkerboard is currently painted into the RGB image; that is wrong for the game. Return a transparent PNG containing exactly these eight robot frames, on their same 4-column 2-row layout, unchanged in size, position, colors, poses and visual identity. Preserve all robot whites, silver highlights, dark outlines and cyan glow. No added grid, checkerboard or replacement color backdrop. The PNG must have actual transparent pixels around each robot.
```

La corrección siguió produciendo RGB. Se descartó y se preparó el atlas a partir de la primera generación, con la autorización de limpieza por código.
