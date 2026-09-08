# Rúbrica previa: segunda campaña de Phantomas

Fijada el 2026-09-07 antes de leer código, assets o informes anteriores. Base declarada: `31d4610`. Este documento define la evaluación futura; no contiene calificaciones del juego.

## Alcance y cambio de requisito

La segunda campaña comprende N5–N8. Corrección explícita del usuario recibida antes de inspeccionar código: **solo dos jefes en el juego completo**, el existente al final de N4 y uno nuevo y distinto al final de N8. N5, N6 y N7 deben terminar con puzles o desafíos propios, sin jefes. Sustituye el encargo inicial de cuatro jefes; es un cambio de requisito, no una rebaja motivada por resultados. N1–N4 constituyen la referencia comparativa y deben conservarse funcionales.

No hay pruebas humanas disponibles. La evaluación distingue siempre: inspección estática, ejecución automatizada, recorrido sintético y experiencia humana no medida. Ninguna suma de casillas, longitud del mapa, cronómetro en reposo ni informe del autor demuestra diversión, duración activa humana o dificultad justa.

## Puntuación, fijada previamente

Cada dimensión recibe 0–10. Nota global = suma(nota × peso)/100. Escala común: 0 ausente/roto; 2 testimonial; 4 insuficiente o repetitivo; 6 funcional pero desigual; 8 sólido y verificado en el alcance declarado; 10 excepcional, con evidencia comparativa amplia. Los intermedios interpolan. Se registran evidencias contrarias, límites y tamaño de muestra; no se aprueban promesas.

| Dimensión | Peso | Evidencia exigida para 8/10 |
|---|---:|---|
| Duración activa y densidad | 20% | Rutas obligatorias sustanciales, varias fases de acción/decisión y recuperación razonable en cada nivel. Comparación homogénea N1–N4/N5–N8 que separa desplazamiento vacío, espera, acción obligatoria, exploración opcional y repetición por muerte. |
| Variedad real de decisiones | 20% | N5–N7 tienen cierres con tres reglas de resolución diferentes; cada nivel nuevo combina al menos dos familias de decisiones obligatorias, y la campaña presenta al menos tres comportamientos enemigos que exigen respuestas diferentes. |
| Progresión y enseñanza | 15% | Cada mecánica obligatoria nueva se presenta en una situación recuperable, luego se complica y finalmente se combina. La dificultad crece por decisiones, no solamente por vida, velocidad, cantidad o precisión extrema. |
| Jefes y culminación | 15% | N4 conserva su jefe. N8 tiene un único jefe nuevo con un ciclo de combate y forma de ganar distintos de N4, ataques anunciados, contrajuego y fases funcionales. N5–N7 no contienen jefes encubiertos. |
| Justicia y recuperación | 15% | Daños evitables, amenazas legibles, recursos suficientes y ausencia de bloqueos permanentes. Morir, fallar, reiniciar o cargar no rompe la resolución. Se controla cuánto progreso obligatorio se pierde. |
| Coherencia visual y legibilidad | 5% | Imágenes reales de momentos representativos muestran jerarquía clara de peligros, objetos y objetivos; el estado del puzle/jefe se entiende sin abrir código. Se preserva el lenguaje visual del juego y la legibilidad en resoluciones admitidas. |
| Estabilidad e integración | 10% | Arranque, selección, transiciones, guardado/carga, muertes, reinicios y final se prueban; sin errores de ejecución relevantes ni regresiones detectadas en N1–N4. |

Familias de decisiones: por ejemplo, elegir orden/estado, interpretar señales, posicionarse o moverse según un patrón, coordinar tiempos, administrar recursos, decidir riesgo/ruta. Cambiar color, texto, ubicación o número de interruptores no crea una familia nueva. Un enemigo diferente necesita una política de respuesta distinta; estadísticas o sprite distintos no bastan.

## Barreras de aceptación

La nota no compensa estas barreras. Se informa `cumple`, `falla` o `no demostrado` por separado.

1. **Alcance:** exactamente los jefes N4 y N8; ningún jefe en N5–N7, y tres cierres propios jugables. Un enemigo obligatorio con arena cerrada, barra de vida, fases y condición de victoria de combate cuenta como jefe aunque el código lo llame desafío.
2. **Completabilidad:** N5–N8 se completan en secuencia siguiendo controles y reglas de producción, sin teleport, invulnerabilidad, asignación directa de estado, eliminación artificial de enemigos o recursos regalados. Los montajes de estado sirven para pruebas unitarias de bordes, no para probar completabilidad.
3. **Sustancia:** cada nivel requiere al menos tres fases obligatorias distinguibles, no tres copias de la misma tarea; ninguno permite llegar al cierre saltándose su mecánica central. Una ruta obligatoria automatizada comparable de N5–N7 debe alcanzar al menos el 80% de la mediana de N1–N4 en acciones significativas; N8, al menos el 100%. Si no puede obtenerse una referencia homogénea, esta comparación queda **no demostrada**, sin sustituirla por extensión del mapa.
4. **Variedad:** tres cierres N5–N7 con reglas diferentes y al menos tres comportamientos enemigos nuevos o combinaciones de respuesta realmente distintas en N5–N8; al menos dos familias de decisiones obligatorias por nivel. Enumerar tipos en código no prueba uso real ni obligatoriedad.
5. **Jefe N8:** al menos dos fases con políticas de respuesta diferentes; ataques con anticipación y respuesta viable; daño/victoria coherentes; distinción mecánica verificable frente a N4. Una segunda barra de vida, cambio de color o aceleración del mismo ciclo no cumple.
6. **Justicia:** ningún bloqueo permanente, daño inevitable que impida completar desde un estado alcanzable razonable, consumo irrecuperable de un recurso obligatorio o reinicio incoherente. No se acepta muerte obligatoria para aprender una regla sin señal previa.
7. **Integridad:** sin errores críticos de ejecución, N1–N4 accesibles y funcionales, y continuación N4→N5 y N8→final correctas. Fallar un caso crítico impide aceptar la campaña aunque la media numérica sea alta.

Umbral interno de suficiencia técnica: todas las barreras demostradas, nota ponderada ≥8, ninguna dimensión <6, y estabilidad/justicia ≥8. Se informa el cumplimiento de estos mínimos; **no constituye aprobación definitiva**, que corresponde al usuario. La aceptación de experiencia humana queda pendiente y debe declararse expresamente; no se infiere de bots ni de la nota técnica. Para notas técnicas altas faltaría, si no se ejecuta, cobertura de recorridos legales comparables, fallos y recuperación, fases reales del jefe, transiciones y capturas en las resoluciones admitidas; una lectura estática por sí sola no permite darlas por verificadas.

## Protocolo concreto de comprobación

### Inventario y rutas

- Registrar commit exacto, archivos pertinentes, configuración, versión y controles de prueba.
- Construir una tabla por nivel con inicio, salida, objetivos, dependencias, tramos obligatorios, opcionales, enemigos realmente instanciados, mecánicas y recuperación.
- Trazar una ruta legal y buscar atajos que permitan ignorar puzles, enemigos o fases. Revisar colisiones y puertas reales, no solo narración.
- Dibujar el grafo de dependencias de los objetivos N5–N8: identificar estados sin salida, llaves consumidas, compuertas irreversibles y mecanismos reiniciables.

### Duración activa

- Medir al menos tres recorridos sintéticos por nivel con igual política/controlador, si es viable. Registrar semillas y entradas reproducibles; primer aprendizaje y repetición optimizada se reportan por separado.
- Registrar tiempo de simulación y de pared, movimiento vacío, espera forzada, interacciones con efecto, decisiones distintas, combates, retroceso y repetición tras muerte. Una interacción repetida sin alternativa no cuenta como decisión nueva.
- Comparar medianas y rangos de N1–N4/N5–N8; describir cualquier sesgo del controlador. El tiempo sintético solo describe ese controlador; no traducirlo a minutos humanos.
- Si solo hay análisis estático, informar longitud mínima/acciones y explicar que no verifican duración ni sensación de monotonía. No inventar minutos objetivo o completados.

### Puzles, progresión y enemigos

- Ejecutar cada solución correcta; un orden incorrecto; una interacción repetida; salida y retorno; fallo parcial; muerte; reinicio; guardado/carga cuando exista.
- Comprobar que las pistas necesarias aparecen antes de exigir la solución y que el feedback identifica qué cambió. Capturar el antes/después de cada mecanismo.
- Para cada enemigo, documentar estímulo→ataque→respuesta viable. Probar al menos acercarse, esperar, esquivar y atacar. Verificar alcance real, colisión y supervivencia, y demostrar dónde su comportamiento cambia una decisión del recorrido.
- Mapear introducción→práctica→combinación por mecánica; marcar ausencias y saltos de dificultad. Las secuencias impuestas por un bot no equivalen a aprendizaje humano.

### Jefes

- Comparar N4/N8: acceso, condición de daño, patrón, señal, contrajuego, fases, condición de victoria y salida.
- Ejecutar un ciclo completo de cada fase, fallar una ventana, recibir daño, morir y reintentar. Comprobar transiciones simultáneas (último golpe/muerte del jugador, pausa/reinicio, salida si se permite).
- Buscar estrategias dominantes triviales: quedarse quieto, mantener ataque, refugio permanente o golpear fuera de arena. Un patrón decorativo que no cambia la estrategia no demuestra variedad.

### Justicia, visuales y estabilidad

- Probar daño y recuperación cerca de bordes, plataformas, puertas, puntos de reaparición y objetos obligatorios. Verificar que los estados tras muerte/reinicio son coherentes con objetivos, inventario, recursos y enemigos.
- Capturar entrada, presentación de una mecánica, combate, fallo recuperable y cierre de N5–N8; cada fase de N8; al menos una referencia N1–N4. Revisar HUD, solapamientos, contraste, límites de cámara y señales dentro del encuadre en las resoluciones admitidas.
- Arranque limpio, selección por todos los niveles disponibles, recorrido N4→N5, N5→N6→N7→N8→final, pausa/reanudar, muerte/reinicio y persistencia si existe; revisar consola y fallos de recursos.
- Mantener registro de casos: preparación, acciones, resultado esperado, resultado observado, evidencia y alcance. Separar claramente pruebas unitarias/estados fabricados de recorridos válidos.

## Entrega posterior

La revisión futura incluirá nota por dimensión, fórmula, estado de cada barrera, defectos ordenados por gravedad y referencias exactas. Un resultado sin ejecución se etiqueta como inspección, no como prueba superada. Si faltan recorridos comparables, capturas o cobertura de estados, quedará escrito como límite material. No se asigna nota en esta fase inicial.
