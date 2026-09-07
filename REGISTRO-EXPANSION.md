# Registro de Ampliación: Phantomas (Jefe N4 y Niveles N5–N8)

Fecha: 7 de septiembre de 2026.  
Rama de trabajo: `codex/phantomas-expansion` en repositorio `mtorresarena/newphantomas`.  
Estado base de partida: `7107f23` (v1.5, 14 pruebas de motor pasando, BFS completado en 4 niveles).  
Estado final: Campaña completa de 8 niveles + Jefe final del Museo (El Custodio del Diamante), 15 pruebas de motor pasando al 100% y BFS de alcanzabilidad al 100% en los 8 niveles.

---

## 1. Resumen Ejecutivo del Trabajo Realizado

Se han completado con éxito los 4 hitos contemplados en el plan de ampliación `PLAN-AMPLIACION-JEFE-Y-NIVELES-5-8.md`:

1. **Hito 1 — Jefe del Museo (El Custodio del Diamante) y Cierre de N4**:
   - Arena cerrada de combate de 20 columnas (320 px) con suelo continuo y plataformas escalonadas.
   - Telegrafiado con retícula de fijación y rayo rojo antes de disparar su orbe de energía.
   - Tres conductores de energía escalonados que canalizan y devuelven el rayo para dañarlo sin armas directas.
   - Sistema de reintento seguro con reset completo al morir y apertura de verja a la meta `S` (El Diamante) al ser derrotado.
   - Renderizado dual (PixiJS híbrido y Canvas fallback) con audio retro SFX (`bossAim`, `bossFire`, `bossZap`, `bossAwaken`).
   - Prueba de motor N dedicada agregada a `tools/check-levels.js` validando todo el ciclo de combate.

2. **Hito 2 — Cuatro Niveles Nuevos Completos (N5 a N8)**:
   - **N5: El Jardín de las Estatuas** (226 cols, meta El Sello de Bronce, canción `garden`, 12 sacos, 2 llaves / 2 puertas `D3S3`, charca de ácido, momias `u`, ratas `r`, arañas `a`, murciélagos `m`, calaveras `c`, fantasmas `g`).
   - **N6: La Torre del Reloj** (226 cols, meta El Engranaje Maestro, canción `castle`, 10 sacos, 2 llaves / 2 puertas `D3M`, plataformas móviles horizontales `-` y ascensor vertical `!`, péndulos, engranajes `Q`, guardias `w`, ratas `r`, murciélagos `m`).
   - **N7: El Observatorio del Barón** (226 cols, meta La Lente Lunar, canción `city`, 11 sacos, 2 llaves / 2 puertas `D3O`, telescopio, ventanales `W`, charca de ácido, ascensor vertical `!`, calaveras `c`, fantasmas `g`).
   - **N8: La Cámara del Corazón** (226 cols, meta El Corazón del Castillo, canción `museum`, 11 sacos, 2 llaves / 2 puertas `D3H4`, antorchas `s`, lago de lava/ácido con puente móvil `-`, ascensor vertical `!`, momias `u`, guardias `w`, murciélagos `m`).
   - Calibración rigurosa de las plataformas a alturas `r=7` (48 px de elevación desde el suelo `r=10`) y escalones a `r=5` (32 px adicionales), garantizando que todo saco, llave y meta sea accesible dentro del salto físico exacto de 63 px de Phantomas.

3. **Hito 3 — Progresión, Guardado Compatible, Estadísticas y Final de Campaña**:
   - Persistencia compatible en `localStorage`:
     - `phantomas.unlocked`: guarda el índice del nivel alcanzado (0 a 7, permitiendo continuar hasta el nivel 8).
     - `phantomas.best8`: récord independiente para la campaña completa de 8 niveles.
     - `phantomas.best`: preserva el récord histórico legado de la campaña de 4 niveles sin sobreescribirlo ni borrarlo.
   - Pantalla de título actualizada con textos claros de "8 NIVELES · CAMPAÑA COMPLETA", botón dinámico `C: CONTINUAR NIVEL (unlocked+1)` y desglose de mejor botín (8 niveles vs. legado).
   - N4 adaptado narrativamente: el diamante revela el pasadizo subterráneo al Jardín de las Estatuas, permitiendo el avance natural a N5.
   - Pantalla de victoria final reservada exclusivamente para la conclusión del Nivel 8 (`lvl === LEVELS.length - 1`), calculando el botín global acumulado, tiempo total, rango de ladrón y récord sin continuaciones.
   - Herramienta de inspección `tools/visual-check.html` actualizada con los nuevos ambientes `statues`, `clocktower`, `observatory` y `heart`.

4. **Hito 4 — Pruebas Automatizadas y Verificación Total**:
   - `node tools/check-levels.js` ejecutado con éxito total (código de salida 0):
     - 15/15 pruebas de motor pasando (físicas, techos, suelo, plataformas móviles, ascensor, muros, reaparición, puertas, ácido, cañones, alarmas, patrullas y jefe Custodio).
     - 8/8 niveles verificados por búsqueda en anchura (BFS) simulando la física real de entrada de mandos y apertura secuencial de puertas.

---

## 2. Métricas Detalladas de la Campaña de 8 Niveles

Resultados extraídos de la ejecución del verificador oficial `tools/check-levels.js`:

| Nivel | Nombre | Columnas | Sacos | Llaves / Puertas | Camino Mínimo BFS | Estados BFS | Resultado |
|---|---|---|---|---|---|---|---|
| **N1** | LA MANSIÓN DEL BARÓN | 177 | 13 | 2 / 2 | ~70 s | 1.108 | **OK** |
| **N2** | EL CASTILLO DE DRÁCULA | 312 | 23 | 3 / 3 | ~134 s | 2.071 | **OK** |
| **N3** | LOS TEJADOS | 302 | 20 | 2 / 2 | ~80 s | 1.939 | **OK** |
| **N4** | EL MUSEO (con El Custodio) | 377 | 30 | 3 / 3 | ~159 s | 2.583 | **OK** |
| **N5** | EL JARDÍN DE LAS ESTATUAS | 226 | 12 | 2 / 2 | ~68 s | 1.380 | **OK** |
| **N6** | LA TORRE DEL RELOJ | 226 | 10 | 2 / 2 | ~68 s | 1.480 | **OK** |
| **N7** | EL OBSERVATORIO DEL BARÓN | 226 | 11 | 2 / 2 | ~60 s | 1.413 | **OK** |
| **N8** | LA CÁMARA DEL CORAZÓN | 226 | 11 | 2 / 2 | ~60 s | 1.460 | **OK** |
| **TOTAL** | **8 NIVELES** | **2.072** | **130** | **18 / 18** | **~699 s (~11.6 min)** | **13.434** | **100% OK** |

---

## 3. Pruebas de Motor (15/15 OK)

- `OK   gracia de amanecer tras morir: dawn=89.9 vidas=2`
- `OK   ascensor: frames sin apoyo en 700 = 0`
- `OK   puente movil: frames sin apoyo en 700 = 0`
- `OK   quieto sobre plataforma =: frames sin apoyo=0, desvio vertical=0.00 px`
- `OK   quieto sobre suelo solido: frames sin apoyo=0, desvio vertical=0.00 px`
- `OK   enemigos terrestres mantienen su fila`
- `OK   tope exacto contra muro: penetracion=0.000 px, frames dentro=0`
- `OK   desplazamiento de plataformas moviles en el primer frame: 0.94 px`
- `OK   reaparicion segura (2 s de invulnerabilidad, 150 frames quieto) en todos los puntos de control`
- `OK   puerta col 48: sin llave cerrada=true (tope 0.00), con llave abierta=true llaves restantes=0`
- `OK   el acido quita una vida al caer en el`
- `OK   la bala de cañon hiere: energia 100 -> 79.6`
- `OK   placa de alarma: saltandola no se activa=true, pisandola se activa=true, expira sola=true`
- `OK   patrulleros dentro de su sala y fuera de los pinchos`
- `OK   encuentro con El Custodio: arena, telegrafiado, 3 conductores, derrota, apertura de salida y reinicio seguro`

---

## 4. Historial de Commits en `codex/phantomas-expansion`

1. `6b1d9a2` — `feat: jefe final del museo (El Custodio del Diamante) y cierre de N4`
2. `a66b102` — `feat: incorporar niveles completos N5 a N8 (estatuas, reloj, observatorio, corazon)`
3. `8887a7c` — `feat: progresion, guardado best8, seleccion de nivel y soporte 8 niveles en visual-check`

