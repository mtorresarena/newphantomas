# Revisión independiente de las fases nuevas — v2.2

Fecha: 7 de septiembre de 2026. Revisor: agente `revisor_fases`.

**Valoración final: 9,50/10 para el encargo de convertir N5–N8 en fases con varias partes perceptibles y una dificultad que crece mediante aprendizaje y combinación.** La versión revisada cumple el umbral solicitado. No encuentro un bloqueo pendiente ni una repetición estructural grave que impida entregar este cambio.

La nota valora este alcance concreto; no es una calificación comercial de todo el juego ni una medición de diversión de jugadores externos. Revisé primero la versión anterior, señalé problemas al constructor y volví a examinar la implementación. No modifiqué código del juego ni sus pruebas. Este documento es la única entrega que he escrito.

## Rúbrica y descuentos

| Criterio | Máximo | Resultado | Justificación |
| --- | ---: | ---: | --- |
| Identidad y subzonas perceptibles | 2,00 | 2,00 | Veinte partes con nombre, indicador, geometría y cometido propio; las puertas auxiliares no inflan el número de partes. Las capturas muestran cambios efectivos de espacio y ambiente. |
| Progresión dentro de cada fase | 2,00 | 1,90 | Entrada, práctica, variación y combinación desembocan en una prueba final. Descuento 0,10 porque la cadencia de refugio, recarga y puerta es bastante uniforme, aunque resulta clara y justa. |
| Progresión N5→N8 y desenlaces | 1,50 | 1,40 | Centinelas, mecanismos y vigías desembocan en una síntesis más larga. Descuento 0,10 porque la mayor complejidad está demostrada en el diseño, pero su curva de dificultad percibida aún no está calibrada con jugadores de distinta habilidad. |
| Retos exigidos por el recorrido | 1,50 | 1,50 | Puentes, ascensores y tablas intervienen en objetivos locales obligatorios. Hay controles geométricos pareados y contactos reales registrados durante los recorridos. Se conserva libertad para esquivar enemigos con habilidad. |
| Justicia, checkpoints y recursos | 1,50 | 1,40 | Refugios antes del peligro, recarga, apoyos para esperar y reapariciones seguras. Las cuatro rutas terminan sin morir. Descuento 0,10 por el ajuste fino pendiente de ventanas de salto y recuperación ante errores de jugadores reales; una ruta calculada no representa todos sus fallos. |
| Evidencia y regresión | 1,00 | 0,85 | Motor, geometría, mapas originales, entradas, controles de soporte y rutas continuas cubiertos. Descuento 0,15: la búsqueda es finita, las rutas no recogen todo el botín en una sola partida y no hay sesión externa ni prueba física de iPhone. |
| Legibilidad y coherencia artística | 0,50 | 0,45 | Enemigos, plataformas, ácido, objetivos y rótulos mantienen el estilo. Descuento 0,05 por reutilizar algunas placas de fondo entre ambientes cercanos; la diferenciación descansa también en geometría, iluminación y mecánica. |
| **Total** | **10,00** | **9,50** | **Aprobado para este encargo.** |

Los descuentos son límites concretos de calidad y evidencia; no esconden fallos bloqueantes. Tampoco se toma el campo `pressure` del autor como una medición: su escala no determina esta nota.

## Resultado por fase

- **N5 — Jardín de las estatuas:** pasa de leer una carga y utilizar un refugio a separar guardianes, cruzar canales y encadenar islas hacia el sello. Ya no es una sucesión de salas iguales con el mismo anuncio.
- **N6 — Torre del reloj:** enseña las tablas sobre suelo seguro, exige cruzarlas sobre ácido, introduce un ascensor necesario y combina puentes móviles y tablas antes de la maquinaria final. El paseo inferior que anulaba la mecánica ha desaparecido de los retos que deben exigirla.
- **N7 — Observatorio:** cobertura horizontal, dos líneas de tiro, objetivos elevados, cruce y síntesis final. Los vigías disparan realmente en las cinco partes durante la ruta reproducida; no actúan únicamente como decoración.
- **N8 — Cámara del corazón:** reúne habilidades conocidas, fuego y momia, un acueducto, guardia y ascenso. Su última parte invierte el orden de las amenazas, cambia alturas y termina con un puente propio. En la ruta final intervienen vigía, centinela, ascensor y tablas.

La progresión no equivale a aumentar el número de enemigos en cada sala. Hay descansos y cambios de tipo de exigencia, coherentes con el planteamiento de las fases originales. El desenlace exige más decisiones encadenadas que la entrada.

## Observaciones corregidas durante la revisión

1. La auditoría inicial encontró cinco salas casi intercambiables por fase y un único tema anunciado; la valoración inicial fue **4,8/10** para este mismo encargo. La nueva organización no se limita a cambiar etiquetas: se han rediseñado recorridos, alturas y peligros.
2. En la primera iteración, N8 repetía casi cuarenta columnas de su penúltima parte al iniciar el final. El constructor cambió orden de enemigos, coberturas, distancias y ascenso. Volví a comprobar los datos, capturas y recorrido final después del cambio.
3. La explicación de tablas frágiles dependía de pisar el primer tile de la plataforma de práctica. Ahora se activa al aterrizar sobre cualquiera de sus tiles, una sola vez. Hay una regresión específica para aterrizar sobre el último.
4. Los contadores globales se ampliaron con evidencia por parte y trece controles de retirada de soportes. Esto distingue una mecánica presente en el mapa de una que participa realmente en su recorrido.

## Comprobación independiente y evidencia consultada

Ejecuté `tools/check-expansion-structure.js`: **PASS**. Verifica igualdad completa de los datos de N1–N4 frente a `749c72a`, veinte nombres y geometrías distintos, cuatro transiciones ordenadas por fase y veinte reapariciones reales seguidas de tres segundos quieto sin daño significativo.

Reproduje independientemente los cuatro JSON de entradas con `tools/route-harness.js`, desde el comienzo de cada nivel y con el bucle real. No concedí energía, inmunidad, llaves ni aperturas de puertas durante esas reproducciones. Las cuatro terminaron en `clear`, sin muerte:

| Fase | Duración de la ruta calculada | Energía mínima observada |
| --- | ---: | ---: |
| N5 | 46,7 s | 53,5 |
| N6 | 51,8 s | 85,4 |
| N7 | 48,1 s | 69,2 |
| N8 | 59,2 s | 70,8 |

En N6 confirmé apoyo en ascensor en las partes 3 y 5 y en puente móvil en la 4. En N7 observé 1, 2, 3, 1 y 2 orbes lanzados en sus cinco partes. En N8 confirmé carga, disparo, ascensor y tablas en el desenlace. Las métricas de `continuous-routes-v2.2.json` detallan contactos y actividad por parte.

Consulté el código y los trece resultados de `tools/check-required-mechanics.js` y `required-mechanics-v2.2.json`: el objetivo local se encuentra con su soporte normal y deja de encontrarse al retirar el soporte especificado. Estos controles corroboran la geometría; por su búsqueda discreta no constituyen una demostración matemática de imposibilidad de cualquier ruta imaginable.

Consulté `level-checks-v2.2.txt`: **23 pruebas de motor y ocho niveles con resultado OK**. La búsqueda geométrica comprueba llaves, puertas, metas y objetos por separado. No utilizo sus estimaciones internas de tiempo como tiempos mínimos de partida ni como medición de dificultad humana.

Inspeccioné las doce láminas `partes-n5/6/7/8-entrada/centro/salida-v2.2.jpg`: sesenta encuadres de las veinte partes. También examiné `final-n8-guardia-v2.2.jpg` y `final-n8-ascenso-v2.2.jpg`. No encontré recortes que oculten metas, saltos o nombres, ni pérdida de coherencia del estilo. La revisión de imágenes cubre entradas, centros y salidas, no únicamente el inicio de cada nivel.

El constructor informa además de las galerías de **106 vistas con PixiJS y Canvas**, ambas sin errores. La herramienta de cinco iframes simultáneos produjo un error `MutationObserver` tanto con Canvas como con Pixi; su causa no quedó acreditada y no se atribuye a Pixi. Se sustituyó por un visor de las doce láminas estáticas, con enlaces a las partes reales en `tools/visual-check.html`. El constructor comprobó el visor final navegando de N8/salida a N5/entrada en una pestaña nueva: consola vacía y contenido accesible correcto. Queda cerrada esa comprobación de la herramienta; no se presenta como una sesión del juego en Safari ni como una verificación que yo haya ejecutado personalmente.

## Límites de la aprobación

Las rutas calculadas acreditan viabilidad con esas entradas; no son sesiones de usuarios nuevos, no recogen el botín completo en una única partida y no garantizan el mismo resultado ante cualquier variación de control. La accesibilidad de objetos se comprueba de manera independiente mediante la búsqueda geométrica. No se ha realizado una prueba física en iPhone ni un estudio externo de dificultad.

No quedan cambios de diseño obligatorios para cumplir este encargo. Un posterior ajuste con jugadores puede afinar ritmo y recursos sin rehacer esta estructura. Esta aprobación no implica commit, push ni despliegue: corresponde a la versión local v2.2 examinada.
