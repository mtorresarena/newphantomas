# Revisión final independiente: fuente 12

**Nota técnica: 9,38/10 (suma ponderada sin redondear: 9,375). Las siete barreras y los mínimos internos se cumplen en el alcance verificado. No alcanza el objetivo de 9,5 solicitado por el usuario y no constituye aceptación ni autorización de publicación.**

Fuente: `round12/index.html`, SHA256 `8c3e43a36a29dde8b30a56ad8a5112a0bdb1ccb93b0579b753f54de094362d45`. Fecha: 2026-09-08. Se mantiene íntegra la rúbrica previa de `CRITERIOS.md`: mismos pesos, escala, barreras y unidades A–E. Las notas anteriores, incluida 8,80, y todas las pruebas adversas permanecen archivadas. Esta nota juzga el candidato implementado y verificado, no el trabajo anunciado.

## Puntuación

| Dimensión | Peso | Nota | Justificación del candidato actual |
|---|---:|---:|---|
| Duración activa y densidad | 20% | **9,0** | Las 24 rutas conservan sustancia comparable y superan los mínimos. N6 incorpora transporte reutilizado y modificación física del recorrido; la mayor ejecución observada se vincula con esas relaciones, no con esperar un reloj mayor. El diseño global aún alterna principalmente cámaras autónomas y tránsito; las conexiones nuevas se concentran en tres cámaras. El margen menor de N6 y el tránsito conservado no son por sí mismos defectos ni demuestran aburrimiento. Valoro la estructura como muy buena, sin equiparar estos refuerzos locales a una transformación excepcional de toda la campaña. |
| Variedad real de decisiones | 20% | **9,5** | Las variantes anteriores se conservan y aparecen relaciones distintas: prestar y recuperar un objeto que mantiene un acceso; modificar apoyos durante un recorrido cronometrado; almacenar el efecto de un receptor y redirigir el mismo haz. El prisma ya no se resuelve con el atajo de suelo demostrado en la fuente anterior. No se suman familias ni unidades por cada paso serial. La alternativa local del segundo pulsador se admite sin borrar la conexión posterior. |
| Progresión y enseñanza | 15% | **9,5** | Las mecánicas conocidas desembocan en usos conectados con consecuencias reversibles. La ayuda ofrece observación, pista y solución mediante peticiones explícitas; conserva el nivel consultado, no consume tiempo/energía ni revela automáticamente la solución al mantener H. El peso y la luz explican qué efecto permanece y qué se recupera. Esto mejora enseñanza y graduación de información de forma técnica comprobable; no se atribuye aprendizaje humano medido. |
| Jefes y culminación | 15% | **9,5** | Se mantienen exactamente N4 y N8, con victorias mecánicamente distintas. N8 conserva sus tres fases y contrajuego, y distingue apertura, impacto y transición con feedback adicional. Un replay propio compara, frame por frame, todo el estado del jugador y del jefe entre 9 y 12, excluyendo solo el destello nuevo: idénticos durante 12491 frames, seis impactos válidos y meta. La captura de impacto permite reconocer el cambio. No se concede crédito por alterar HP, ventanas o dificultad: no cambian. |
| Justicia y recuperación | 15% | **9,5** | Cinco recorridos nuevos de retirada, caducidad, interrupción y muerte se completan desde origen; los fixtures independientes cubren el resto de estados parciales de las conexiones. Retirar el peso prematuramente es reversible, R conserva energía al interrumpir la luz y caducar sobre apoyos conduce a suelo seguro. El contador que los mensajes ocultaban ya permanece visible durante toda la ventana ensayada. Se conserva la cobertura previa de familias, inventario y reintentos del jefe. No queda un bloqueo o recurso irrecuperable reproducido abierto. |
| Coherencia visual y legibilidad | 5% | **9,0** | Se conservan los cierres visuales anteriores y se inspeccionan los fotogramas nuevos de apoyos, peso, prisma, impacto y reloj con mensaje. Las relaciones, letras, jugador y contador son legibles en esas vistas. La nueva ayuda HTML se comprueba funcionalmente por DOM; se contrastaron sus límites a 390×844 y 480×320, sin desbordamiento en la solución mostrada y con botones de aproximadamente 44px dentro del panel. Tiene menos evidencia visual directa que los lienzos; sus exportaciones no se presentan como capturas completas del navegador. Es una limitación finita de representación, separada de defectos reales conocidos. |
| Estabilidad e integración | 10% | **9,5** | 24 replays propios normalizados en 11; delta 12 limitado exactamente a HUD y selector de reloj; mismos 24 hashes y revalidación final en 12; cinco recuperaciones propias en 11 y actuales en 12; 18 bordes generales, cinco grupos adversariales nuevos, continuidad N4→N8→título y 47 comprobaciones DOM con SHA de tres documentos. Sin errores relevantes detectados. Las pruebas se acumulan alrededor de riesgos y cambios concretos, sin llamar independientes a repeticiones deterministas. |

Fórmula: `9×0,20 + 9,5×0,20 + 9,5×0,15 + 9,5×0,15 + 9,5×0,15 + 9×0,05 + 9,5×0,10 = 9,375`.

Las diferencias entre 9 y 9,5 interpolan la escala editorial técnica de la rúbrica, no una magnitud física ni una probabilidad. La ausencia de pruebas humanas no impone un techo numérico. Tampoco se elevan las dimensiones para que la suma alcance un objetivo externo. La mejora respecto a 8,80 corresponde a conexiones implementadas, enseñanza graduada, feedback y recuperación contrastados; no al mero número de tests.

## Barreras y comparación

| Barrera | Resultado |
|---|---|
| Alcance | **Cumple:** solo jefes N4/N8; cierres N5–N7 de reglas distintas. |
| Completabilidad | **Cumple:** controles legales desde origen y secuencia completa hasta título. |
| Sustancia | **Cumple:** fases de introducción, variación y culminación; mecánicas centrales necesarias; mínimos A–E superados. |
| Variedad | **Cumple:** familias obligatorias distintas, respuestas enemigas contrastadas y conexiones físicas reales. |
| Jefe N8 | **Cumple:** tres fases, anticipación, contrajuego, seis impactos y victoria distinta de N4. |
| Justicia | **Cumple en lo ensayado:** fallos y muertes parciales recuperables, sin bloqueo crítico reproducido abierto. |
| Integridad | **Cumple:** N1–N4 funcionales, pausa/persistencia/continuidad y final correctos en las pruebas descritas. |

Media ≥8, ninguna dimensión <6 y justicia/estabilidad ≥8: sí. Estos son los mínimos internos previos, no la aceptación del usuario ni su objetivo superior de 9,5.

| Episodios A–E | balanced | cautious | speed |
|---|---:|---:|---:|
| Mediana N1–N4, intervalo conservador | 23,5–24,5 | 24–25 | 22–23 |
| N5 | 25 | 24 | 24 |
| N6 | 20 | 20 | 20 |
| N7 | 29 | 31 | 30 |
| N8 | 32 | 33 | 29 |

N5–N7 requieren 80% de la referencia; N8, 100%. Las tres políticas superan incluso el extremo conservador correspondiente. N6 da A4+B10+C6+D0: las trayectorias nuevas evitan acreditar una respuesta independiente D. No se han convertido anclajes, receptores, pulsaciones o plataformas en episodios extra para elevar el total. El diseño puede mejorar aunque ese total baje de 21 a 20 en dos políticas.

Se conservan los mismos clasificadores operacional y de ventanas V2, cambiando solo archivos de entrada/salida. N6 registra 198,77–200,58s, ejecución 130,40–131,87s, tránsito simple 37,08–37,42s y espera 4,63–6,33s. N7 registra 159,40–159,73s, ejecución 89,08–90,37s, tránsito 39,93–40,45s y espera 3,18s. N5/N8 mantienen los resultados anteriores. Los rangos pertenecen a rutas distintas y no deben sumarse para inventar otra ruta.

Las ventanas B cubren el transporte y recorrido, pero el observador antiguo no nombra todos los hitos nuevos de anclaje/receptor. Su anotación auxiliar de recuperación del peso aún apunta a la base original; por eso no se usa el alejamiento del próximo hito como evaluación de eficiencia de estas conexiones. Se conserva el tiempo no atribuido y el sesgo de mayor observabilidad de los puzles frente a los originales. Tránsito simple no equivale a vacío, y estas duraciones no son minutos humanos.

Los presupuestos declarados son 20000 y 8000; solo N7 usa 8000 y sus máximos de expansión registrados son 1959/1939/1851. Elevar ese techo no alteraría una búsqueda ya exitosa con idéntica secuencia de expansión. No se afirma que todo se haya buscado de nuevo con presupuesto idéntico: hay rutas reutilizadas y revalidadas, guías geométricas y soluciones conocidas. Eso limita inferencias de habilidad/eficiencia, no invalida automáticamente los episodios observados. La energía mínima adversa de N4 speed permanece en el conjunto.

## Cierres adversariales de esta iteración

1. **Atajo físico del prisma, cerrado en el contraste ensayado.** La fuente 10 admitía un recorrido completo desde origen con cero apoyos nuevos. La reproducción literal en 11 no activa E ni resuelve; la ruta normal nueva usa la pasarela. Una búsqueda de 5000 expansiones que rechaza apoyarse en ella no encuentra solución. Se conserva explícitamente el límite local de esa búsqueda, sin convertirla en prueba universal de imposibilidad.
2. **Contador oculto por mensajes, cerrado.** En 11 se ocultaba 357 de 504 frames activos de la ruta normal. En 12, un observador propio del dibujo registra contador durante los 661 frames de una ventana completa desde activación hasta el instante límite, incluso con aviso y en 3/2/1/0 segundos. La exportación real `n6-clock-visible-with-message.png` muestra mensaje y contador separados. El cambio es solo de HUD; no altera el plazo.
3. **Segundo pulsador desde suelo, alternativa conservada.** Se activa legalmente en f10254, sin tocar los apoyos de la primera etapa. No se afirma que todos los apoyos sean obligatorios; la conexión posterior para alcanzar 3 sigue siendo material. No es un bloqueo ni un defecto pendiente por sí mismo, y no se propone prohibirla para mejorar conteos.
4. **Estados conectados recuperables.** Retirada antes/después del anclaje, devolución a base, interrupción de luz, caducidad y muerte parcial mantienen un camino de resolución. Los casos preparados artificialmente siguen etiquetados como fixtures y no sustituyen las cinco rutas legales completas.

## Reservas y trabajo que tendría sentido

**No queda un defecto técnico crítico reproducido abierto ni un arreglo obligatorio conocido oculto detrás de esta nota.** La reserva de densidad es una valoración material de estructura: las conexiones enriquecen tres cámaras, mientras buena parte de N5/N8 y de los tramos intermedios conserva la alternancia de puzle autónomo y traslado. Los tiempos de tránsito no bastan para ordenar recortes; contienen recuperación, recursos y separación entre retos. Más profundidad distribuida requeriría una decisión de diseño sobre esas relaciones, con nuevos contrafactuales, no añadir nodos, enemigos ignorables o segundos.

La reserva visual tiene una cobertura finita pendiente: capturas completas de la ayuda HTML en ambas orientaciones y ambos aspectos, con sus tres niveles y controles, complementarían sus pruebas DOM. Eso puede revelar problemas de composición que las dimensiones no detectan; no se promete una subida automática de nota por obtener imágenes. No hay razón para repetir indiscriminadamente las 24 rutas o multiplicar tests idénticos después de un cambio exclusivamente de dibujo.

Los límites humanos y de no exhaustividad van aparte: no se midieron diversión, descubrimiento ni fatiga con personas; no se probó toda estrategia ni coincidencia temporal; punteros y mando son sintéticos; audio no se oyó y rendimiento/hardware físico no tienen cobertura completa. No son errores inventados, vetos nuevos ni una receta imposible para subir la nota. La evidencia actual permite una valoración técnica muy alta; no obliga a redondearla hacia 9,5.

## Procedencia verificable

- `CONTRASTE-INDEPENDIENTE-CONEXIONES-11.md`: relaciones, atajo anterior y sus límites, alternativa del reloj, pruebas nuevas y medición.
- `round11-review-frozen/`, `segmentos-conectados-b9f1a7b93ca1.json`, `round11-classification/batch-24.json`, `semantic-windows-v2-round11/`: 24 entradas congeladas, registro previo, clasificación y normalización propias.
- `compatibilidad-contador-round12.json`: igualdad de todos los bytes ajenos a HUD/selector de reloj, igualdad de los 24 hashes y prueba legal del contador hasta caducidad. Esta compatibilidad traslada la clasificación de 11 a 12 sin fingir una segunda clasificación frame a frame.
- `recovery-round11-independent/`: cinco replays propios. En el candidato final, `round12/connected-recovery.json` revalida cinco, con dos muertes reales. Se conservan aparte los cinco grupos unitarios de `estados-conectados-b9f1a7b93ca1.json` y las recuperaciones anteriores.
- `jefe-feedback-9-12.json`: igualdad de física del jugador y del jefe cada frame; seis impactos con destello y tres fases. Esta política registra **un inicio de daño durante la arena en ambas versiones**, no cero. La primera comprobación propia asumió erróneamente cero; falló esa expectativa y se corrigió, preservando el script inicial. No se oculta el daño ni se presenta como regresión.
- `round12/verified-set.json`: 24 replays del autor, contrastados con los hashes propios. `rules.json`: 18 bordes. `browser-integration.json`: 47 PASS, tres SHA del documento cargado y `errors:[]`. `connected-replays.json`: secuencia final y repeticiones deterministas. El informe hint-dom-metrics.json añade dos orientaciones, ausencia de desbordamiento en la solución mostrada y activación por Enter/Space conservando pausa. Estos resultados del autor se identifican como tales, junto a la evidencia independiente.
- Fotogramas inspeccionados: `round11/n7-powered-prism-world-final.png`, `n6-reused-weight-world.png`, `n6-clock-changing-path-world.png`, `n8-hit-feedback-world.png` y `round12/n6-clock-visible-with-message.png`. Son lienzos compuestos realmente renderizados; no capturas de controles HTML.

La decisión del usuario queda pendiente. No se ha editado producción, aceptado el candidato en su nombre ni publicado desde esta revisión.
