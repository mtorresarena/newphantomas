# Segunda revisión independiente puntuada

**Nota técnica: 8,175/10, redondeada a 8,18. La barrera de sustancia sigue sin cumplirse: N6 falla el mínimo preregistrado en las tres políticas. No hay aceptación técnica global ni aprobación definitiva del usuario.**

Fecha: 2026-09-08. Se evalúa exclusivamente `harmonized-v2/index.html`, SHA256 `5ada9ce96900d5b60feb1308d0fa25119aacdb34d9ef32c4f07ba04cab261f3d`, y sus 24 testigos congelados. No se puntúan propuestas posteriores. Se conservan la primera nota 7,55, las pruebas adversas, los intentos fallidos y los criterios originales. No se han modificado pesos, fronteras, unidades o umbrales para obtener una nota determinada.

## Notas por dimensión

| Dimensión | Peso | Nota | Justificación y límite material |
|---|---:|---:|---|
| Duración activa y densidad | 20% | **7,0** | Ahora hay 24 rutas comparables completas, tres trazas distintas por nivel y un observador común de episodios con contrafactuales. N6 acredita 17 episodios y falla el mínimo en todas las políticas; N5 pierde margen en cautious. Sigue faltando la clasificación semántica completa de tránsito simple, espera obligada, opcional y repetición: contexto espacial no equivale a actividad. El aumento de minutos no compensa esos límites. |
| Variedad real de decisiones | 20% | **8,5** | Cinco familias de puzles, cierres N5–N7 con tres reglas distintas, variantes geométricas verificadas y respuestas diferentes de guardianes/polillas/vigías. Ninguna de 50 ramas simples resuelve las diez variantes ensayadas. Pisotón opcional acreditado mediante prefijo legal. Persisten plantillas reutilizadas y no se ha descartado toda estrategia dominante posible. |
| Progresión y enseñanza | 15% | **8,0** | Matriz intro→avanzada ejecutada: sello inicial seguro, alcance mayor después, transporte de retorno ascendente, orden vertical de cuatro runas, tres nodos temporizados y circuito de luz de tres espejos. Pistas específicas y errores recuperables. Las combinaciones alteran qué respuesta funciona. No hay prueba humana de comprensión; la observación de señales y recuperación no prueba por sí sola aprendizaje fluido. |
| Jefes y culminación | 15% | **9,0** | N4 conserva su mecánica de conductores; N8 tiene seis impactos, tres fases y contrajuego entre alturas. Hay recorrido completo sin daño durante el jefe, reintentos legales tras morir en cada fase y fixtures de ventana perdida, último golpe/muerte y muerte durante derrota. No se han agotado todas las coincidencias temporales y estrategias. |
| Justicia y recuperación | 15% | **8,5** | 24 rutas sin muerte, 40 fixtures de reinicio, bordes temporales −1/0/+1 y recuperación legal de cinco familias, más las tres fases del jefe. No queda un bloqueo crítico reproducido abierto. El temporizado legal había caducado antes de morir: sigue faltando un testigo de muerte con contador activo y completación posterior. La cobertura es representativa, no exhaustiva de todo punto de control. |
| Coherencia visual y legibilidad | 5% | **8,0** | Aviso de polilla y solapamientos táctiles corregidos y contrastados en ambos aspectos. Capturas reales de mecanismos, jefe y formatos muestran coherencia y jerarquía legible. La puntuación no incorpora un barrido final todavía anunciado; no se han inspeccionado personalmente todas las salas/estados/resoluciones ni hardware físico. |
| Estabilidad e integración | 10% | **8,5** | 24 testigos completos y normalización de controles con estado final idéntico; 14 casos del motor pasan también en fuente congelada; existe continuidad N4→N8→título con teclado/pausa; 17 comprobaciones de navegador aportan persistencia, DOM y entradas sintéticas. No se atribuye a esos casos un iPhone/mando físico, rendimiento sostenido, audio ni toda selección de niveles. |

Fórmula: `7×0,20 + 8,5×0,20 + 8×0,15 + 9×0,15 + 8,5×0,15 + 8×0,05 + 8,5×0,10 = 8,175`.

La mejora de 7,55 a 8,18 procede de pruebas y correcciones verificadas. No significa que toda evidencia nueva sea favorable: el déficit numérico de N6 y la fragilidad de N5 cautious se mantienen explícitos.

## Comparación completa, con las mismas unidades

Fuente: `comparacion-armonizada-final.json`, obtenida mediante `medir-congelados.cjs` y `resumir-comparacion-armonizada.cjs`. Las tres políticas producen trazas distintas en **cada** nivel, incluso fusionando comandos idénticos adyacentes; no son tres repeticiones del mismo testigo ni tres jugadores humanos.

A: llave/puerta; B: prueba completa; C: obstáculo independiente; D: encuentro con respuesta acreditada; E: progreso de jefe. Los nodos repetidos, saltos vacíos, reintentos y enemigos interiores a una misma prueba no inflan la suma. Los contrafactuales corren en otra instancia del motor y no completan los recorridos legales.

| Nivel | balanced | cautious | speed |
|---|---:|---:|---:|
| N1 | 15–16 | 15–16 | 15–16 |
| N2 | 25 | 25 | 21–22 |
| N3 | 22–24 | 23–25 | 23–24 |
| N4 | 33 | 33 | 34 |
| **Mediana N1–N4** | **23,5–24,5** | **24–25** | **22–23** |
| N5 | **21** | **19** | **21** |
| N6 | **17** | **17** | **17** |
| N7 | **29** | **29** | **29** |
| N8 | **31** | **31** | **29** |

Los intervalos incluyen candidatos entrados pero no terminados antes de `clear` y contrafactuales inconcluyentes. Se conservan, por ejemplo, los obstáculos finales originales cuyo borde derecho queda después del disparo de la salida; no se mueve su frontera para favorecer al bloque nuevo. Se compara la cota inferior nueva contra la cota superior de la referencia para declarar cumplimiento inequívoco. Si incluso la cota superior nueva está por debajo del mínimo referido a la cota inferior original, el incumplimiento es concluyente dentro de esta métrica.

| Nivel / mínimo | balanced | cautious | speed |
|---|---|---|---|
| N5 /80% | 85,7–89,4%: cumple | **76,0–79,2%: falla en esta política** | 91,3–95,5%: cumple |
| N6 /80% | **69,4–72,3%: falla** | **68,0–70,8%: falla** | **73,9–77,3%: falla** |
| N7 /80% | 118,4–123,4%: cumple | 116,0–120,8%: cumple | 126,1–131,8%: cumple |
| N8 /100% | 126,5–131,9%: cumple | 124,0–129,2%: cumple | 126,1–131,8%: cumple |

**N6 es el motivo concluyente de fallo de la barrera 3**, sin depender de exigir éxito en todas las políticas: no cumple en ninguna. N5 sí dispone de rutas comparables que cumplen, pero el resultado no es robusto a la política cautelosa. No se transforma ese único fallo de N5 en una afirmación de que ninguna ruta suya cumple.

N6 concentra su vector en B10/C5/D2 bajo las tres políticas. Los elevadores, ácido, frágiles y temporizadores intervienen realmente; el conteo reconoce cinco episodios de tránsito y dos encuentros independientes, además de sus diez pruebas. La métrica cuenta episodios completos y absorbe su complejidad interna: no afirma que un elevador y una cerradura tengan idéntica dificultad humana. La conclusión se limita a la barrera operacional aceptada previamente.

Los recorridos nuevos duran aproximadamente 193–194s (N5), 171–172s (N6), 142–143s (N7) y 216 s (N8). **Son tiempos de simulación de estas políticas, no duración activa humana ni demostración de diversión.** `semanticActiveFrames` permanece null. Por ejemplo, N6 balanced registra 4302 frames dentro de puzles sin resolver, 1682 en regiones de tránsito, 872 en encuentros y 3300 de otro movimiento; esas etiquetas son contexto, no una clasificación semántica automática de cada frame.

La ruta speed de N4 se conserva íntegra: 6807 frames, energía mínima **3,438** y dos golpes. Su margen reducido es una observación adversa del controlador, no un daño obligatorio demostrado. Los intentos anteriores agotados o incompletos tampoco se borran; no se confunden con niveles imposibles.

## Barreras y mínimos

| Barrera | Estado | Fundamento |
|---|---|---|
| 1. Alcance | Cumple | Exactamente jefes N4/N8; cierres propios de puzle N5–N7. |
| 2. Completabilidad | Cumple | 24 rutas completas legales, sin muerte; continuidad ya demostrada con testigos score1 cuyo motor es idéntico al evaluado. Los fixtures no sustituyen esas rutas. |
| 3. Sustancia | **Falla** | N6 no alcanza 80% en ninguna política. N5 cumple con dos y falla con una. Hay varias fases y dependencias, pero los segundos/anchura no sustituyen el mínimo. |
| 4. Variedad | Cumple en el alcance probado | Familias obligatorias distintas, tres cierres diferentes y respuestas enemigas verificadas.50ramas simples no resuelven los casos elegidos. |
| 5. Jefe N8 | Cumple | Distinto de N4, fases reales, señales, respuesta viable y seis impactos/derrota/salida. |
| 6. Justicia | Cumple en el alcance probado | Recuperaciones representativas y bordes coherentes, sin bloqueo crítico reproducido abierto. Permanecen límites de cobertura expresos. |
| 7. Integridad | Cumple en el alcance probado | N1–N4 funcionales, transiciones y final verificados; evidencia adicional de DOM/persistencia/entradas. |

Mínimos numéricos internos: media≥8 **sí**; ninguna dimensión<6 **sí**; justicia/estabilidad≥8 **sí**. Todas las barreras demostradas **no**, por sustancia. Por tanto, **no se declara suficiencia técnica global**. La aceptación definitiva corresponde al usuario y la experiencia humana no está medida.

## Correcciones y cobertura incorporadas

- Los defectos anteriores de umbral temporizado y posición canónica del jefe tienen revalidaciones específicas conservadas.
- P2 del aviso de polilla alta: antes/después inspeccionados, signo íntegro debajo del cuerpo en ambos aspectos. Solapamiento del prompt y controles/HUD: corregido en las vistas táctiles verificadas. No siguen figurando como fallos abiertos del candidato 5ada….
- Recuperaciones legales: sellos 14660 frames, runas 23041, temporizado 20768 —con caducidad anterior a muerte—, espejos 19731 y contrapeso 22295. En el contrapeso, se conserva carry 2-1 al morir, se limpia al reaparecer y se completa esa misma prueba y el nivel. Todos terminan con dos vidas.
- Jefe: muerte en fases 1/2/3, reaparición, seis impactos posteriores y salida. Incluye muerte durante apertura de fase 2. Los testigos íntegros son 16033/15562/15953 frames.
- 14 fixtures del motor, inspeccionados y ejecutados, incluyen ventana perdida, proyectil letal simultáneo con último pisotón y muerte durante derrota. Son montajes de estado: no se presentan como rutas naturales.
- 17 PASS de `browser-integration.json`: se inspeccionó el comprobador `tools/browser-integration.html`. Usa documento nuevo y almacenamiento real con prefijo aislado; fija el desbloqueo mediante carga de nivel y prueba continuación, eventos DOM sintéticos y mando simulado. No se ejecutó personalmente esa sesión de navegador por el revisor, ni se atribuyen los resultados a hardware real.

No se concede crédito anticipado al nuevo barrido visual ni a la nueva secuencia continua que el autor anuncia estar preparando. La continuidad acreditada aquí es la ya reproducida por `score1-connected-replays`, junto con el cotejo de igualdad del motor. Los 24 replays nuevos se han comprobado individualmente y con normalización, no se describen como 24 campañas corridas de principio a fin.

## Objeciones restantes y cierres verificables

1. **Déficit de sustancia operacional de N6 — impedimento de aceptación del candidato.** Hace falta una sección obligatoria con respuesta/recorrido/tiempo propio que cambie la actividad real, no aumentar pulsaciones de B, número de objetos opcionales o metros de pasillo. Cierre: nuevo candidato identificado, prerregistro de lo añadido antes de medirlo, rutas comparables y contrafactuales que acrediten los episodios conforme a las mismas reglas. Si conserva los déficits, se mantendrá el fallo.
2. **N5 cautious pierde el mínimo — robustez insuficiente, no fallo universal del nivel.** Revisar dónde una política eficaz elimina la intervención de encuentros dejando el volumen en 19. Cierre: observar respuesta obligatoria independiente sin convertir enemigos opcionales en una lista artificial de tareas. Comparar todas las políticas sin seleccionar solo la favorable.
3. **Actividad semántica pendiente — limita duración/densidad.** Etiquetar con justificación tránsito simple, espera necesaria, acción obligatoria, opcional y repetición, mostrando cobertura y ambigüedades. Permanecer dentro de una cámara o moverse durante una recarga no acredita automáticamente actividad. No se eleva esta dimensión a 8 por tener 24 archivos o más segundos.
4. **Temporizador activo durante muerte — carencia de prueba concreta.** El testigo legal disponible muere después de caducar. Falta una rama que muera con progreso/plazo todavía vigente y vuelva a resolver. Los fixtures sí comprueban reset; no se inventa un bloqueo por faltar ese testigo.
5. **Cobertura final de presentación/entrada — límite de excelencia.** Completar e inspeccionar vistas de estados de error/recuperación y ambos aspectos/resoluciones; verificar entradas en dispositivos físicos si se pretende prometer compatibilidad de hardware. Los P2 concretos ya cerrados no se reabren por esta carencia general.
6. **Reutilización de plantillas y enseñanza — límite cualitativo persistente.** Las variantes verificadas son reales, pero cinco familias se repiten. Se debe conservar el mapa de qué respuesta cambia entre instancias; no llamar familia nueva a añadir un nodo. El aprendizaje y la monotonía percibidos requieren evidencia humana, que no está disponible y no se simula con una nota.

Documentos de detalle: `PREREGISTRO-ACTIVIDAD-RONDA2.md`, `MEDICION-ARMONIZADA-LOTE1.md`, `ENSENANZA-Y-ENEMIGOS.md`, `RECUPERACION-PUZLES-Y-BORDES.md` y `CIERRES-CONTRAPESO-Y-AVISOS.md`. Las propuestas de una tercera revisión quedan fuera de esta nota y deben preservar esta fuente y sus resultados.
