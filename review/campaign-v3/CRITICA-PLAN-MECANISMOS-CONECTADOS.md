# Crítica independiente del plan de mecanismos conectados

Plan leído: `ITERACION-MECANISMOS-CONECTADOS.md`. Referencia técnica congelada: fuente 9, SHA `d4b3b88064956af7b9c9460507aff83110f47ed4a2eb28394cacad69d87fee53`. Sin nota nueva, sin crédito por anuncios y sin cambios en `CRITERIOS.md` ni en las unidades A–E.

## Qué puede aportar y qué no demostraría una mejora

Las tres propuestas tienen una relación causal potencialmente útil: un objeto cambia de función, una acción transforma el camino mientras transcurre el tiempo y una misma red debe cambiar de destino después de cumplir un primer objetivo. No son necesariamente simples trámites porque tengan una solución ordenada; una solución única puede exigir entender estados y dependencias.

La mejora quedaría débilmente acreditada si el jugador solo pulsa el elemento accesible siguiente, ve abrirse otro acceso y repite, sin necesidad de considerar la configuración, su posición o el estado conservado. Dar otros nombres a tres cerraduras consecutivas no demuestra integración. La prueba útil es mostrar qué consecuencia cambia al retirar, activar o redirigir antes de tiempo, y que existe una recuperación legible. No exige inventar bifurcaciones ni rutas óptimas diferentes.

Cada nuevo mecanismo con una compuerta final sigue siendo **una unidad B**, aunque tenga dos balanzas, un cerrojo o dos receptores. La amenaza interna no suma D aparte. Si cambian posiciones/fronteras, se registran antes de leer rutas; no se corrigen unidades para compensar el resultado.

## Contratos de diseño y casos que discriminan riesgos reales

| Propuesta | Condición que acredita conexión | Riesgos comprobables y casos acotados |
|---|---|---|
| N6 3-2: mismo peso, escalera y cerrojo | El peso en la primera balanza mantiene un acceso; el cerrojo convierte ese acceso temporal en persistente dentro del intento; entonces el mismo objeto puede transportarse al destino superior. | Retirar antes del cerrojo debe ser legal y recuperable. Si nunca puede ocurrir, esa relación no se aprende por acción. La retirada no puede encerrar al jugador, colocar sólidos dentro de su cuerpo ni exigir el mismo peso en dos lugares simultáneamente. Probar depósito→retirada prematura→reposición; depósito→cerrojo→recuperación→depósito superior; muerte llevando peso después de fijar, comprobando vuelta a configuración inicial resoluble. |
| N6 5-1: pulsadores que cambian pasarelas | La configuración y el lugar desde el que se activa importan para recorrer el orden; no solo aparece una pasarela nueva después de cada trámite. La disposición inicial permite observar el primer cambio antes de comprometerse. | Para cada cambio debe existir un apoyo alcanzable y el siguiente pulsador debe poder alcanzarse en esa configuración. La caducidad y el orden equivocado deben restaurar también las celdas de geometría, no solo `progress/until`. Probar expiración desde el apoyo transformado y desde un banco; si hace falta fixture de frontera, etiquetarlo y acompañarlo de regreso legal. No retirar el único apoyo ni materializar una pared atravesando al jugador. |
| N7 cierre: primer receptor, pasarela y prisma | La primera iluminación deja un estado enclavado reconocible; la pasarela permite usar o acceder al prisma; el mismo haz se redirige hacia el segundo destino. La primera red tiene una segunda función. | **No exigir ambos receptores iluminados simultáneamente** si hay un único haz que se desvía: A debe conservar historial y B requerir iluminación posterior. B primero, si es alcanzable, debe tener feedback y permitir volver a A; ningún cambio temprano debe consumir o aislar el prisma. Al redirigir, la pasarela fijada no debe desaparecer por perder luz en A. Probar B primero/retorno, A→desvío→B y muerte después de A con prisma alterado; revisar estado, pasarela, ángulos y punto de reaparición juntos. |
| Presión avanzada N6 | La amenaza anunciada modifica una respuesta del recorrido después de enseñar la regla, con refugio y tiempo suficientes. | Colocarla donde ninguna ruta necesita responder no demuestra refuerzo. Tampoco exigir daño para cuadrar el plazo. Comparar una respuesta legal con continuar/esperar desde el mismo prefijo, conservando enemigo y geometría; comprobar que esperar en refugio deja una vía de repetición si caduca. No traducir más daño o tiempo a más decisiones. |

El último caso no obliga a que todos los jugadores reciban daño ni a que cada política produzca D>0. Lo que importa es la función observada del enemigo, incluidos encuentros absorbidos por el puzle.

## Riesgos de integración con el motor actual

Son diferencias entre la propuesta y la implementación anterior, **no fallos de una implementación futura aún no revisada**:

- En fuente 9, `useCampaignNode` para peso activa todos los nodos y llama a `solveTrial` en el primer depósito (líneas 3604–3605). También solo permite tomar una piedra inactiva. La primera balanza nueva no puede usar esa finalización tal cual: hace falta representar ubicación única del peso, posibilidad de recuperación y estado del cerrojo sin declarar resuelta la prueba. No duplicar el peso visible/transportado entre dos nodos.
- `solveTrial` abre la compuerta y `resetCampaign` omite los trials resueltos (3580–3583). Usarlo para un hito intermedio dejaría progreso/puertas indebidamente permanentes tras morir. Se necesita distinguir avance parcial de victoria final.
- El reset anterior restaura nodos y la compuerta principal, pero no conoce escaleras/pasarelas nuevas. Conservar un inventario explícito de las celdas originales y restaurar geometría junto con flags, receptores, peso y reloj. Evitar que una cámara restaurada sobrescriba una puerta/checkpoint de otra.
- `mirrorTrace` anterior selecciona un solo receptor y termina al llegar a él. La semántica de dos destinos debe definir inequívocamente cuál es el activo y cuál queda enclavado. Un contador compartido de estabilidad no debe acumular frames entre destinos distintos ni conceder B por luz residual de A.
- La reaparición debe quedar en el lado desde el que se puede reconstruir el mecanismo. Antes de cambiar la geometría, contrastar el checkpoint real: restaurar una pasarela bajo un punto de reaparición válido en otra configuración puede crear una dependencia imposible.

La interpretación coherente con la campaña previa sería reiniciar **el mecanismo incompleto** al morir y conservar uno ya resuelto. Si se elige otra regla, debe quedar explícita y probar su pérdida de progreso; no usar reinicios para inflar duración.

## Ayuda voluntaria y feedback

La ayuda progresiva puede mejorar enseñanza sin modificar la física, pero el texto automático actual contiene soluciones explícitas. Revisar juntos HUD, mensaje próximo, pausa, introducción y pista particular: ocultar la solución en un botón mientras otro canal la revela no acredita progresión voluntaria.

Definir el alcance de la ayuda por mecanismo, y documentar si se conserva entre sus etapas, evita que pedir la solución de una sala revele automáticamente la siguiente. Abrir/cerrar pausa no aumenta el nivel; mantener H no cuenta como varias solicitudes; un toque no debe avanzar dos niveles por combinar pointerdown/click. El botón de pista no debe propagarse al handler de canvas que actualmente reanuda la pausa. Probar observación→pista→solución con acciones separadas, reabrir sin avanzar, muerte/retorno y cambio de sala. Al consultar, el reloj y la entrada de movimiento deben conservar la protección corregida en fuente 9.

Los jefes pueden ganar legibilidad distinguiendo anuncio de fase, apertura, golpe al jefe y daño al jugador. El pulso no debe ocultar la anticipación todavía relevante; un sonido por transición o impacto, no uno por frame del mismo estado. Verificar pausa, modo silenciado, último golpe simultáneo con daño/muerte y derrota. Las ventanas/hitboxes/vida prometidas como constantes deben contrastarse con la fuente previa; más efectos no constituyen una nueva fase ni más dificultad por sí solos.

## Evidencia suficiente para revisar el candidato

Congelar el nuevo HTML y registrar las posiciones antes de medir. Un recorrido completo legal de cada cámara cambiada, sus fallos parciales y la recuperación final aportan más que muchas pulsaciones aisladas. Completar luego las rutas comparables y la continuidad, preservando los intentos fallidos. Los fixtures de fronteras son útiles para cierre de geometría y estados simultáneos, pero no sustituyen accesibilidad desde origen.

No hay una dependencia necesariamente imposible en el plan tal como está formulado. Sí hay contratos parciales aún por concretar, especialmente invariantes de objeto único, enclavamiento del receptor y restauración de celdas. La siguiente evaluación dependerá de esas relaciones implementadas y de su comportamiento, no del número de etapas descritas ni de una cifra prometida.
