# Resultado de la ronda acotada de referencia

Base `31d461028516344bc0dbb80b7ecd625296509014`. Sin notas previas, cambios al juego ni puntuación de la implementación en curso.

## Evidencia alcanzada

| Nivel base | Replay limpio | Tiempo simulado | Saltos detectados | Inversiones de dirección | Llaves / puertas | Daños |
|---|---|---:|---:|---:|---:|---:|
| N1 | Prefijo; llega al acceso de la torre | 52,00 s | 34 | 48 | 2 / 2 | 6 |
| N2 | **Completo** | 75,75 s | 58 | 56 | 3 / 3 | 14 |
| N3 | Prefijo; llega a las alcantarillas | 42,33 s | 19 | 26 | 2 / 2 | 9 |
| N4 | Solo geometría/reglas | No medido | No medido | No medido | 3 / 3 en inventario | No medido |

Todos los replays de esta tabla parten de una VM nueva y usan solo controles; no pierden vidas. Las puertas y llaves de N4 son inventario, no eventos jugados. Las otras columnas tampoco son comparables como duraciones totales: dos son prefijos y solo N2 se completa.

N2: 4.545 frames, energía mínima 7,1; 615 frames de recarga efectiva, 420 frames sin dirección/salto y 10 físicamente inmóvil. Estas categorías se solapan y **no** deben sumarse/restarse para producir un supuesto tiempo activo. Los 14 daños muestran que el controlador aprovecha recursos e invulnerabilidad normal tras impacto; no es una demostración de juego experto sin recibir daño ni de buena legibilidad.

N2 se reprodujo tres veces con igual resultado para comprobar estabilidad determinista. Esto es un único testigo repetido, no tres rutas independientes ni tres jugadores. N1 y N3 también tienen una ejecución separada de comprobación. Evidencia: `validacion-replays-base.json`.

## Carencias y causa de parada

- N1 agotó 5.000 nodos intentando el objetivo final tras llegar al acceso de la torre con 5,7 de energía. El prefijo anterior es legal; su estrategia gastó demasiados recursos. No se concluye que el nivel sea imposible ni que necesite modificación.
- N3 agotó 4.000 nodos intentando cruzar alcantarillas. El prefijo ya ha recogido las dos llaves y abierto las dos puertas; faltan alcantarillas, puentes y cierre.
- N2 requirió dos pistas de objetivo espacial en el foso, que se alcanzan mediante controles; N1 una pista para usar el ascensor. Las búsquedas no comparten un nivel idéntico de ayuda espacial: esto limita cualquier comparación de eficiencia.
- N4 no se buscó con snapshots porque el harness inicial omite `boss`; solo hay inventario estructural homogéneo.
- No se ha clasificado cada segmento en decisiones significativas, espera obligatoria, desplazamiento vacío u opcional. Los eventos disponibles facilitan hacerlo, pero saltos/inversiones no equivalen a decisiones diferentes.
- No hay capturas, pruebas humanas ni evaluación de sensación de duración, facilidad o monotonía.

Por tanto, **no existe aún una mediana válida N1–N4 de duración activa o acciones significativas** para comprobar el umbral de la rúbrica. Sí existe una referencia estructural para los ocho niveles y un recorrido completo reproducible de N2, además de dos prefijos útiles para comprobar controles/eventos.

## Archivos entregados

- `index-base-31d4610.html`, `route-harness-base.cjs`: copias fijas de código base.
- `geometria-comparable.cjs`, `geometria-base.json`: inventario de los ocho niveles con los mismos predicados.
- `buscar-base.cjs`: planificador acotado N1–N3, con ayudas espaciales declaradas.
- `ruta-base-n1.json`, `ruta-base-n2.json`, `ruta-base-n3.json`: controles, eventos, métricas, estados finales y límites de búsqueda.
- `replay-base.cjs`, `validacion-replays-base.json`: comprobación desde VM limpia, con afirmaciones sobre muerte, duración y completitud.
- `PROTOCOLO-REFERENCIA.md`: procedimiento comparable y definiciones exactas, separando evidencia técnica de experiencia humana.

La revisión del rediseño debe conservar estos límites; el trabajo de implementación no se ha puntuado en esta ronda.
