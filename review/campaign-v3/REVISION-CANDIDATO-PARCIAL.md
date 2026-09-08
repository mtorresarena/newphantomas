# Revisión parcial del candidato en construcción

Sin nota ni aprobación final. Solo se han modificado archivos de `review/campaign-v3/`. Se conservan copias fijas para que los resultados no se atribuyan a una versión posterior sin comprobarla:

- Candidato A: `candidate-A.html`, SHA256 `60f71d75e1ffa38abcbd69ace2156c422a69bf79ed14e34cee7512b60c771705`.
- Candidato B, tras corregir el orden de vencimiento: `candidate-B.html`, SHA256 `671e67a20368fb093e76fa2df2d09df374a49d0f862c65d0a9f087c6acb745ad`.

## Hallazgos

### [P1] Entrada un frame tarde en puerta temporizada: corregida en B para los casos comprobados

En A el frame de simulación avanzaba y `updatePlayer` podía introducir al jugador en una puerta todavía abierta antes de evaluar el vencimiento. El cierre se aplazaba por solapamiento; al salir por la derecha se cerraba detrás con el puzle sin resolver y bloqueaba el regreso. Alcanzar después un checkpoint del otro lado podía convertirlo en un bloqueo de progreso, dado que la meta exige todos los puzles resueltos. Esa consecuencia global no se ha reproducido en un recorrido completo.

`probe-deadline-physics.cjs` parte de un estado adyacente al umbral declarado y ejecuta `route.step` con controles normales. En A, offsets -1 y 0 respecto al plazo resolvían; +1 atravesaba sin resolver y quedaba bloqueado al intentar volver. Las once pruebas existentes pasaban porque comprobaban el vencimiento lejos del umbral y el contacto exacto, no ese orden entre física y expiración.

La repetición sobre B verifica que -1 y 0 enclavan, mientras que +1 cierra antes de mover: el jugador permanece a la izquierda y puede regresar a los mecanismos. Evidencias separadas: `probe-deadline-physics.json` y `probe-deadline-physics-B.json`. Esto acredita esa corrección concreta, no todas las fronteras posibles de temporizadores, reinicios o persistencia.

### [P2] El reinicio del jefe N8 conserva su posición desplazada

En B, `resetCampaign` restaura hp, fase y estado, pero no `b.x`. Si el jugador muere durante la apertura de fase 3, el núcleo conserva hasta unos 24 px de desplazamiento horizontal. La fase 1 del reintento empieza en esa posición hasta la siguiente apertura, cuando vuelve a calcularse la posición canónica.

`probe-recovery-matrix.json` registra: posición inicial 11224; posición de fase 3 11247,99998; tras muerte y respawn, la misma posición desplazada con hp=6/fase=1/idle. Es una incoherencia de reinicio; no se ha demostrado que cause un bloqueo o daño inevitable. Se recomienda restaurar la posición canónica junto con el resto del encuentro y comprobar un reintento desde cada fase.

### Observación de diseño: el primer sello puede resolverse sin saltar ni recibir daño

`probe-charge-safe-inputs-v2.json` contiene un prefijo de **controles reales desde el inicio de N5**, sin fixtures ni alteración de enemigos/energía. Ceba una carga hacia la izquierda, cruza durante recuperación/retorno y espera en una posición a la derecha fuera del alcance de la carga. El guardián activa el sello y se detiene antes del jugador.

Resultado: primer puzle resuelto en 418 frames (6,97 s), cero saltos, cero daños y tres vidas. No se presenta como fallo crítico de una introducción ni como evidencia de que toda la campaña sea trivial. Sí demuestra que «salta su carga» es una solución sugerida, no una acción necesaria en ese encuentro. La revisión posterior debe comprobar si los sellos avanzados cambian realmente esa política segura.

## Pruebas y alcance

- `node tools/check-campaign-rules.js`: 11 casos superados durante la inspección. Son fixtures de reglas, no recorridos.
- Los cuatro testigos completos originales se reprodujeron sobre A con los mismos frames y energía final que la base: N1 3227, N2 4545, N3 4100 y N4 6636. Verifican ausencia de regresión en esas rutas, incluyendo el jefe N4; no cubren todas las rutas/fallos posibles.
- `probe-recovery-matrix.cjs`: 40/40 casos de puzle vuelven al estado esperado tras muerte y respawn ejecutados por el motor. Los estados de preparación son fixtures: primer paso de runa/temporizador, espejo girado, contrapeso recogido o sello parcial cuando hay varios. Un sello único no tiene un progreso parcial estable y se prueba sin resolver. Se comprueba limpieza de inventario temporal, nodos, puerta y guardianes; no completabilidad posterior de cada ruta.
- El mismo probe identifica la posición no restaurada del jefe. Su montaje de fase 3 es declarado; no se utiliza como recorrido completo de N8.
- La clasificación homogénea de controles/eventos de N1–N4 se entrega en `CLASIFICACION-REFERENCIAS.md` y `clasificacion-referencias.json`. Mantiene separados controles, movimiento físico, recarga e interacciones, y documenta el sesgo de búsqueda.

## Variantes avanzadas y límites pendientes

El generador observado incorpora retorno ascendente con contrapeso, runas de cuatro nodos, temporizadores de tres nodos y ácido bajo los ascensores de N6 pares. Son diferencias verificables en datos y reglas. Esta revisión no convierte su presencia en prueba de que sean obligatorias, justas o divertidas: los recorridos completos, pruebas de omisión de apoyos y capturas correspondientes siguen a cargo de la validación del candidato final.

Las pruebas humanas no están disponibles. No se ha evaluado diversión, aprendizaje, sensación de monotonía ni duración humana. Tampoco se ha contado el testigo aislado anunciado del jefe N8 como una partida completa de N8. No se asigna ni ajusta una puntuación para alcanzar un objetivo.
