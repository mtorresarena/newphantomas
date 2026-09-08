# Fuente 6: contraste parcial de 18 testigos

Fuente evaluada: `5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21`. Sin nota nueva. Se conservan las notas y pruebas de candidatos anteriores.

## Integridad y alcance

`round6-review-frozen/` contiene copias inmutables de 18 testigos completos: las doce referencias N1–N4, balanced N5–N8 y speed N5/N6. Faltan cautious N5–N8 y speed N7/N8. El manifiesto declara `complete:false`; no se ha inferido ningún resultado para los seis ausentes ni medido rutas activas incompletas.

`preparar-medicion-round6.cjs` verifica el SHA, conserva los archivos existentes y rechaza sustituciones. Las definiciones N1–N4 y CFG coinciden con la base; el bloque de entrada/física/bucle coincide con fuente 4, excluida expresamente la función de ayuda de solo lectura `partLesson`. El diff completo del bloque de mecánicas solo añade la pista del primer escarabajo de N5. Se excluye esa línea exacta para el contraste, sin excluir funciones de comportamiento. `compatibilidad-fuente-round6.json` documenta el alcance.

Cada testigo se ha ejecutado desde su origen con la fuente 6: ejecución original, repetición fusionando órdenes consecutivas idénticas y observación independiente A–E. Los 18 terminan y conservan exactamente el estado completo final tras normalizar. Las tres políticas originales mantienen trazas distintas; balanced/speed N6 también tienen controles distintos aunque ambos duren 11346 frames.

Evidencia: `round6-classification/batch-18-9143827c1037-bounds-v1.json`, `comparacion-round6-parcial-18.json`. El resumen de comparación es parcial y usa las mismas unidades y fronteras preregistradas; no modifica mínimos.

## Comparación A–E

| Nivel/política | Frames | Vector A/B/C/D/E | Episodios | Daño: impactos / energía mínima |
|---|---:|---|---:|---|
| N5 balanced | 10939 | 2/10/7/6/0 | 25 | 5 / 48,70 |
| N5 speed | 10875 | 2/10/7/5/0 | 24 | 6 / 54,76 |
| N6 balanced | 11346 | 4/10/6/1/0 | 21 | 0 / 75,71 |
| N6 speed | 11346 | 4/10/6/0/0 | 20 | 1 / 75,71 |
| N7 balanced | 9345 | 0/10/9/10/0 | 29 | 0 / 75,60 |
| N8 balanced | 12491 | 0/10/5/11/6 | 32 | 5 / 48,59 |

Las seis rutas nuevas no tienen episodios pendientes de resolución ni muertes. Sus cotas superan el componente numérico comparable de la barrera 3: mediana original balanced 23,5–24,5, speed 22–23; N5–N7 requieren el 80% y N8 el 100%. Esto no demuestra por sí solo variedad, diversión, aprendizaje ni todas las barreras. No se impone retrospectivamente que las tres políticas deban superar el mínimo, y todavía faltan seis testigos para caracterizar el conjunto.

Se mantiene la referencia adversa N4 speed: energía mínima 3,4383. Que una búsqueda complete con margen bajo no demuestra un bloqueo del juego ni se elimina del conjunto.

## Ventanas semánticas V2, mismo observador

`clasificar-ventanas-v2-round6.cjs` cambia exclusivamente rutas de fuente, registro y resultados respecto del observador V2 de fuente 4. No cambia las categorías ni A–E. `semantic-windows-v2-round6/` guarda ventanas, intervalos consecutivos y resumen de los 18 testigos.

| Nivel/política | Ejecución de objetivos | Tránsito simple | Espera de mecanismo | Gestión de recursos no atribuida | Resto no atribuido |
|---|---:|---:|---:|---:|---:|
| N5 balanced | 107,38 s | 40,82 s | 0,60 s | 1,98 s | 31,50 s |
| N5 speed | 110,57 s | 41,38 s | 0,30 s | 0,87 s | 28,10 s |
| N6 balanced | 121,35 s | 36,98 s | 6,18 s | 0,85 s | 23,68 s |
| N6 speed | 121,63 s | 37,48 s | 4,65 s | 0,85 s | 24,43 s |
| N7 balanced | 86,90 s | 39,17 s | 2,73 s | 0,67 s | 26,18 s |
| N8 balanced | 118,27 s | 42,08 s | 12,42 s | 2,70 s | 32,68 s |

Además hay entre 2 y 6 frames por ruta de recogida opcional aislada, conservados en JSON y omitidos de esta tabla; no hay frames de muerte/reset en estas rutas. La ejecución incluye transporte, acceso y retorno hacia hitos verificados. En N5 balanced contiene 953 frames transportando contrapesos; en N6 balanced, 633. La espera de N6 balanced son 371 frames de plataforma móvil pasiva. En N8 balanced, 691 de sus 745 frames de espera corresponden al jefe.

Las ventanas describen ejecución observada, no necesidad mínima causal de cada frame. Moverse alejándose del próximo hito puede ser un retorno requerido o un rodeo; no lo llamamos desperdicio. Esperar, recargar o repetir un mecanismo no se convierte en contenido nuevo. Las referencias originales tienen menos hitos explícitos que los puzles: su mayor fracción no atribuida no demuestra menor densidad ni desplazamiento vacío. Los intervalos conservadores anteriores siguen archivados y no se sustituyen silenciosamente.

## Nuevos probes N6

`probe-variantes-legales-n6-round6.cjs` y `variantes-legales-n6-round6.json` añaden veinte ramas legales a las cincuenta previamente verificadas. Para cada reloj 3-1, 4-2, 5-1 y 5-2 se reproduce el prefijo balanced completo desde origen hasta la primera proximidad de uso, y solo entonces se aplica derecha, derecha con salto sostenido, salto pulsado, DOWN repetido o espera. Sin restaurar estado, teletransportar, curar ni retirar enemigos.

Prefijos: frames 3812, 8259, 9335 y 10931, respectivamente; todos con progreso cero y sin nodos activados. Ninguna rama resuelve su mecanismo en hasta 900 frames; dos mueren en el ácido de 5-2. Esto descarta estas políticas locales, no cualquier atajo global. Primera proximidad no implica que ese nodo sea el primero correcto: en especial DOWN repetido puede reiniciar un orden equivocado. Los eventos completos permiten contrastarlo.

Balanced completa los seis relojes N6 con márgenes respecto a su plazo de 301, 103, 189, 239, 248 y 97 frames (1-1, 2-2, 3-1, 4-2, 5-1, 5-2). Se calculan desde primera activación hasta el evento de paso enclavado, con duraciones del motor. No son márgenes de reacción humana ni prueba de equilibrio óptimo. La nueva cámara 5-2 es completada legalmente; los agotamientos anteriores de búsqueda no acreditaban un bloqueo.

## Objeciones y cobertura pendiente

- No se ha reproducido un nuevo softlock ni un atajo dominante en estos veinte probes. Las variaciones de topología de 5/6 y el cierre del patrón «girar todos una vez» constan en la revisión parcial anterior; no se vuelven a contar como unidades adicionales.
- La ayuda genérica de espejo en fuente 6 todavía dice «Abajo gira cada espejo» (línea 3749). Es ambigua frente a los avanzados donde varios ya están orientados. La pista particular es más precisa. Resolver esa inconsistencia requiere que la ayuda genérica describa la selección del espejo y que algunos pueden conservar su orientación; es una objeción de enseñanza, no un bloqueo probado.
- Faltan seis políticas completas y la recuperación de las nuevas variantes en esta fuente, así como continuidad e integración/presentación actuales. Las pruebas de recuperación y navegador de fuentes anteriores conservan su valor y su procedencia; no se declaran automáticamente nuevas ejecuciones de la fuente 6.
- El buscador cautious N5 cambió su clave de estado y su manejo del guardián que vuelve tras una carga fallida. Se ha comunicado que ahora espera mediante controles legales de diez frames. No cambia el motor y no es evidencia de softlock. Al llegar el testigo se distinguirá esa latencia/reintento; el observador V2 puede dejar el estado `return` neutral como no atribuido, pues su condición de espera de guardián enumera alert/charge/recover. No se le acreditará como actividad adicional ni se alterará silenciosamente la regla tras observar los conteos.
- Los controles comparten familia de buscador, con costes distintos y presupuesto 20000. Objetivos geométricos y heurísticas de aproximación se han ajustado para nuevas cámaras. La igualdad de nombres de políticas no acredita igual pericia, optimalidad ni participantes humanos. Los intentos fallidos previos se conservan y los seis testigos completos disponibles son una selección parcial, no una población de éxito.

No corresponde emitir todavía una nota del conjunto completo. La ausencia de pruebas humanas y de hardware físico se mantiene como límite distinto de los defectos técnicos reproducidos.
