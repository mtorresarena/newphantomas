# Registro de Ampliación: Phantomas (Jefe N4 y Niveles N5–N8)

Fecha de inicio: 7 de septiembre de 2026.
Rama de trabajo: `codex/phantomas-expansion` en repositorio `mtorresarena/newphantomas`.
Estado base verificado: `7107f23` (v1.5, 14 pruebas de motor pasando, BFS completado en 4 niveles).

---

## 1. Estado y Arquitectura de Partida
- **Mundo lógico**: 320 × 192, celdas de 16 px, 12 filas.
- **Físicas**: 60 fps simulación fija desacoplada del renderizado. Salto fijo (63 px altura, ~67 px alcance horizontal).
- **Presentación**: Híbrida PixiJS (8.16.0) / Canvas fallback con soporte para `?renderer=canvas` y toggle visual clásico / renovado (tecla G).
- **Herramientas de verificación**: `tools/check-levels.js` (motor y alcanzabilidad BFS) y `tools/visual-check.html` (revisión de escenas).

---

## 2. Registro de Hitos

### Hito 1: Jefe del Museo (El Custodio del Diamante) y Cierre de N4
- **Objetivo**: Incorporar antecámara con checkpoint/recarga, arena cerrada de 20 columnas (320 px), jefe autómata con estados (intro, carga, fijar objetivo, disparo, recuperación, descarga/daño, derrota), 3 conductores de energía para desactivarlo sin armas directas, reinicio limpio al morir, bloqueo de meta hasta derrota y verificación Canvas/PixiJS.
- **Estado**: COMPLETADO.
- **Decisiones de diseño**:
  - Antecámara añadida al final del museo con punto de control `C`, batería `b` y enchufe `E`.
  - Arena de combate cerrada de 20 columnas (320 px) con suelo continuo y plataformas escalonadas.
  - Cámara fijada durante el encuentro en `boss.x0`.
  - El Custodio telegrafía con línea roja y retícula hacia Phantomas antes de disparar su orbe de energía.
  - Tres conductores situados estratégicamente (suelo en `x0+112`, plataforma izquierda en `x0+48`, plataforma derecha en `x0+240`). El disparo se desvía prioritariamente al conductor si está en su trayectoria.
  - Cada conductor cargado devuelve un arco de descarga que daña al Custodio (1 HP). A 0 HP, animación de sobrecarga, desbloqueo de la verja de salida y acceso al santuario del Diamante (`S`).
  - Reseteo limpio en `respawn()`: verjas reabiertas, salud restaurada y conductores apagados si Phantomas muere durante el encuentro.
  - Representación artística híbrida completa: `drawBoss()` en 2D Canvas fallback y renderizado en textura con PixiJS, auras e iluminación en `drawDark()`.
  - Integración de audio retro SFX (`bossAim`, `bossFire`, `bossZap`, `bossAwaken`).
  - Pruebas automatizadas en `tools/check-levels.js`:
    - Prueba de motor N dedicada que valida entrada a la arena, telegrafiado, activación sucesiva de los 3 conductores, derrota, apertura de salida y reintento limpio al morir.
    - BFS del nivel 4 completado con éxito (377 cols, 30 sacos, 3 llaves/3 puertas, alcanzabilidad de los 3 puestos de conductores y meta final en 45.7s).

### Hito 2: Niveles N5, N6, N7 y N8
- **Objetivo**: Desarrollar 4 niveles completos (5 a 6 salas horizontales cada uno), siguiendo la continuidad y temas:
  - N5: El Jardín de las Estatuas (5 salas, temática índigo/esculturas/ácido).
  - N6: La Torre del Reloj (6 salas, plataformas móviles horizontales/verticales, ritmo).
  - N7: El Observatorio del Barón (6 salas, trampas de rayos temporizadas, astronomía).
  - N8: La Cámara del Corazón (6 salas, bóveda subterránea, integración final).
- **Estado**: En preparación para ejecución.

### Hito 3: Progresión, Guardado Compatible, Estadísticas y Final de Campaña
- **Objetivo**: Extender progresión a 8 niveles, compatibilidad con `phantomas.unlocked` y `phantomas.best` legado, pantalla de fin de campaña completa con estadísticas de los 8 niveles.
- **Estado**: Pendiente.

### Hito 4: Pruebas, Revisión Visual y Documentación
- **Objetivo**: Verificación total con `check-levels.js`, visual check en ambas rutas gráficas, pruebas de controles y energía, y documentación de entrega.
- **Estado**: Pendiente.

---

## 3. Registro de Pruebas y Evidencias
- [x] Regresión base: 14 pruebas de motor OK, 4 niveles BFS OK (tiempo total ~100s).
- [x] Encuentro de combate simulado y reproducible (prueba de motor N: OK).
- [x] Alcanzabilidad completa N1–N4 con llaves, sacos, arena del Custodio y Diamante (OK).
- [x] Compatibilidad Canvas y PixiJS sin desajustes.
- [ ] Alcanzabilidad completa N5–N8.
