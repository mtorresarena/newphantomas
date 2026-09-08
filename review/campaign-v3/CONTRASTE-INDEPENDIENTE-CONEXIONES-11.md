# Contraste independiente de mecanismos conectados, fuente 11

Fuente examinada: `b9f1a7b93ca1438d7a969cd76852f119d87e9c6ff91cabb752515f6090a12c03`. No se cambia la rúbrica, ninguna frontera A–E ni el significado de actividad. No se asigna nota en este cierre parcial: el contador temporal tiene una corrección de presentación pendiente de contrastar en fuente 12.

## Relaciones comprobadas

- **N6, peso 3-2:** el mismo objeto alimenta la balanza baja, despliega apoyos, permite fijarlos y se recupera para la balanza superior. Retirarlo antes del cerrojo retrae los apoyos; después del cerrojo permanecen. Devolver a base el peso ya recuperado tampoco elimina el anclaje ni duplica el objeto. Son cambios de estado y recorrido de una misma cámara, **una sola B**.
- **N6, reloj 5-1:** la segunda activación retira un apoyo bajo y habilita otros; el acceso posterior al tercero cambia de altura. Orden incorrecto y caducidad restituyen nodos y mapa. Caducar sobre cualquiera de los tres apoyos de la etapa 2 deja caer al suelo seguro y permite reactivar. Los apoyos de la primera etapa **no son todos obligatorios**: desde el prefijo legal f10129, caminar por suelo y saltar activa 2 en f10254, sin tocar pasarelas. Esto es una alternativa local admisible, no una prueba de completar la cámara sin apoyos; no aumenta ni reduce B.
- **N7, luz 5-2:** solo una configuración de los cuatro espejos conduce a R. Su energía queda enclavada, despliega la pasarela y habilita E. Desviar la misma luz a S usa esa historia; las cuatro configuraciones finales aceptadas difieren únicamente en espejos que ya no recorre el haz desviado. No se exige iluminación simultánea físicamente imposible. Interrumpir un haz elimina sus frames de estabilización; el enclavamiento de R permanece hasta reiniciar la cámara incompleta.

## Atajo del prisma: evidencia adversa conservada y corrección

En fuente `649512e5fb49…`, la ruta completa `connected-witnesses-649512e5fb49/route-n7-ground-prism-shortjump.json` alcanza R naturalmente en f9254, baja al suelo, salta cinco frames y activa E en f9407. Completa N7 en f9669 con tres vidas y **cero contactos con las pasarelas nuevas**. Es un atajo físico demostrado; no elude el receptor lógico R.

La reproducción literal de esos controles en 11 deja E en 0 y la cámara sin resolver: `prisma-salto-corto-contraste11.json`. La ruta normal actual completa N7 en f9584 y registra 65 frames de apoyo sobre las pasarelas nuevas, primero f9315. Una búsqueda adversarial desde el mismo R alcanzado legalmente, con 5000 expansiones y rechazo de contactos cada frame, no encuentra solución sin apoyos; aproximación mínima a E 26,54px frente al radio estricto de 25. `prisma-pasarela-b9f1a7b93ca1.json` declara la búsqueda limitada; **no demuestra imposibilidad global**.

## Incidencia de presentación reproducida

Los mensajes de cambio de pasarelas suprimen el contador del reloj porque el HUD exige ausencia de `msg.t`. En N6 balanced 5-1, el contador se oculta 357 de los 504 frames con reloj activo, 119 tras cada activación. `reloj-feedback-oculta-tiempo11.json` fija frames, mensajes y plazo. No bloquea la ruta observada, pero oculta un recurso pertinente durante el reto. El criterio de cierre es que el tiempo restante coexista legiblemente con los avisos, también al aproximarse al vencimiento. El autor prepara una corrección solo de HUD en fuente 12; no se acredita antes de contrastarla.

## Recuperación y pruebas propias

`recovery-round11-independent/summary.json`: cinco replays nuevos completos, desde origen, sin mutaciones de partida ni muerte directa:

| Testigo | Frames | Vidas finales | Observación |
|---|---:|---:|---|
| N6 exercise-links | 11944 | 3 | Retirada prematura, reposición, anclaje y recuperación del mismo peso |
| N6 expire-trial5-1 | 12967 | 3 | Caducidad con progreso, mapa/nodos restablecidos y meta |
| N7 exercise-links | 9624 | 3 | Interrupción de C tras R, conservación de la energía y reconexión |
| N6 retry-weight-trial3-2 | 22943 | 2 | Muerte real con progreso parcial, reinicio y meta |
| N7 retry-mirror-trial5-2 | 20780 | 2 | Muerte real después de cambiar ángulos, restitución y meta |

`estados-conectados-b9f1a7b93ca1.json`: cinco grupos de fixtures independientes complementan esos replays: devolución a base tras anclaje, orden incorrecto en ambas etapas, caída desde cada apoyo al caducar, enumeración de 32 estados ópticos antes y después de R y no acumulación de carga interrumpida. El posicionamiento, los ángulos y un reloj de esos casos se preparan artificialmente: son pruebas de contratos del motor, **no rutas legales**. Los 18 bordes generales del autor y su cobertura previa permanecen separados.

## Medición común completa

Los 24 archivos, sus hashes y la fuente se copiaron sin reemplazos en `round11-review-frozen/`. Las coordenadas se fijaron en `segmentos-conectados-b9f1a7b93ca1.json` antes de medir, con cero pasos de simulación. El clasificador y el observador V2 son copias con cambios de rutas de archivo únicamente.

`round11-classification/batch-24.json`: los 24 recorridos completan desde origen, sin muertes, y agrupar órdenes consecutivas idénticas preserva exactamente el estado final completo. La mediana de referencia conserva los intervalos 23,5–24,5 / 24–25 / 22–23.

| Episodios A–E | balanced | cautious | speed |
|---|---:|---:|---:|
| N5 | 25 | 24 | 24 |
| N6 | 20 | 20 | 20 |
| N7 | 29 | 31 | 30 |
| N8 | 32 | 33 | 29 |

N6 conserva A4+B10+C6 y da D0 en las tres rutas. Sus nuevas trayectorias evitan acreditar una respuesta independiente a los encuentros D; no se han borrado enemigos ni sumado B por las dependencias nuevas. Se mantienen los mínimos incluso contra los extremos conservadores de referencia. Que el total baje mientras mejoran las relaciones físicas demuestra por qué la nota de diseño no debe deducirse mecánicamente del conteo.

`semantic-windows-v2-round11/summary.json`: N6 dura 198,77–200,58s, con ejecución operacional 130,40–131,87s, tránsito simple 37,08–37,42s y espera de mecanismo 4,63–6,33s. N7 dura 159,40–159,73s, ejecución 89,08–90,37s, tránsito 39,93–40,45s y espera 3,18s. N5/N8 conservan sus resultados anteriores. No se llama vacío al tránsito ni actividad humana a las ventanas. El observador V2 no incorpora hitos nuevos de `anchor`/`receiver`; los cubre mediante ventanas B más amplias. Al recuperar peso, su anotación auxiliar del objetivo aún apunta a la base original, por lo que **no se usa la métrica de alejamiento del próximo hito para juzgar eficiencia de estas conexiones**. La clasificación principal por movimiento/objetivo conserva su alcance operacional.

Los presupuestos declarados del conjunto mezclan 20000 y 8000 expansiones (`metadata-testigos-round11.json`); las rutas N5/N8 y referencias se reutilizan con revalidación real. No se sostiene que las 24 búsquedas se hayan repetido con un presupuesto uniforme, ni que reutilizar rutas o costes comunes pruebe igual habilidad u optimalidad. La energía mínima adversa de N4 speed se conserva.

## Presentación observada y alcance pendiente

Se inspeccionaron `round11/n7-powered-prism-world-final.png`, `n6-reused-weight-world.png` y `n6-clock-changing-path-world.png`: personaje, nodos, trazado y apoyos resultan distinguibles en los fotogramas mostrados. Son exportaciones compuestas de los dos lienzos producidos por el navegador, **no capturas del panel HTML ni de los controles táctiles**. No se transforma esa evidencia en inspección de todo el juego a toda resolución.

No se ha reproducido una dependencia imposible ni un reinicio que impida completar. El defecto de contador sigue abierto en esta fuente. La prueba final de la fuente que lo corrija debe incorporar el delta exacto, continuidad, ayudas DOM y feedback del jefe; los límites humanos y de no exhaustividad continúan aparte y no se convierten en vetos técnicos automáticos.
