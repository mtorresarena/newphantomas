# Revisión final independiente: fuente 7

**Nota técnica: 8,80/10. Cumple las siete barreras y los mínimos internos de la rúbrica, en el alcance probado. Las objeciones técnicas principales de brevedad operacional, repetición avanzada y recuperación han quedado resueltas con evidencia. Esto no constituye aceptación definitiva del usuario ni demuestra diversión, aprendizaje o ausencia de monotonía percibida por personas.**

Fecha: 2026-09-08. Candidato evaluado: `round7/index.html`, SHA256 `383fc2c0837ffdf01deff83fbcf4e3d02dbf512d1de94c39d147679757c42607`. Se aplican los pesos, escala y barreras de `CRITERIOS.md`, fijados antes de inspeccionar el juego. Exactamente dos jefes: N4 y N8. No se ha editado juego ni assets desde la revisión.

## Puntuación justificada

| Dimensión | Peso | Nota | Evidencia y límite material |
|---|---:|---:|---|
| Duración activa y densidad | 20% | **8,5** | Veinticuatro rutas comparables, objetivos obligatorios y ventanas que separan ejecución, tránsito, espera, recursos y tiempo no atribuido. N5–N8 superan sus mínimos A–E. N5 cautious espera más por guardianes; N6 conserva menor margen relativo que N5/N7/N8. El observador reconoce mejor los hitos explícitos de puzles que la acción fluida original, por lo que no se afirma una proporción exacta de densidad humana ni optimalidad. |
| Variedad real de decisiones | 20% | **9,0** | Cambios verificados de recorrido, altura, orientación, orden y retorno sustituyen las copias avanzadas; cinco familias funcionales y respuestas enemigas diferentes. Setenta ramas locales legales sobre catorce variantes nuevas no encuentran las simplificaciones ensayadas. Enumeración de ángulos descarta el patrón universal de girarlos todos. Hay práctica repetida y soluciones locales compartidas; no se atribuyen decisiones nuevas por cada nodo ni se afirma ausencia exhaustiva de atajos. |
| Progresión y enseñanza | 15% | **8,5** | Introducciones recuperables, variantes que transforman lo aprendido y cierres propios. Las letras y pistas conectan los estados ópticos con acciones concretas; el pisotón opcional está disponible permanentemente en la pausa de la primera parte. La progresión sigue un recorrido guiado y reutiliza familias; no se ha medido descubrimiento, comprensión o fatiga con jugadores nuevos. |
| Jefes y culminación | 15% | **9,0** | N4 conserva su combate; N8 exige una victoria distinta, con tres fases, ataques anticipados y contrajuego entre alturas. Se mantienen los reintentos legales por fase y los bordes de ventana fallida/último golpe/muerte, con código compatible contrastado. Los recorridos actuales incluyen seis impactos y salida. No se han explorado todas las estrategias o coincidencias temporales posibles. |
| Justicia y recuperación | 15% | **9,0** | Recuperaciones legales anteriores de las cinco familias, inventario y fases del jefe, más reintentos actuales del peso alto, espejo mixto, reloj de retorno, reloj final activo y retorno de guardián. Los cuatro reintentos y la ruta del guardián se reprodujeron personalmente también en fuente 7. No queda bloqueo crítico reproducido abierto; la cobertura es representativa de las dependencias, no exhaustiva de todos los estados alcanzables. |
| Coherencia visual y legibilidad | 5% | **8,5** | P2 de polilla/táctil cerrados, capturas actuales de A/B/C/D, receptor, ayuda del reloj y pausa vertical en ambos aspectos inspeccionadas. La fuente 7 corrige la ayuda genérica y mantiene el texto íntegro. Los barridos y capturas son amplios pero no constituyen inspección semántica de cada escena, resolución y fase visual. |
| Estabilidad e integración | 10% | **9,0** | Veinticuatro replays normalizados propios sobre fuente 6; contraste exacto del delta 7 y de los 24 hashes/replays finales del autor; recuperación propia sobre 7; continuidad propia sobre 6 y actual sobre 7; 14 bordes y 35 pruebas DOM/storage/render con SHA del documento cargado. Sin errores relevantes detectados. Audio, rendimiento sostenido y dispositivos físicos no están cubiertos plenamente. |

Fórmula: `8,5×0,20 + 9×0,20 + 8,5×0,15 + 9×0,15 + 9×0,15 + 8,5×0,05 + 9×0,10 = 8,80`.

La mejora respecto a fuente 4 se debe a cambios de diseño verificados y a una atribución temporal más adecuada, no a alcanzar una cifra objetivo ni a sumar pruebas. La escala original considera 8 sólido en el alcance declarado y reserva 10 para evidencia comparativa excepcionalmente amplia. No se requiere inventar pruebas humanas para valorar lo técnico, y tampoco se infieren esas pruebas de la nota.

## Comparación completa, sin cambiar unidades

Los testigos N1–N8 × balanced/cautious/speed se congelaron en fuente 6. Se verificaron hashes, legalidad de órdenes, origen natural, final sin muerte y normalización de órdenes consecutivas manteniendo exactamente el estado final. Hay tres trazas de controles distintas por nivel; no son tres personas ni tres búsquedas óptimas. Las tres de N6 duran exactamente 11346 frames, pero tienen controles y respuestas independientes diferentes.

| Episodios significativos A–E | balanced | cautious | speed |
|---|---:|---:|---:|
| Mediana N1–N4, intervalo conservador | 23,5–24,5 | 24–25 | 22–23 |
| N5 | 25 | 24 | 24 |
| N6 | 21 | 21 | 20 |
| N7 | 29 | 31 | 30 |
| N8 | 32 | 33 | 29 |

N5–N7 requieren al menos 80% de la mediana original y N8 el 100%. Todos los valores actuales superan incluso el extremo conservador correspondiente. La regla original exige una ruta comparable; no se ha convertido retrospectivamente en la obligación de que pasen las tres. El vector de familias y cada contrafactual permanecen en los JSON, no se sustituyen por el total. N6 speed tiene D0 independiente: esa política evita la necesidad acreditada de respuesta en esos encuentros, sin borrar amenazas absorbidas por B/C.

Las acciones A–E no son pulsaciones, inversiones de dirección ni segundos. Una cámara de cuatro nodos continúa contando como una unidad B. Las tres excursiones nativas de llaves mantienen sus unidades y fronteras desde su prerregistro; el traslado de la llave N6 se registró antes de medirlo.

## Duración observada por ventanas

Rangos entre las tres políticas completas de cada nivel, en segundos de simulación. Cada columna puede tener su mínimo/máximo en una ruta diferente: no deben sumarse extremos para fabricar otra ruta.

| Nivel | Total | Ejecución de objetivos | Tránsito simple | Espera de mecanismo | Recursos no atribuidos | Resto no atribuido |
|---|---|---|---|---|---|---|
| N5 | 181,25–186,75 | 84,22–110,57 | 39,50–41,38 | 0,30–14,30 | 0,87–2,90 | 28,10–45,80 |
| N6 | 189,10 | 121,35–121,72 | 36,98–37,67 | 4,65–6,18 | 0,85–0,87 | 23,12–24,43 |
| N7 | 155,73–156,30 | 86,90–88,52 | 38,70–39,17 | 2,73 | 0,65–0,67 | 24,57–26,38 |
| N8 | 204,27–211,50 | 111,37–118,27 | 39,67–42,68 | 12,42–16,52 | 1,32–3,65 | 32,40–36,67 |

También se conservan los pocos frames de recogida opcional aislada. No hay muertes en estas 24 rutas; la repetición tras muerte se mide en testigos aparte. No se ha inferido exploración opcional prolongada de recoger una bolsa incidental.

V2 reconoce transporte, ascenso, retorno y combate como ejecución extendida hacia hitos verificados; no exige reducirlos al frame de activación. Conserva la incertidumbre sobre necesidad mínima y desvíos. La cobertura de atribución es aproximadamente 74–87% en N5–N8 frente a 41–72% en N1–N4. Esa diferencia tiene sesgo de observación: los puzles ofrecen hitos B explícitos; el tiempo no atribuido de los originales no se llama vacío. Las cotas del observador puntual anterior siguen archivadas y no se reetiquetan en silencio.

Cautious N5 muestra una carga fallida y espera real de retorno del guardián. De 197 frames neutrales con guardián retornando, 179 quedan sin atribuir en V2 y 18 como espera por otra condición reconocida. Se describen como latencia observada, sin añadirlos a actividad ni alterar el algoritmo. Los tiempos aproximados del BFS geométrico tampoco se utilizan como cotas mínimas del motor.

## Barreras de la rúbrica

| Barrera | Resultado y fundamento |
|---|---|
| 1. Alcance | **Cumple.** Solo jefes N4/N8; N5 culmina en transporte del peso alto, N6 en retos de orden/tiempo con ascensor/ácido y N7 en circuito óptico. Son cierres de reglas diferentes, sin jefes encubiertos. |
| 2. Completabilidad | **Cumple.** Rutas legales desde origen y continuidad N4→N5→N6→N7→N8→título. Las soluciones positivas no usan restauraciones, invulnerabilidad, muerte directa ni recursos regalados. |
| 3. Sustancia | **Cumple.** Fases obligatorias de introducción, variación y culminación, dependencias de puertas y mecánicas centrales reales, mínimos comparables superados. La anchura o el reloj no sustituyen esas pruebas. |
| 4. Variedad mínima | **Cumple.** Al menos dos familias obligatorias por nivel y tres cierres distintos. Guardián, polilla y vigía presentan señales/fijación/ataque diferentes; el escarabajo añade pisotón opcional verificado. Las combinaciones y respuestas se contrastaron, no solo sus nombres. |
| 5. Jefe N8 | **Cumple.** Victoria distinta de N4, seis impactos, fases con contrajuego y anticipación; ventanas y muerte/reintento coherentes en el alcance probado. |
| 6. Justicia | **Cumple en el alcance ensayado.** Fallos parciales, muerte con reloj activo, restitución de objetos/ángulos y recuperación de guardianes vuelven a estados resolubles. No queda bloqueo permanente o daño inevitable que impida completar reproducido y abierto. |
| 7. Integridad | **Cumple.** N1–N4 permanecen iguales y funcionales; pausa, selección, persistencia, transiciones y salida final verificadas con procedencia declarada. |

Media ≥8, ninguna dimensión <6 y justicia/estabilidad ≥8: **sí**. Cumplir estos mínimos internos no equivale a la aprobación definitiva del usuario.

## Objeciones cerradas y límites que permanecen

**Defectos de diseño anteriores cerrados en el candidato actual:** déficit N6 de 17 episodios; respuesta local simple de la antigua llave N6; cadenas de cámaras avanzadas exactamente copiadas y cierres repetidos; patrón «girar todos una vez»; ayuda genérica ambigua del espejo; enseñanza del pisotón dependiente de un aviso fugaz; aviso de polilla tapado y superposiciones táctiles. Los casos fallidos, sus fuentes y las correcciones siguen documentados. No se afirma que cualquier cámara diferente garantice diversión.

**Reutilización actual, de alcance limitado:** runas N7 1-2/2-1 y contrapesos N8 2-2/4-1 conservan una plantilla común; varios circuitos ópticos comparten patrones locales de giros. No reproducen la cadena de cinco copias avanzadas ni una receta universal para todos los cierres. Son práctica/reutilización observables, no una nueva barrera incumplida. Si se busca más sorpresa, el criterio útil sigue siendo cambiar relaciones y políticas requeridas; añadir pulsaciones, colores o enemigos ignorables no aportaría esa mejora. No se exige otra reforma amplia como condición para declarar los mínimos actuales cumplidos.

**Límites de método y cobertura:** las búsquedas conocen objetivos y soluciones, y sus guías cambiaron para ascensores/guardianes. Costes y presupuesto uniformes no igualan pericia humana ni garantizan óptimos. Se preservan agotamientos de búsqueda y prefijos de poca energía; no se etiquetan como softlocks sin demostración. La referencia N4 speed conserva energía mínima 3,4383. Las 70 ramas locales y los reintentos no exploran todas las estrategias, posiciones o coincidencias temporales; los tests de navegador usan punteros/mando sintéticos. Rendimiento sostenido, audio y hardware físico tienen cobertura limitada.

No queda un defecto crítico reproducido conocido que impida la suficiencia técnica. Los límites anteriores deben acompañar el resultado, sin convertirse en errores inventados ni desaparecer bajo una cifra. Divertirse, aprender intuitivamente y preferir estas naves a las originales siguen siendo juicios humanos no medidos.

## Procedencia y evidencia contrastable

- **Rúbrica y registro:** `CRITERIOS.md`, `PREREGISTRO-ACTIVIDAD-RONDA2.md`, `COORDENADAS-RONDA5.md`, `COORDENADAS-RONDA6.md` y `segmentos-preregistrados-round6.json`. Fuente 7 no cambia coordenadas ni unidades.
- **Medición propia completa:** `round6-review-frozen/manifest.json`, `round6-classification/batch-24-6eae50c0d168-bounds-v1.json`, `comparacion-round6-final.json`, `semantic-windows-v2-round6/` y `PROTOCOLO-SEMANTICO-VENTANAS-V2.md`.
- **Traslado a fuente 7:** se inspeccionó el diff completo y se verificó igualdad de los ocho mapas, CFG y todo el código salvo regiones exactas de ayuda/dibujo de pausa. `compatibilidad-fuente-round7.json` declara las exclusiones. El código del comprobador final del autor se inspeccionó; `round7/candidate-replays.json` reproduce las 24 rutas en ambas fuentes y compara snapshots completos. Sus 24 hashes de entrada coinciden con las copias inmutables medidas por el revisor. No se presenta como una segunda clasificación propia de cada frame en fuente 7.
- **Recuperación propia:** `recovery-round6-verified/` y `recovery-round7-verified/`. En ambas fuentes: peso alto, espejo mixto, reloj caducado, reloj final activo y retorno de guardián; eventos de muerte/reset/retorno coinciden. Se conservan también los reintentos anteriores de familias, llaves/puertas y tres fases del jefe, con su fuente original.
- **Motor y continuidad:** `round6-rules14.json`, `round6-connected-replays-independent.json`; informes actuales contrastados `round7/rules.json`, `round7/connected-replays.json` y `round7/recovery-replays.json`. Los bordes son fixtures separados; las rutas positivas son controles legales. La continuidad propia se ejecutó sobre 6 y el informe del autor sobre 7, sin confundir procedencias.
- **Variedad y contrajuego:** `repeticion-topologica-round4.json`, `repeticion-topologica-round5.json`, `politicas-espejos-rondas56.json`, `variantes-legales-round6.json`, `variantes-legales-n6-round6.json` y `ENSENANZA-Y-ENEMIGOS.md`. Enumerar ángulos es un fixture lógico; las ramas locales posteriores reproducen prefijos desde origen sin inyección.
- **Presentación/integración:** capturas del autor inspeccionadas por el revisor, incluidas `round6/mirror-cd-legal.png`, `round6/clock-final-help-legal.png`, vistas táctiles en ambos aspectos y ambas pausas verticales de `round7/`. `round7/browser-integration.json`: 35 PASS, tres documentos con SHA exacto del candidato y `errors:[]`. Se inspeccionó cómo se calcula el hash sobre el HTML cargado antes de instrumentar DOM/storage; no son dispositivos físicos ni una sesión de navegador ejecutada personalmente por el revisor.

La inferencia previa del revisor que llamó «tutorial» a una captura parcial de A/B se retiró expresamente: no se podía deducir el circuito completo de un encuadre. La cámara derecha posterior mostró C/D. También se preserva la hipótesis refutada sobre índices de zonas. No figuran como defectos abiertos.

Las notas 7,55, 8,18 y 8,15 permanecen en sus informes originales y describen sus candidatos y evidencia disponibles entonces. Esta evaluación no las reemplaza retrospectivamente ni borra los resultados adversos que motivaron las modificaciones.
