# Verificación de Phantomas 1.4

7 de septiembre de 2026. Renovación visual de los cuatro niveles, manteniendo Canvas.

## Motor y recorridos

`node tools/check-levels.js`: 14 pruebas de motor correctas. Los cuatro niveles dan
`RESULTADO: OK`, sin puertas inaccesibles ni avisos de justicia. Estados alcanzados por
nivel: 1108, 2071, 1939 y 2321. Sacos: 13, 23, 20 y 30. Llaves/puertas: 2/2, 3/3, 2/2 y 3/3.

Comparación literal contra la muestra aprobada respaldada: CFG, mapas y construcción de
niveles, audio, entrada, estado del juego, movimiento, IA y cámara permanecen idénticos.
Sintaxis de todos los módulos de assets y del script principal comprobada con Node.

## Renderizado y recursos

`tools/visual-check.html?sweep=1`: 33 vistas renderizadas en ambos aspectos, incluidos
los 25 ambientes, atlas de enemigos, título, introducción, pausa, fin de partida y cierre
de nivel. Resultado del navegador: `OK: 33 vistas renderizadas en ambos aspectos.
Tres atlas cargados. Caché: 244 imágenes.`

Se inspeccionaron capturas del vestíbulo, museo, ciudad, castillo, sala egipcia, introducción
y conjunto de enemigos. Se corrigió un fallo exclusivo de la escena sintética de enemigos:
faltaban dimensiones para calcular sus luces. La escena de QA ya las incluye.

Los nuevos atlas se cargan por HTTP local. Sprites de enemigos y decoración con transparencia
RGBA real y recortes medidos; ocho tipos de enemigo, dos poses por tipo, dieciséis objetos.
La presentación conserva un dibujo de respaldo si un atlas no está disponible.
Las ilustraciones se comparten por familias de salas; no son 25 fondos únicos.

La herramienta visual usa almacenamiento en memoria para sus vistas y no guarda sus
desbloqueos en el almacenamiento del jugador. Las escenas son capturas detenidas, no
una grabación de una partida completa. No se ha hecho una partida manual completa de
los cuatro niveles ni una nueva prueba de rendimiento en un móvil físico.

## Capturas

- `museo-v1.4.jpg`
- `castillo-v1.4.jpg`
- `tejados-v1.4.jpg`
- `egipto-v1.4.jpg`

## Recursos y restauración

Prompts y procedencia: `assets/WORLD-ART-DIRECTION.md`.
Copia de la muestra aprobada: `backups/2026-09-07-jardin/index-v1.3-jardin.html`.
Para restaurar esa muestra, copiar el respaldo sobre `index.html` conservando assets.
No se han publicado ni desplegado estos cambios.
