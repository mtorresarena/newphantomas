# Verificación v1.5 — 7 septiembre 2026

- `node --check assets/pixi-world.js`: correcto.
- `node tools/check-levels.js`: 14 pruebas de motor correctas y meta alcanzable
  en los cuatro niveles (1108, 2071, 1939 y 2321 estados).
- `tools/visual-check.html?sweep=1`: 33 vistas, ambos aspectos, PixiJS activo
  en cada vista de juego; tres atlas cargados, sin errores de consola.
- Inspección visual del jardín, cripta y Egipto. Entrada normal sin panel de demo.
- Comparación y efectos se conservan en `?demo=pixi`.

Alcance: sprites nativos en jardín; dos texturas Canvas reutilizables para el
resto de salas, con composición y efectos PixiJS. HUD y pantallas Canvas.
No constituye una migración completa de todos los objetos a sprites nativos.
No se ha probado en un iPhone físico ni medido rendimiento allí.
