# Dirección artística — aventura completa

Versión 1.4, 7 de septiembre de 2026. Continúa el jardín aprobado usando Canvas.

Seis fondos ilustrados compartidos por familias de salas, con variantes de color y arquitectura para los 25 temas. El foso reutiliza el exterior del jardín. El atlas final de fondos tiene divisiones medidas en y=383 y 794 sobre 1254 px. Se descartó una primera generación con paneles verticales.

Ocho tipos de enemigo adicionales, dos fotogramas por tipo, y dieciséis objetos decorativos/metas. Todos los PNG finales están en assets/ y se cargan localmente. Fondos: world-scenery.png; enemigos: world-enemies.png; decoración: world-props.png. Los atlas de sprites contienen alfa real; la limpieza del fondo magenta usa la autorización del usuario para limpiar fondos por código. Recortes medidos en world-frames.js y world-prop-frames.js; preparación reproducible en tools/prepare-world-assets.py.

Se conservan las siluetas de la decoración menor (cadena, alfombra, telaraña, punto de control), rasterizadas en una cuadrícula de medio píxel lógico con paleta reducida. Suelos y plataformas usan materiales procedurales cacheados. Las reglas de juego, mapas y física se mantienen.

Generación: herramienta integrada image_gen; sin CLI de API de pago. Originales guardados por la herramienta en el directorio generated_images de Codex. No hay llamadas a servicios de generación al jugar.

## Fondos finales

```text
Production scenery atlas. Overall canvas near SQUARE, 1920 wide x 1728 tall. Exact grid 2 columns and 3 rows, SIX WIDE LANDSCAPE panels; each panel 960 wide x576 tall, ratio5:3. No margins or gutters. Rich crisp 16-bit pixel art for side-scrolling platform game matching polished moonlit forest and silver robot aesthetic. Flat side-on view, no perspective floor, no gameplay platforms or foreground floor, no people, no sprites, no text/UI. Panels edge-to-edge. TOP LEFT burgundy haunted mansion hall with arched blue moonlit windows and red curtains. TOP RIGHT walnut library wall bookcases with candles and dark teal shadows. MIDDLE LEFT gothic castle stone wall interior with arches iron grates and amber torchlight. MIDDLE RIGHT panoramic Victorian city rooftops under indigo moonlit sky with warm little windows and blue atmospheric layers. BOTTOM LEFT elegant ivory/gold museum gallery with columns and framed paintings, teal shadows. BOTTOM RIGHT Egyptian sandstone crypt wall with carved pictograms and shrine. BACKGROUND distant architecture; center readable, dark saturated shadows but clearly visible details. Every panel MUST be wide landscape, image total approximately square, NOT portrait. No panel border.
```

## Enemigos

```text
Use case: stylized-concept. Production enemy sprite atlas for a premium 16-bit pixel art platform game with cute silver robot hero. Actual transparent background; if unable use absolutely flat solid magenta #ff00ff background, no checkerboard. Strict 4 columns x 4 rows grid, 2048x2048, each cell512 square, ample empty margins, no parts cross cell edges. Sixteen isolated sprites, same crisp square pixel style, dark navy outlines, beautiful detailed 3-tone material shading. Every character centered in cell, feet at y420, same scale between its pair, full body, no floor shadow. Layout exact: row1 cells1&2 two walking poses of silver haunted knight armor facing RIGHT with red glowing visor, cells3&4 two walking poses of ivory bandaged mummy facing RIGHT with green eyes. Row2 cells1&2 two poses of small purple-gray rat facing RIGHT with pink tail; cells3&4 two poses of black violet spider with eight legs and red eyes facing front. Row3 cells1&2 two floating poses of pale cyan ghost with dark eyes and ragged cloth bottom facing front; cells3&4 two walking poses of elegant small vampire facing RIGHT, pale face black hair crimson lined cape. Row4 cells1&2 small dark iron wheeled cannon facing RIGHT, first idle second recoil with tiny orange muzzle flash; cells3&4 two frames of orange/gold flame with ivory hot center. No words, no labels, no borders, no UI. Consistent scale and recognizable silhouette per pair. Aim at highly polished pixel game sprites, not vector or smooth illustration.
```

## Decoración y metas

```text
Use case: stylized-concept. Pixel art game prop atlas, STRICT 4x4 grid sixteen isolated objects, square canvas2048. Actual transparent background, or flat solid pure magenta #ff00ff if alpha unavailable. NO checkerboard. Each object centered fully in own cell with 15 percent margins, never crosses boundary. Detailed premium 16-bit game art, crisp pixel clusters dark navy outlines and rich material highlights, moonlit gothic castle aesthetic, coherent with silver robot platformer. Exact layout row1: tall blue arched window with stone surround; ornate golden framed landscape painting; tall walnut bookcase full of colorful books; ivory candle on brass holder WITHOUT flame. Row2: oak barrel with iron hoops; ivory classical statue on pedestal; glass museum display case with golden artifact; crimson banner with golden crest. Row3: black Victorian street lamp with glowing amber lantern; golden hanging bell; wooden treasure chest; red brick chimney. Row4: steel safe with gold combination dial; wooden gothic coffin with gold cross; small red/gold hot air balloon with basket and ropes; turquoise faceted diamond inside glass case on a pedestal. View flat side-on/frontal appropriate to 2D platform game. No perspective floor, no shadows underneath, no words, no letters, no labels, no grid lines. Large legible silhouettes.
```
