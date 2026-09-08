# Primera revisión independiente puntuada

**Nota técnica: 7,55/10 (7,6 redondeado). No alcanza los mínimos internos y no constituye aceptación del usuario.** Fecha: 2026-09-08. No hay pruebas humanas: no se califica diversión ni dificultad percibida.

Se evalúa la copia `candidate-score1.html`, SHA-256 `57a34b6ffb17a65d897d4e0b6a832ddd9f77300673942a2865efde24ac3d2725`, tomada del trabajo en curso de `codex/phantomas-campaign-v3`, sobre base `31d4610`. No es una aprobación de archivos posteriores. Se mantienen los pesos, barreras y alcance fijados en `CRITERIOS.md`: exactamente los jefes N4 y N8. No se han editado juego ni assets.

## Notas y fundamento

| Dimensión | Peso | Nota | Evidencia favorable y límite que impide una nota superior |
|---|---:|---:|---|
| Duración activa y densidad | 20% | 6,5 | Hay cinco partes y diez puzles resueltos en cada nivel, más el jefe N8; las rutas nuevas son sustancialmente más largas. Falta separar desafío, tránsito simple, espera obligada y exploración con el mismo clasificador y políticas comparables para N1–N8. Los segundos brutos no acreditan densidad ni la barrera numérica. |
| Variedad real de decisiones | 20% | 8,0 | Cinco familias mecánicas, cierres diferentes —contrapeso, temporizado, espejos— y combinaciones efectivas. Sellos exigen cebar guardianes; runas orden; espejos orientación; contrapesos transporte; temporizadores coordinación. Las rutas activan guardianes, polillas y vigías, y pisan plataformas móviles/frágiles. Se repiten plantillas; falta búsqueda comparativa de estrategias que homogenicen su resolución. Ninguna ruta pisa un escarabajo: su respuesta ofensiva no queda acreditada por estos testigos. |
| Progresión y enseñanza | 15% | 7,5 | El sello inicial admite una introducción segura; después hay guardianes de mayor alcance, retorno ascendente con contrapeso, cuatro runas en altura, temporizados de tres nodos y combinaciones con ácido/elevadores. Falta una matriz ejecutada de presentación segura→fallo recuperable→práctica→combinación para todas las mecánicas obligatorias. Los testigos conocen las soluciones; no verifican que las pistas basten para aprenderlas. |
| Jefes y culminación | 15% | 8,5 | N4 sigue resolviéndose con tres conductores. N8 exige seis impactos desde arriba, tres fases y respuestas entre alturas; el recorrido completo recibe cero daño durante el jefe. Anticipación, ataque y apertura tienen estados y señales distintos. Faltan pruebas dirigidas de ventana fallida, último golpe simultáneo con muerte y reintento completo tras morir en cada fase. |
| Justicia y recuperación | 15% | 7,5 | Los cuatro niveles completos son posibles con vidas intactas. Pasan 40 fixtures de reinicio parcial y los tres bordes temporales -1/0/+1; el jefe recupera su posición canónica. No se ha demostrado volver a completar desde cada punto de control después de fallos alcanzables, ni la persistencia real. N5 recibe 15 golpes en su testigo: no demuestra daño inevitable, pero impide inferir limpieza o margen humano de esa ruta. |
| Coherencia visual y legibilidad | 5% | 7,5 | Las capturas reales muestran una dirección visual consistente, buena separación de objetivos y un jefe reconocible; se inspeccionaron sellos, temporizado, espejos, contrapeso, aviso/ataque/apertura y dos formatos móviles. La copia fijada coloca el mensaje de interacción abajo y en paisaje móvil puede coincidir con el botón de aspecto. Faltan comprobaciones de todas las familias en ambos aspectos, errores/recuperación y resoluciones. |
| Estabilidad e integración | 10% | 7,5 | Tres repeticiones deterministas por ruta, secuencia N4→N5→N6→N7→N8→título y pausa por teclado pasan. Los cuatro testigos originales N1–N4 también terminan en la copia fijada con los mismos frames. El harness sustituye DOM, audio, carga de imágenes y almacenamiento; esos resultados no prueban persistencia, selección táctil/mandos ni ausencia de errores de recursos en navegador. |

Fórmula: `6,5×0,20 + 8×0,20 + 7,5×0,15 + 8,5×0,15 + 7,5×0,15 + 7,5×0,05 + 7,5×0,10 = 7,55`.

## Barreras, separadas de la nota

| Barrera | Estado | Alcance de la conclusión |
|---|---|---|
| 1. Alcance | Cumple | Dos jefes N4/N8; N5–N7 cierran con contrapeso/temporizado/espejos, sin arena de jefe encubierta. |
| 2. Completabilidad | Cumple | Rutas completas y conectadas mediante controles de producción, sin asignación de estado, recursos regalados ni enemigos eliminados. Se distingue de los fixtures de bordes. |
| 3. Sustancia | **No demostrado** | Hay varias fases y dependencias reales; no se encontró acceso a la salida ignorando los puzles centrales. Falta la comparación homogénea de acciones significativas con los mínimos 80%/100% de la referencia. Ni extensión, segundos, saltos ni inversiones sustituyen ese requisito. |
| 4. Variedad | Cumple en el alcance probado | Cada nivel combina varias familias obligatorias y los tres cierres tienen reglas distintas. Hay uso efectivo de guardianes —cebar y aprovechar recuperación—, polillas —abandonar el destino fijado de un ataque que atraviesa geometría— y vigías —proyectiles interceptados por geometría—. No se atribuye uso efectivo al pisotón del escarabajo. Queda abierta la búsqueda de una política que trivialice varias familias. |
| 5. Jefe N8 | Cumple | Tres fases recorridas, seis golpes válidos, salida real y contrajuego sin recibir daño en el combate. Es mecánicamente distinto de N4. |
| 6. Justicia | **No demostrado con la amplitud requerida** | No queda un bloqueo crítico reproducido abierto en esta copia. Los 40 reinicios verifican consistencia del estado; no prueban por sí mismos la resolución posterior desde todos los puntos razonables de recuperación. No se declara que exista un bloqueo solo por faltar esa prueba. |
| 7. Integridad | Cumple en el alcance probado | N1–N4 siguen completables; continuidad y final funcionan. Persistencia y algunas superficies de entrada/recursos siguen sin cobertura suficiente para la dimensión de estabilidad. |

Mínimos internos: media ≥8 **no**; ninguna dimensión <6 **sí**; justicia y estabilidad ≥8 **no**; todas las barreras demostradas **no**. La decisión de aceptación corresponde al usuario; tampoco alcanzar esos mínimos probaría diversión.

## Resultados observados

| Nivel | Frames / segundos de simulación | Saltos iniciados | Cambios de dirección ordenados | Frames neutrales | Golpes recibidos | Energía mínima |
|---|---|---:|---:|---:|---:|---:|
| N5 | 11633 / 193,88 | 45 | 140 | 1084 | 15 | 19,48 |
| N6 | 9532 / 158,87 | 68 | 56 | 702 | 6 | 50,64 |
| N7 | 8664 / 144,40 | 53 | 32 | 591 | 9 | 50,00 |
| N8 | 13108 / 218,47 | 82 | 112 | 2023 | 7; 0 en jefe | 67,17 |

Fuente independiente: `score1-independent-audit.cjs/json`. Todos terminan con diez puzles resueltos y tres vidas. N8 completa seis golpes del jefe; no es el antiguo ensayo de arena aislado. N6 contacta los elevadores de las partes 2/4 durante 28/33 frames y plataformas frágiles en sus cinco partes. Eso demuestra uso, no prueba por sí solo la imposibilidad de otro cruce.

Las referencias originales conservadas N1–N4 duran respectivamente 3227, 4545, 4100 y 6636 frames. Se reprodujeron en la copia fijada, con llegada a `clear`, sin muerte ni pérdida de vida y conservando esas duraciones. `CLASIFICACION-REFERENCIAS.md` y su JSON separan órdenes, movimiento, carga, contactos e interacciones. Son rutas obtenidas con búsqueda y objetivos espaciales distintos; N2 además usa otra penalización de daño. No se presenta su mediana como referencia válida de actividad significativa.

`score1-connected-replays.cjs/json` conserva la comprobación del autor adaptada solo a fuente y testigos congelados: tres ejecuciones idénticas y continuidad con teclado/pausa. Se inspeccionó el comprobador y se ejecutó; sus repeticiones verifican determinismo, no diversidad de políticas. El auditor independiente añade interacciones, órdenes, activaciones enemigas y uso de plataformas. Ambos usan un VM del motor, no jugadores humanos ni un navegador completo.

## Objeciones concretas y cómo cerrarlas

Se separan defectos observados, decisiones de diseño y cobertura pendiente; una carencia de prueba no se convierte en un bug imaginado.

1. **Legibilidad móvil, defecto observado en score1 (P2).** El prompt de interacción se dibuja en y174–186 (`candidate-score1.html`, línea 3778); en `touch-landscape.png` coincide con el botón inferior de aspecto. Cierre verificable: captura de la misma interacción en paisaje/vertical, con ambos aspectos y controles visibles, mostrando texto íntegro y ninguna superposición. El autor comunica que lo ha cambiado posteriormente; no se concede esa corrección a la copia congelada.
2. **Actividad significativa, cobertura material pendiente.** No se puede resolver contando más frames ni rebautizando inversiones como decisiones. Cierre: preregistrar episodios/segmentos por nivel y un clasificador común, ejecutar políticas legales distintas y publicar vector por familia, actividad/espera/repetición, mínimos y dispersión. Las secuencias de nodos se cuentan por objetivo resuelto para evitar inflar cifras con más pulsaciones.
3. **Repetición de plantillas, limitación de diseño observada.** Diez pruebas por nivel reutilizan cinco sistemas; hay variantes geométricas reales, pero la evidencia actual acredita una solución conocida por prueba. Cierre verificable: matriz que explicite qué respuesta debe cambiar entre introducción y variante avanzada y testigos que demuestren esa diferencia; ensayar políticas sencillas comunes a varias salas buscando atajos dominantes. No exige añadir más nombres o tipos cosméticos.
4. **Enseñanza/contrajuego de enemigos, cobertura pendiente.** Hay activaciones reales, pero cero pisotones de escarabajo en las cuatro rutas y falta matriz de acercarse/esperar/esquivar/atacar. Cierre: casos con controles legales que evidencien las respuestas y las señales disponibles antes del primer daño; identificar dónde afectan una ruta obligatoria. El pisotón puede ser una opción y no necesita hacerse obligatorio artificialmente.
5. **Recuperación, cobertura pendiente prioritaria.** `score1-recovery.json` verifica estado después de 40 muertes parciales, pero no el nuevo recorrido hasta resolver. Cierre: prefijos legales hasta fallos representativos de las cinco familias y cada fase del jefe; morir/reaparecer por controles y continuar hasta completar; inventario, nodos, compuertas y guardianes consistentes. Cubrir retorno a una prueba vencida/expirada, transporte perdido y puntos de control a ambos lados de una dependencia. Un montaje unitario sigue siendo útil, pero se etiqueta como tal.
6. **Jefe, bordes no cubiertos.** El testigo completo sin daño confirma una respuesta viable; no verifica perder una ventana ni eventos simultáneos. Cierre: última vida/último golpe en el mismo tick, muerte en apertura, abandonar o perder la oportunidad y reintentar las tres fases. Debe quedar una única transición coherente, sin victoria con estado de muerte residual ni arena inaccesible.
7. **Integración real, cobertura pendiente.** El VM usa almacenamiento falso y no carga imágenes/audio. Cierre: guardar desbloqueos, recargar una página nueva, continuar al nivel correcto, verificar selección, tacto/mandos admitidos y consola/recursos en ambos aspectos. Capturas aisladas no prueban esas acciones.

El primer sello resoluble sin salto ni daño es una introducción segura, no se penaliza como fallo. N5 con 15 golpes es una observación del controlador, no evidencia de daño inevitable ni de dificultad humana. No se exige una ruta sin daño en toda la campaña para aceptar una experiencia justa, pero sí casos que descarten daño obligatorio sin aviso y recuperación rota.

## Defectos anteriores ya resueltos en el alcance probado

- La puerta temporizada permitía cruzar un frame tarde por orden de actualización. `score1-deadline.json` vuelve a comprobar -1/0/+1: llegada válida enclava; llegada tardía se bloquea y permite volver al banco izquierdo. Se conservan los probes originales como evidencia histórica.
- El jefe no recuperaba su x canónica tras la oscilación de fase 3. `score1-recovery.json` confirma restauración a x11224, hp6 y fase1. No se mantiene como defecto abierto.

Las capturas adicionales de ataque/aviso/contrapeso y formatos móviles se inspeccionaron como evidencia visual puntual; algunas son de una revisión visual próxima y no proporcionan por sí mismas un hash de motor. No reemplazan los replays congelados. Esta primera nota no incorpora promesas ni una supuesta experiencia humana.
