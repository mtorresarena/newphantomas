# Contraste independiente de diseño — candidato congelado round4

Fecha: 2026-09-08. Fuente exclusiva de juego: `round4/index.html`, SHA-256 `8eef8b28ed89122e03c5eb04ebed91d5923fe87b51b6b12dd6f999699e35c65b`. Rúbrica leída antes de formar el juicio: `CRITERIOS.md`. No se leyeron informes puntuados ni notas de otros revisores. Los cambios anunciados para un candidato posterior no reciben crédito aquí.

**Conclusión:** la campaña ya tiene una extensión obligatoria considerable y no se sostiene principalmente sobre espera. Sí conserva un problema de repetición de puzles: N6 y, especialmente, N7 reutilizan la misma solución y disposición relativa hasta el cierre. Las diez pruebas por nivel no equivalen a diez decisiones diferentes. Los dos jefes son funcionales en los recorridos y mecánicamente distintos; el jefe N8 ofrece cambios de respuesta reales.

## Alcance y evidencia propia

- Inspección del código congelado y de las definiciones de sus 40 pruebas, peligros, enemigos y jefes.
- Reproducción propia de las 24 rutas del manifiesto: ocho niveles por tres políticas (`balanced`, `cautious`, `speed`), mediante movimiento, salto y Abajo en el bucle del juego.
- Preparación por `newGame`, selección del nivel y `startLevel`; ningún teleport dentro del nivel, modificación de energía, invulnerabilidad, eliminación de enemigos o restauración de snapshots en estos recorridos. Todos acabaron en `clear`; todas las rutas de N5–N8 resolvieron sus diez pruebas y todas las rutas N8 derrotaron al jefe. Cero muertes en las 24 rutas.
- Programa reproducible: `contraste-diseno-probe.cjs`. Datos propios: `contraste-diseno-evidencia.json`. Ejecución: `node review/campaign-v3/contraste-diseno-probe.cjs`, desde la raíz del proyecto. El archivo contiene el hash efectivo del código ejecutado.
- Se utilizó el arnés existente `route-harness-round4-hints.cjs`, cuyo snapshot/restore no se invoca en mi programa. Node 22.19.0; VM sin DOM real, renderizado ni audio. No se instaló ninguna dependencia.
- Se inspeccionaron las rutas como datos de entrada, no como juicios del autor. Sus metadatos internos de hash reflejan una fuente anterior; la afirmación de completabilidad aquí procede de ejecutarlas contra el hash congelado indicado, no de confiar en esos metadatos.

No hay participantes humanos, móviles físicos ni estimación de minutos humanos. Son tres políticas de un controlador relacionado, no tres jugadores ni tres primeros aprendizajes. No probé aquí muerte/reinicio/carga, transiciones entre niveles, fallos de ventanas de jefe ni regresiones visuales. Esas dimensiones no reciben una nota por extrapolación.

## Hallazgos accionables

### P1 de diseño: N7 agota su evolución antes de la mitad y copia el cierre

Las pruebas `2-2`, `3-1`, `4-2`, `5-1` y `5-2` tienen la misma geometría relativa de nodos y las mismas orientaciones iniciales: fuente inferior → A hacia arriba → B hacia la derecha → C hacia abajo → receptor. Solo cambia el desplazamiento horizontal. El primer ejercicio `1-1` presenta dos espejos; `2-2` añade C. Después se repite esa segunda plantilla cinco veces, incluyendo dos consecutivas en la última parte.

La repetición es observable en ejecución, no solo en JSON: en la ruta balanced, los cinco se resuelven girando **A, B y C una vez cada uno**, sin nueva regla. Tiempo desde girar A hasta resolución: 280, 280, 250, 280 y 280 frames. El cierre `5-2` repite incluso los intervalos A→B→C de `2-2`, `3-1` y `5-1`. No se necesita reinterpretar un trayecto óptico nuevo.

**Mejora:** conservar la introducción y una práctica; cambiar la dirección inicial del haz, la posición relativa del receptor, la topología o la necesidad de volver a un espejo en los ejercicios tardíos. El cierre debe exigir una lectura espacial nueva. Añadir otro espejo solo en línea prolongaría la misma solución; importa la relación entre sus estados y el camino hacia R.

### P1 de diseño: N6 repite el mismo examen temporizado cinco veces

`2-2`, `3-1`, `4-2`, `5-1` y `5-2` tienen idénticos tres pulsadores respecto a su puerta: el primero abajo, el segundo elevado, el tercero abajo; orden 1→2→3; plazo 420 frames. Las cinco instancias incorporan además la misma colocación relativa de la polilla y del respiradero dentro del ejercicio. La fase de los peligros puede cambiar su sincronización, pero no crea una nueva ruta de resolución.

Balanced completa estos relojes en 304, 318, 303, 307 y 386 frames desde la primera activación. El último deja menos margen, pero eso no demuestra una decisión nueva: conserva secuencia, alturas y regla. La última parte contiene dos copias del mismo examen.

**Mejora:** variar el orden espacial, salida alta, retorno o trayecto de plataforma que se debe planificar; mantener un margen de reintento razonable. No resolverlo reduciendo de nuevo los 420 frames: elevaría precisión y presión sin reparar la monotonía.

### P2 de diseño: N5 y N8 reciclan soluciones ya dominadas

N5 `3-2` y su cierre `5-2` repiten contrapeso al fondo → vuelta a hueco superior. Las posiciones relativas de piedra/hueco coinciden; también aparece en N6 `3-2` y N8 `2-2`/`4-1`. N5 repite el sello doble en `2-2`, `3-1`, `4-2` y `5-1`. N8 hace una recapitulación de las cinco familias, pero cada prueba aislada usa una plantilla anterior.

Al normalizar solo reglas y posiciones relativas de nodos, las **40 pruebas corresponden a 10 plantillas**: reloj de tres pulsadores en ocho lugares; haz de tres espejos en siete; sello doble en cinco; contrapeso con regreso elevado en cinco. Esto no significa que existan solo diez salas: hay diferencias de trayecto, peligros y excursiones entre ellas. Sí demuestra que contar pruebas sobrerrepresenta la variedad de sus soluciones.

**Mejora:** dar al último contrapeso una relación origen/destino distinta y reservar para N8 alguna combinación que obligue a aplicar dos conocimientos en una misma situación. Reordenar ejercicios separados mantiene el repaso; no constituye por sí solo una culminación de sus reglas.

### P2 de enseñanza, no bloqueo: el escarabajo no comunica su respuesta especial

El escarabajo patrulla y se puede destruir cayendo sobre él (`updateCampaignFoes`, línea 3727). El texto de enseñanza no explica esta propiedad; las 24 rutas no registran ningún `stomp`. Completar sin matarlo es válido, pero estos testigos no acreditan que esa propiedad haya generado una decisión nueva. Las rutas sí manipulan obligatoriamente guardianes para los sellos y encuentran polillas que anuncian su picado.

**Mejora opcional:** presentar el pisotón en un encuentro recuperable con señal suficiente, si se pretende que el escarabajo aporte una respuesta diferenciada y no solo otra patrulla que saltar. No exigir matar enemigos por cumplir un contador. No afirmo un fallo de completabilidad ni que la campaña necesite un tercer tipo de sprite.

## Extensión y densidad frente a N1–N4

Medianas de tres políticas; segundos del simulador a 60 Hz. «Inmóvil» significa que no cambió x/y; «entrada neutra» no significa espera forzada, porque el cuerpo puede seguir en movimiento. Ni estas métricas ni los saltos se usan como número de decisiones.

| Nivel | Frames, mediana | Rango | Segundos sintéticos | Frames inmóvil, mediana | Entrada neutra, mediana |
|---|---:|---:|---:|---:|---:|
| N1 | 3.847 | 3.821–3.946 | 64,1 | 135 | 760 |
| N2 | 4.053 | 3.993–4.071 | 67,6 | 40 | 270 |
| N3 | 4.397 | 4.085–4.402 | 73,3 | 28 | 650 |
| N4 | 6.507 | 6.489–6.807 | 108,5 | 261 | 920 |
| N5 | 11.855 | 11.823–11.861 | 197,6 | 82 | 1.087 |
| N6 | 10.751 | 10.294–10.765 | 179,2 | 109 | 1.052 |
| N7 | 8.574 | 8.518–8.574 | 142,9 | 204 | 641 |
| N8 | 12.949 | 12.949–12.974 | 215,8 | 989 | 2.039 |

La mediana de las cuatro medianas base es 4.225 frames. N5–N8 alcanzan respectivamente 2,81×, 2,54×, 2,03× y 3,06× ese tiempo. **Son relaciones de duración sintética, no el umbral de acciones significativas de la rúbrica.** N8 dedica una mediana de 1.767 frames al jefe; el combate incluye espera de apertura y posicionamiento, parte legítima de ese ciclo.

La campaña obliga a resolver diez puertas persistentes: `levelClear` (línea 4075) exige además todas las pruebas resueltas y, en N8, jefe derrotado. La estructura de dependencias es mayoritariamente lineal: prueba A → travesía → prueba B → siguiente parte. No basta con correr hasta el tesoro. N5 combina sellos, runas y transporte; N6 reloj, runas y transporte; N7 luz, runas y reloj; N8 reúne las cinco familias y el combate. Cada nivel tiene más de tres fases obligatorias distinguibles y más de una familia de decisión.

Hay contenido sustancial fuera de los diez contadores. La galería alta de N5/4, el montacargas de N6/2 y la llave con regreso de N6/4 introducen recorridos y dependencia llave→puerta. En las rutas se ve subir, recoger y volver a la compuerta; no son simples cambios de nombre. La base también incluye llaves, puertas, plataformas móviles, posición de salto y combate; compararla solo con número de interruptores nuevos sería sesgado.

Mi instrumentación no etiqueta homogéneamente toda exploración opcional, desplazamiento vacío y acción obligatoria en los ocho niveles. Por eso la barrera cuantitativa del 80%/100% en **acciones significativas** queda **no demostrada en esta revisión**. Hay evidencia sólida de mayor recorrido obligatorio y poca inmovilidad, pero evidencia contraria a tratar todo ese recorrido como densidad creciente: la reutilización de plantillas señalada arriba.

## Progresión y enseñanza

La presentación inicial es razonable: N5 comienza con un sello y luego practica sello doble; ofrece primero un contrapeso hacia arriba y luego uno que exige regresar. N6 empieza con dos botones y 600 frames y pasa a tres con 420. N7 empieza con dos espejos y amplía a tres. Las lecciones de `campaignLesson` (línea 3818) explican controles, objetivo y recuperación; el orden de runas se muestra. La solución no depende de consultar código. Esto acredita soporte de enseñanza, no comprensión humana medida.

La debilidad es la tercera etapa, «combinar». Las reglas se alternan a menudo en salas independientes; en las partes tardías se repiten las mismas dos variantes. N6 sí combina el reloj con respiradero/polilla y ofrece excursiones distintas para llaves. N7 introduce el haz en una situación inicialmente sin enemigos, pero sus cinco versiones posteriores no cambian la lectura del haz. Su progresión se estanca tras la ampliación inicial.

## Comparación de jefes

| Aspecto | N4: Custodio | N8: Corazón |
|---|---|---|
| Victoria | Atraer proyectiles hacia tres conductores diferentes | Seis impactos cayendo sobre el núcleo durante apertura |
| Ataque principal | Fija puntería, lanza un proyectil; añade onda al final | Banda horizontal alterna; luego abanico; al final combinación con columna fijada |
| Contrajuego ejecutado | Elegir posiciones para alinear disparo/conductor y esquivar | Refugio alto, cebar posición y cambiar altura; volver al núcleo abierto |
| Cambios durante combate | Conductores consumidos obligan a recolocarse; onda final | Tres fases según vida, con cambio de políticas de refugio |
| Salida | Derrota abre compuerta | Derrota abre compuerta, seguido de tesoro/salida |

La ruta N8 balanced muestra fase 1 esperando en y=62 durante aviso/ataque; en fase 2 atrae el abanico en y=62 y baja a y=94 antes del ataque; en el último ciclo de fase 3 llega al suelo y=142 para evitar la banda alta además de abandonar la columna fijada. No es únicamente un aumento de velocidad o una segunda barra. El HUD/código anuncian ataque y apertura; no evalúo aquí su legibilidad visual real.

Los tres replays derrotan ambos jefes. N8 balanced no recibe impactos en todo el nivel. Eso demuestra una respuesta viable bajo el controlador; no demuestra que sea intuitiva o que un jugador nuevo la domine. No he ejecutado en esta revisión un fallo deliberado de ventana, muerte/reintento ni búsqueda exhaustiva de refugios dominantes, de modo que no afirmo cobertura completa del protocolo de jefes.

No hay jefe encubierto en N5–N7: sus cierres no tienen vida, fases de combate ni enemigo cuya derrota sea condición de victoria. Los guardianes son instrumentos para activar sellos, recuperables y repetidos a lo largo de las partes.

## Notas técnicas por dimensiones cubiertas

| Dimensión | Nota /10 | Razón y límite |
|---|---:|---|
| Duración activa y densidad | 7 | Extensión obligatoria grande y comprobada en 24 rutas; poco reposo. Repetición considerable y falta de clasificación homogénea de acciones significativas impiden otorgar 8. |
| Variedad real de decisiones | 6,5 | Cinco familias funcionales, cierres de N5–N7 distintos y excursiones valiosas. Muchas copias espaciales; no se acredita uso de la respuesta especial del escarabajo. |
| Progresión y enseñanza | 5,5 | Introducción y primera ampliación claras; repetición posterior, sobre todo N7, no cumple la progresión presentación→complicación→combinación de forma sólida. |
| Jefes y culminación | 7,5 | Dos jefes distintos, tres fases de N8 con respuestas observables y victoria legal. Faltan pruebas propias de fallos/reintentos y cobertura humana/visual. |

No puntúo justicia/recuperación, coherencia visual ni estabilidad/integración; no calculo una nota global incompleta. Alcance de dos jefes: cumple en código y rutas. Completabilidad por nivel: demostrada; secuencia íntegra y transiciones no probadas aquí. Sustancia cualitativa: hay tres o más fases diferentes por nivel; comparación por acciones significativas: no demostrada en mi instrumentación. La aceptación completa no se puede otorgar con esta cobertura y con la progresión repetitiva observada.

La prioridad de mejora es cambiar las situaciones tardías y sus soluciones, especialmente los cierres N6/N7. Añadir más salas, frames o botones a las mismas plantillas no resuelve el hallazgo.
