# Resultados técnicos de las excursiones, antes de otra nota

No modifica las notas 7,55 y 8,18 ni sus fuentes. Ronda 3 es f2a7d393…; ronda 4 es 8eef8b28…. Las coordenadas de ambas se fijaron cargando mapas sin leer sus rutas. Las métricas mantienen el algoritmo A–E y las mismas cotas de referencia.

## Comparación

| Fuente / nivel | balanced | cautious | speed |
|---|---:|---:|---:|
| Ronda 3, N5 | 25 | 23 | 24 |
| Ronda 3, N6 | 21 | 21 | 21 |
| Ronda 4, N5 | 25 | 23 | 24 |
| Ronda 4, N6 | 22 | 20 | 22 |

Todos superan el mínimo preregistrado. N6 cautious de ronda 4 llega exactamente a la cota conservadora requerida, **20 = 80% de 25**. No se añade margen por redondeo ni se llama robustez excepcional a ese resultado. Sus 20 episodios son A4/B10/C6/D0: la ruta cautelosa elimina las respuestas de encuentros independientes que acreditan otras políticas. Los enemigos dentro de B/C siguen absorbidos por esas familias; D0 no afirma que no encuentre enemigos.

N5 ahora acredita A2 por su llave/puerta. N6 acredita A4 y seis obstáculos C, además de las diez pruebas B. La llave elevada no recibe un C adicional por los saltos de acceso, y el péndulo no añade D porque queda dentro de C. En ronda 3 se perdió un D respecto al mapa anterior; no se presupone que toda incorporación produzca un incremento neto.

Los 24 testigos de ronda 4 han pasado replay individual y normalización de comandos con estado final completo idéntico. Los controles reutilizados conservan su sourceHash original; se cotejan mapa/configuración con su fuente declarada y luego se ejecutan en fuente 4. No se finge que fueran búsquedas nuevas. La comparación completa y unicidad de trazas están en `comparacion-round4-final.json`. La referencia N4 speed con energía mínima 3,438 sigue incluida.

## Políticas simples y el cambio de geometría

`excursiones-round3-probes.json` conserva 12 ramas. Cada rama reproduce controles naturales desde el origen hasta el prefijo señalado; no coloca el personaje mediante un fixture.

- N5 galería: las cuatro políticas (derecha, salto mantenido, salto pulsado y Abajo repetido) no consiguen llave/puerta en 900 frames. El testigo balanced recoge la llave en 7720 y abre en 8063.
- N6 montacargas: ninguna de las cuatro resuelve. Balanced usa el elevador durante 16 frames de la excursión, recoge en 2942 y abre en 3432. Eso demuestra uso real, no una prueba exhaustiva de que ningún salto alternativo pueda evitarlo.
- N6 cruce de ronda 3: desde el prefijo 7676, ya sobre plataforma izquierda alta (y=46), derecha + salto pulsado resuelve en 402 frames con un golpe y sin morir. Derecha simple cae al ácido. Se trata de una respuesta local simple desde una preparación ya realizada, no un atajo demostrado desde el inicio del nivel. El hallazgo no elimina A/C ni demuestra que sea la mejor estrategia global.

Ronda 4 reubica la llave hacia la izquierda. `excursion-round4-probes.json` demuestra las tres rutas completas: todas pasan por el balcón derecho en y=78 y recogen la llave retrocediendo a x≈7579, y=30, antes de volver hacia la puerta.

Las ocho ramas simples de balanced, desde entrada (frame 7565, x7418,93/y94) y balcón83 (frame 7723, x7622,97/y78), no recogen la llave. Seis terminan en ácido; las dos de Abajo esperan sin resolver. Son ocho políticas locales, no una búsqueda exhaustiva de toda estrategia. El retorno observado cierra la objeción concreta de la antigua respuesta automática, sin convertir cuatro cambios de dirección de comandos en cuatro decisiones humanas.

## Señales y una hipótesis retirada

El revisor sospechó que `campaignService()` usaba un índice equivocado de zonas. Se contrastó y **se retiró**: `L.def.segs` contiene también los segmentos de transición y el getter de lectura devuelve la pista correcta durante prefijos legales de ronda 4. No es un defecto abierto ni requiere cambio. La diferencia de `partLesson()` respecto a score1 es exclusivamente una consulta de pista; el resto del texto del ciclo de entradas/física/enemigos/jefe coincide después de excluir esa única línea inspeccionada. `compatibilidad-fuente-round4.json` documenta esa excepción.

Capturas de ronda 3 inspeccionadas: `lift-legal.png`, `pendulum-legal.png` y `gallery-help.png` muestran interfaz y ayudas legibles. El último nombre es engañoso para cobertura: su contenido es **N6, Las Horas Invertidas**, no la galería N5. No se contabiliza como captura de N5 ni como la nueva colocación de la llave en ronda 4.

## Motor e integración

`round4-rules14.json` registra los 14 fixtures ejecutados sobre fuente 4. Incluyen umbral exacto, caducidad, reinicio, ventana perdida y último golpe/muerte. Son fixtures de estado, no recorridos completos. El título del test de espejos no equivale a una enumeración exhaustiva de todas las configuraciones.

`round4-connected-replays.json` registra tres replays deterministas de cada N5–N8 y una secuencia legal N4→N5→N6→N7→N8→título con entradas de teclado y pausa. Esa continuidad se ejecutó por el revisor en la fuente actual, no se heredó como promesa.

Se inspeccionaron los resultados del autor: 35 comprobaciones de navegador y barridos de 120 vistas con Pixi y Canvas. El comprobador utiliza selección mediante fixture, eventos DOM sintéticos, localStorage real aislado y mando simulado. El barrido invoca vistas previas y verifica renderers/atlas; no demuestra que se haya jugado cada sala ni que todos los estados temporales resulten visualmente legibles. No se ejecutó personalmente esa sesión de navegador; sí se inspeccionó el código pertinente. No se atribuye compatibilidad de hardware físico a esas pruebas.

## Semántica

`RESULTADO-SEMANTICO-24.md` conserva la ejecución íntegra del conjunto de ronda 2. Para los seis recorridos N5/N6 de fuente 4 se repitió exactamente el observador en `semantic-round4-n5n6/`: N5 tiene alrededor de 7,6% de atribución cierta y N6, 10,6–11,4%. El resto sigue ambiguo. Las nuevas excursiones acreditan objetivos y respuestas, pero **no eliminan la carencia de duración activa identificada**. Esa dimensión no se eleva automáticamente a 8 por superar el conteo A–E.
