# Referencias completas N1–N4: segunda ronda

Base fija `31d461028516344bc0dbb80b7ecd625296509014`. Esta ronda completa las referencias pendientes; se conservan `RESULTADO-REFERENCIA.md`, rutas y fallos de la primera ronda. No se puntúa la implementación en curso.

## Recorridos legales completos

| Nivel | Testigo válido | Frames / segundos simulados | Saltos detectados | Inversiones de dirección | Llaves / puertas | Daños | Energía mínima |
|---|---|---:|---:|---:|---:|---:|---:|
| N1 | `ruta-base-v2-n1.json` | 3.227 / 53,78 s | 37 | 24 | 2 / 2 | 0 | 62,6 |
| N2 | `ruta-base-n2.json` | 4.545 / 75,75 s | 58 | 56 | 3 / 3 | 14 | 7,1 |
| N3 | `ruta-base-v2-n3.json` | 4.100 / 68,33 s | 45 | 46 | 2 / 2 | 1 | 71,7 |
| N4 | `ruta-base-v3-n4.json` | 6.636 / 110,60 s | 64 | 80 | 3 / 3 | 0 | 49,4 |

Todos llegan a `clear` sin perder vidas mediante controles, desde el inicio del nivel y con física, energía, amenazas, puertas y condiciones de victoria normales. El replay final crea una VM nueva: no usa los snapshots del buscador ni conserva cambios de estado de una exploración. N2 es el testigo completo de la primera ronda; no se ha buscado otro.

N1/N3 y N4 se reprodujeron tres veces con resultados idénticos (`validacion-replays-ronda2.json` y `validacion-n4-completo.json`). La primera ronda ya conserva tres reproducciones de N2. Repetir el mismo testigo comprueba determinismo, no diversidad de rutas ni éxito humano.

## Evidencia del jefe de N4 dentro del recorrido completo

`eventos-base-n4.json`, obtenido con `analizar-replay-base.cjs` y un replay limpio, registra:

- Inicio del encuentro en frame 5.759, energía 99,41.
- Conductor 0 cargado en frame 5.944; vida del jefe 2.
- Conductor 1 cargado en frame 6.161; vida del jefe 1.
- Estado `wave` desde frame 6.266.
- Conductor 2 cargado en frame 6.410; vida del jefe 0.
- `boss-defeated` en frame 6.530; nivel completado en frame 6.636.

El encuentro estuvo activo 771 frames, 12,85 s de simulación. No hubo daños en todo N4. Este testigo sí incluye la aproximación, la activación de la arena, el combate y el objetivo final, sin colocar artificialmente al jugador junto al jefe.

Los archivos `probe-jefe-base*.json` son montajes exploratorios anteriores de la arena y **no** se utilizan como prueba de completabilidad. El testigo final se obtuvo por búsqueda de controles y se reprodujo desde el comienzo.

## Medidas homogéneas de observación

`analizar-replay-base.cjs` aplica a los cuatro testigos las mismas reglas y produce `eventos-base-n1.json` a `eventos-base-n4.json`. Divide cada frame en una sola categoría mecánica:

| Nivel | Recargando | Moviéndose sin recarga | Inmóvil sin recarga | Total |
|---|---:|---:|---:|---:|
| N1 | 56 | 3.162 | 9 | 3.227 |
| N2 | 615 | 3.930 | 0 | 4.545 |
| N3 | 33 | 4.057 | 10 | 4.100 |
| N4 | 168 | 6.339 | 129 | 6.636 |

Estas categorías suman el total sin solaparse. Son observaciones físicas; estar moviéndose no demuestra actividad significativa y estar inmóvil no demuestra ausencia de una decisión. El propio controlador oscila, retrocede y sigue moviéndose durante esperas.

## Límite comparativo que permanece

Ahora existen cuatro recorridos completos, pero **no una mediana validada de duración activa o acciones significativas**. No se ha clasificado semánticamente cada tramo, ni demostrado necesidad/optimalidad de cada salto o inversión.

La política de búsqueda de N1/N3/N4 penaliza más el daño que la usada para N2. Las pistas espaciales también son específicas por nivel: ascensor de biblioteca, acceso alto de alcantarillas y balcón derecho de cripta, además de los puntos de atracción de los conductores. Estas pistas orientan controles; no teletransportan, pero sí impiden presentar las diferencias de tiempo como eficiencia homogénea o dificultad relativa de los niveles.

Se pueden comparar los contadores observados como descripción de estos testigos. No se pueden convertir automáticamente en tiempo de aprendizaje humano, variedad de decisiones ni cumplimiento del umbral de sustancia de la rúbrica. Para ese umbral siguen faltando la clasificación de fases/decisiones y una política homogénea declarada para originales y rediseño.

No hay capturas ni pruebas humanas en esta referencia; duración percibida, diversión, monotonía y legibilidad continúan fuera de su alcance.

## Reproducción y aislamiento

```text
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-v2-n1.json
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-n2.json
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-v2-n3.json
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-v3-n4.json
node review/campaign-v3/analizar-replay-base.cjs review/campaign-v3/ruta-base-v3-n4.json
```

`route-harness-review.cjs` es una copia de revisión que añade `boss` a los snapshots para la búsqueda de N4; no modifica el harness del juego. `replay-base.cjs` y `analizar-replay-base.cjs` usan el harness base y no llaman a `save/restore`.

SHA256 del HTML fijo: `c6f2d2b8cf5e13d643af009a09c64bad0dbaf283006db34eb5193cb02b9c1d47`. SHA256 del harness base: `1bff62cf6cad703ec3805e4d7a85f34f563fd6a8fb805ea04bcdb728a3925e8f`.

Las observaciones del código en construcción están separadas en `OBSERVACIONES-EN-CONSTRUCCION.md`, incluida la prueba del temporizador anterior y el cambio de regla anunciado. No se han aprobado correcciones sin verificar un candidato fijo.
