# Anotación operacional por ventanas de objetivos, versión 2

Prerregistrada el 2026-09-08 antes de ejecutar este observador. Se conserva el análisis puntual anterior y sus intervalos; no se modifica A–E, sus fronteras, pesos, umbrales ni notas. El primer conjunto será el último completo y verificado, fuente 4 con sus 24 testigos. Cada fuente posterior requerirá reproducción y resultado propio.

## Corrección metodológica explícita

El análisis anterior respondía a una pregunta demasiado estrecha: qué instantes prueban causalmente una transición. Eso no describe bien cuánto dura ejecutar un objetivo. Transportar un contrapeso durante 200 frames es actividad de ese objetivo, aunque el depósito solo cambie el estado en el último frame. La baja cobertura del observador puntual **no demuestra poca actividad del juego** ni implica que la rúbrica exija conocer la ruta óptima frame a frame.

Esta segunda anotación describe la ejecución observada de tareas concretas. «Acción de objetivo obligatorio» significa que el personaje está ejecutando un tramo de transporte, acceso, orden, cruce o combate asociado a progreso verificado; **no que cada frame fuese indispensable ni eficiente**. Se mantienen aparte esperas, recursos, errores y movimientos no atribuibles. Las ventanas no añaden unidades significativas al conteo A–E.

## Ventanas y evidencia

1. **Puzles B.** Dentro de la cámara preregistrada, desde la entrada o hito anterior hasta el siguiente hito verificado de esa prueba: activación correcta, sello activo, toma/deposito, ajuste de espejo que coincide con la solución final o resolución. Se admite el movimiento interno de acceso/transporte/retorno aunque momentáneamente se aleje del nodo. Se registran esos frames de alejamiento como posible rodeo, no como prueba de necesidad. Salir a recargar no queda absorbido por la etiqueta del puzle.
2. **Tránsito C y encuentros D.** Solo ventanas de los episodios ya acreditados mediante el contrafactual común. Movimiento/control dentro de ellas se anota como ejecución del cruce o respuesta; no toda presencia en una región candidata. Regiones no acreditadas no reciben actividad obligatoria automática.
3. **Llaves A.** Para una llave elevada necesaria, se identifica el despegue previo desde suelo bajo y la recogida, con límite de 600 frames y 256 px de alejamiento horizontal. La ventana observada de ascenso se anota como acceso al recurso; se conserva incertidumbre si no se encuentra ese inicio. Una llave a ras del corredor solo aporta su instante de recogida: no convierte todo el pasillo anterior en desafío. Una puerta aporta su apertura, no una nueva región de tránsito.
4. **Jefes E.** Movimiento/control durante combate activo se anota como ejecución de combate. La latencia de apertura, recuperación o derrota se separa cuando el personaje permanece inmóvil sin controles y el estado del jefe avanza por temporizador. No se llama combate a caminar después de la derrota.

## Etiquetas por frame

Prioridad: muerte/reset; cambio de objetivo obligatorio; recarga efectiva; ejecución de una ventana; recogida opcional; tránsito simple; resto no atribuido. En ventanas, movimiento o controles efectivos/intencionales se etiquetan como ejecución observada, con subtipo (transportar, acceder/interactuar, cruzar, responder, combatir). Si no hay movimiento ni controles, solo se etiqueta espera de mecanismo cuando existe latencia visible de espejo, guardián, peligro o jefe; lo demás queda como espera sin atribución. Una latencia puede solaparse con movimiento útil, por lo que tampoco equivale a inmovilidad mínima necesaria.

El tránsito simple es avance horizontal fuera de ventanas, sobre soporte fijo y sin salto/Abajo, daño, carga, maniobra vertical ni amenaza a menos de 64 px. Es desplazamiento observado, no una demostración de que pueda eliminarse. Maniobras sin objetivo identificable quedan aparte; no se cuentan automáticamente como desafío ni como paseo vacío.

Las bolsas son objetivos opcionales; se registra su recogida y solo se extiende a una excursión si hay evidencia de ese objetivo. No se inventa exploración opcional extensa en rutas cuyos planificadores persiguen metas obligatorias. La carga energética se separa como gestión de recursos con necesidad no establecida: el objetivo de salida no exige una reserva de 100, pero una parte de esa carga puede ser instrumental para sobrevivir.

La repetición cierta comprende muerte/reaparición y eventos de pérdida de progreso. Volver hacia la izquierda no es automáticamente repetición: puede ser la solución exigida. La distancia recorrida alejándose del siguiente hito se publica como descripción dentro de ventanas, sin equipararla a desperdicio o a decisión humana.

Se publicarán cobertura, tiempos por categoría/subtipo y ventanas con sus hitos finales. Las zonas que permanezcan ambiguas no se rellenan para alcanzar una nota. Los resultados evalúan actividad mecánica observada de controladores, no diversión, aprendizaje humano, eficiencia óptima ni duración humana.
