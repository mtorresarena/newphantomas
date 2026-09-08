# Revisión independiente puntuada de la fuente 4

**Nota técnica: 8,15/10. Cumple los mínimos internos de la rúbrica en el alcance probado, pero sigue abierta una objeción sustancial de monotonía: varias pruebas avanzadas y los cierres de N6/N7 repiten exactamente su topología. No considero resuelta esa parte del encargo del usuario. La nota no constituye aceptación definitiva.**

Fuente exclusiva: `round4/index.html`, SHA256 `8eef8b28ed89122e03c5eb04ebed91d5923fe87b51b6b12dd6f999699e35c65b`, y `round4/manifest.json` con 24 testigos congelados. Fecha: 2026-09-08. Se conservan las notas 7,55 y 8,18, la fuente 5ada… que fallaba sustancia, el candidato 3 y todas las pruebas adversas. No se concede crédito a cambios anunciados para otro candidato.

## Puntuación y evidencia contraria

| Dimensión | Peso | Nota | Justificación y límite |
|---|---:|---:|---|
| Duración activa y densidad | 20% | **7,5** | Comparación homogénea completa; las excursiones añaden objetivos necesarios y un retorno real. N5/N6 cumplen ahora el mínimo de episodios. La clasificación semántica deja la mayoría de frames ambiguos y no acredita duración activa precisa; más segundos o llaves no bastan para llegar a 8 en esta dimensión. |
| Variedad real de decisiones | 20% | **7,5** | Cinco familias funcionales, respuestas enemigas contrastadas y tres cierres con reglas diferentes entre niveles. Sin embargo, la auditoría ahora demuestra cámaras avanzadas exactamente repetidas: cinco temporizados en N6 y cinco espejos en N7, incluidos sus cierres consecutivos. La diversidad del catálogo no elimina la repetición de soluciones. |
| Progresión y enseñanza | 15% | **7,5** | Introducciones recuperables, variantes tempranas y pistas específicas; la nueva llave requiere avanzar, volver y cruzar. Después de presentar algunas variantes avanzadas, la progresión se estanca en copias de la misma cámara. La culminación de N6/N7 no exige una transformación adicional de lo aprendido. |
| Jefes y culminación | 15% | **9,0** | N4/N8 distintos; seis impactos, tres fases, respuesta viable entre alturas y reintentos legales del jefe en cada fase. Se mantienen los casos de ventana fallida, último golpe/muerte y derrota interrumpida. No es una exploración exhaustiva de todas las estrategias o coincidencias temporales. |
| Justicia y recuperación | 15% | **9,0** | Replays completos, fallos y cinco familias recuperadas; muerte con temporizador todavía activo; llaves persistentes y puertas abiertas coherentes después de morir. Todos los nuevos casos terminan con dos vidas. No queda un bloqueo crítico reproducido abierto. Cobertura representativa, no todos los estados alcanzables. |
| Coherencia visual y legibilidad | 5% | **8,5** | P2 anteriores cerrados, capturas reales legibles de las nuevas excursiones y del jefe, ambas presentaciones cubiertas por evidencia previa y barridos actuales. Las vistas actuales de llave de retorno y fase 3 se inspeccionaron personalmente. El barrido automatizado no inspecciona semánticamente todo estado visual posible. |
| Estabilidad e integración | 10% | **9,0** | 24 replays con normalización, continuidad propia N4→título sobre fuente 4, tres repeticiones deterministas por N5–N8 y 14 bordes. Los 35 casos de navegador del autor y los barridos Pixi/Canvas se contrastaron con su código y alcance. No se atribuyen a hardware físico ni a toda la ejecución de audio/rendimiento. |

Fórmula: `7,5×0,20 + 7,5×0,20 + 7,5×0,15 + 9×0,15 + 9×0,15 + 8,5×0,05 + 9×0,10 = 8,15`.

La nota no sube automáticamente con más pruebas. Respecto a 8,18, mejoran sustancia, recuperación e integración, pero la evidencia específica de repetición reduce variedad y progresión. Se evalúa el estado acreditado, sin ajustar cifras para obtener una tendencia ascendente.

## Hallazgo de diseño reproducible

`auditar-repeticion-topologica-round4.cjs` compara tipo, plazo, orden, nodos/ángulos/alturas y la matriz completa de 29 columnas de cada cámara, normalizada respecto a su compuerta. `repeticion-topologica-round4.json` conserva firmas y contenido. No se eliminan diferencias geométricas para fabricar igualdad.

| Nivel | Pruebas con topología exactamente igual | Alcance del problema |
|---|---|---|
| N5 | Sellos 2-2, 3-1, 4-2, 5-1; contrapesos 3-2 y 5-2 | Variantes avanzadas aprendidas vuelven sin cambio estructural. |
| N6 | Temporizados 2-2, 3-1, 4-2, 5-1 y 5-2 | Mismo plazo, orden, alturas y apoyos; las dos pruebas del cierre son copias. |
| N7 | Espejos 2-2, 3-1, 4-2, 5-1 y 5-2; runas 1-2/2-1; temporizados 3-2/4-1 | Cinco repeticiones del circuito avanzado, incluidas las dos del cierre. |
| N8 | Contrapesos 2-2/4-1; espejos 3-1/5-2 | Hay reutilización antes del jefe, aunque el jefe sí aporta una culminación distinta. |

Esto prueba transferencia literal de la disposición y solución del puzle; no afirma que energía, fase global de enemigos o tránsito circundante sean idénticos. La repetición puede servir de práctica, pero cinco copias avanzadas y dos consecutivas al final no demuestran progresión adicional. Es una objeción de diseño real, no falta de una prueba humana.

**Cierre verificable:** modificar relaciones, rutas, alturas u orden de manera que una secuencia de controles aprendida deje de resolver la nueva instancia y haga falta una respuesta distinta. Conservar las mismas unidades B; no contar nodos adicionales como otra familia. Comparar topologías antes de ejecutar las políticas, después contrastar uso real, señales, solución, fallo y recuperación. Alterar solo nombres, colores, plazo o número de pulsaciones no cierra esta objeción.

## Comparación y barreras

| Episodios A–E | balanced | cautious | speed |
|---|---:|---:|---:|
| Mediana N1–N4, con incertidumbre | 23,5–24,5 | 24–25 | 22–23 |
| N5 | 25 | 23 | 24 |
| N6 | 22 | 20 | 22 |
| N7 | 29 | 29 | 29 |
| N8 | 31 | 31 | 29 |

N5–N7 cumplen el 80% y N8 el 100% en las tres políticas. N6 cautious llega exactamente al umbral conservador de 20; su vector A4/B10/C6/D0 deja poco margen y no se maquilla. D0 significa que esa política no necesita respuestas acreditadas en encuentros independientes; no borra enemigos absorbidos por B/C. La referencia N4 speed con energía mínima 3,438 sigue incluida. No se comparan políticas distintas de forma selectiva.

| Barrera | Estado en el alcance probado |
|---|---|
| Alcance | Cumple: exactamente N4/N8 como jefes. |
| Completabilidad | Cumple: secuencia legal fuente 4 hasta título. |
| Sustancia | Cumple: fases y objetivos diferenciados, mecánicas centrales requeridas y mínimos A–E. La repetición interna señalada sigue siendo un defecto cualitativo. |
| Variedad mínima | Cumple: cierres de tres reglas diferentes, al menos dos familias por nivel y respuestas enemigas contrastadas. Superar el mínimo no prueba excelencia ni ausencia de monotonía. |
| Jefe N8 | Cumple: fases, señales, contrajuego y victoria distintos de N4. |
| Justicia | Cumple: sin bloqueo crítico abierto en los estados ensayados; recuperación de objetivos y recursos obligatorios comprobada. |
| Integridad | Cumple: N1–N4, transiciones, final y persistencia dentro del alcance documentado. |

Media ≥8, ninguna dimensión <6, justicia/estabilidad ≥8 y barreras mínimas: **sí**. Es el umbral interno fijado previamente; no sustituye la aceptación del usuario ni permite declarar resuelta la monotonía señalada.

## Qué se cerró y qué queda

- **Cerrado, déficit operacional N6:** antes 17 episodios bajo las tres políticas; ahora 22/20/22, con llaves obligatorias y cruce real. No se reescribe el fallo de fuente 5ada….
- **Cerrada, respuesta local simple del antiguo cruce:** en fuente 3 bastaba derecha con salto pulsado desde una plataforma ya alcanzada, con un golpe. Fuente 4 exige el retorno observado en las tres rutas; las ocho ramas simples desde entrada/balcón no consiguen llave. No se afirma ausencia universal de atajos.
- **Cerrado, temporizador activo durante muerte:** fuente 4, muerte en frame 10962 con progreso 1 y 437 frames de plazo; reaparición en 11052, reset correcto y salida en 21243.
- **Cerrada, recuperación de inventario:** N6 antes/después de las dos puertas se completa legalmente en fuente 4; N5 antes/después de su puerta se completa en fuente 3, cuyo mapa N5 y motor son idénticos a fuente 4. Los informes conservan la fuente declarada, sin llamar replay actual a un testigo anterior.
- **Abierta, repetición estructural avanzada:** casos e intervención verificable en la tabla anterior. Es la objeción principal para el siguiente candidato.
- **Abierta, identificación de duración activa:** se analizaron los 24 testigos de ronda 2 y se repitió el observador en los seis N5/N6 actuales. Solo alrededor de 7,6% de N5 y 10,6–11,4% de N6 tiene atribución semántica firme. Los intervalos restantes se publican, no se rellenan como actividad. Hacen falta ablaciones o anotación causal más precisa para elevar esa dimensión.
- **Margen de N6 cautious:** cumple justo y elimina D independiente. No se exige retrospectivamente más que la rúbrica; conviene vigilar que futuras revisiones no reduzcan episodios efectivos al cambiar el trazado. Añadir un enemigo que se pueda ignorar no aporta margen demostrado.
- **Cobertura técnica restante:** coincidencias temporales y rutas alternativas fuera de los casos ensayados, inspección visual más amplia de estados de error/recuperación y evaluación sostenida de rendimiento/audio. Son límites de cobertura; no defectos inventados por ausencia de evidencia.

Aprendizaje, diversión y monotonía percibida no se han medido con personas. Las entradas táctiles y el mando del comprobador son sintéticos; no prueban dispositivos físicos. Esos límites se mantienen separados de los defectos de diseño efectivamente reproducidos.

## Evidencia principal y procedencia

Medición propia: `round4-classification/batch-24-a4afc47382f4-bounds-v1.json`, `comparacion-round4-final.json`, `round4-connected-replays.json`, `round4-rules14.json`, `excursion-round4-probes.json` y `recovery-r34-verified/`. Las fuentes reutilizadas se cotejan y sus controles se ejecutan sin alterar inventario, posición, energía o enemigos. Los contrafactuales y bordes usan instancias aparte y se etiquetan como fixtures.

Las recuperaciones N6 fuente 4 terminan en 22550 frames (llave2), 15931 (puerta2), 11826 (llave4) y 22549 (puerta4), todas con una muerte y dos vidas. N5 fuente 3: 20856 y 14050 frames. Se preservan también los intentos incompletos y los testigos de fuentes anteriores.

Semántica: `RESULTADO-SEMANTICO-24.md`, `semantic-classification/` y `semantic-round4-n5n6/`. Cada intervalo conserva etiquetas posibles y no suma cotas superiores que comparten frames.

Navegador del autor: 35 comprobaciones y dos barridos de 120 vistas con atlas cargados. Se inspeccionó su código y se revisaron capturas reales representativas; el revisor no ejecutó personalmente esa sesión de navegador. `gallery-help.png` de ronda 3 muestra N6, no N5, y se clasifica por su contenido. Una sospecha inicial de índices en las pistas quedó refutada por el getter legal; no figura como defecto pendiente.
