# Etiquetado semántico conservador de los 24 testigos de ronda 2

Se fija el 2026-09-08 antes de ejecutar este nuevo observador. No cambia unidades A–E, fronteras ni notas anteriores. Analiza la fuente 5ada… y los 24 testigos congelados, no jugadores humanos. Publica frames con atribución estrecha y frames ambiguos; no convierte estar en una cámara en actividad.

Las cinco categorías solicitadas son acción obligatoria, tránsito simple, espera necesaria, opcional y repetición. Cada frame obtiene una sola etiqueta cierta o un conjunto explícito de etiquetas posibles. Los límites superiores de categorías ambiguas **no se suman entre sí**: comparten frames. La cobertura cierta es una medida de lo que puede demostrar este método, no una cuota que deba alcanzarse.

## Etiquetas ciertas y estrechas

- **Acción obligatoria:** frame de una transición A/B/E acreditada por el clasificador común; activación correcta de un nodo de orden o sello todavía no activado que pertenece a una prueba obligatoria; toma/deposito de contrapeso. Son momentos de progreso, no toda la duración del puzle. Las rotaciones de espejo aisladas no se consideran progreso seguro porque pueden deshacer un ajuste correcto.
- **Tránsito simple observado:** desplazamiento horizontal hacia delante, sobre suelo fijo sólido, sin salto/Abajo, movimiento vertical, contrapeso, daño, stun, recogida o carga; fuera de B/C/D/E y sus márgenes de 32 px, lejos de llaves (64 px), enemigos/peligros/plataformas móviles (128 px) y puertas (64 px). Se excluyen áreas con suelo peligroso/no fijo o cuerpos sólidos por delante en las siguientes tres columnas. Esto describe un frame sin respuesta local de desafío observada, no prueba que se pueda borrar del recorrido ni predice todo peligro futuro.
- **Espera necesaria del mecanismo:** frame inmóvil y sin controles en que aumenta la estabilidad de un circuito de espejos ya correcto, hasta su umbral obligatorio de 30 frames. El retraso existe en la regla del motor. No afirma que permanecer inmóvil fuera la única estrategia, pues podría solaparse con movimiento. Esperas de guardianes/jefe/elevador no reciben automáticamente esta etiqueta.
- **Opcional:** instante de recogida de bolsa, ajena al predicado de éxito. No se imputa todo el desvío sin una ablación de ruta. Baterías, ajo y recargas se mantienen ambiguos porque pueden ser instrumentales para que esta ruta concreta sobreviva.
- **Repetición:** muerte/reaparición; frame de reset de orden o de caducidad que pierde progreso. No se llama repetición a volver por un lugar: podría ser un retorno obligatorio. No se deducen episodios completos de repetición de un único reset.

La prioridad de coincidencias es muerte/reset, progreso obligatorio, espera estable, bolsa y tránsito simple. Las coincidencias secundarias se registran cuando sea posible. Un frame puntual de recogida o progreso es una cota mínima; no una estimación de la duración total del esfuerzo.

## Ambigüedad conservada

Movimiento no atribuido: posible acción obligatoria, tránsito simple, opcional o repetición. Inmovilidad no atribuida: posible espera necesaria, opcional o repetición; si cambia un estado de mecanismo, también acción obligatoria. Carga energética: necesaria para esa ruta o exceso opcional, sin decidirlo por el nombre de la política. Se publica por separado el contexto de la ambigüedad (B/E, C/D, energía, otros).

Para estrechar esos intervalos haría falta ablación local de segmentos con conservación del estado posterior relevante, o anotación causal detallada. Acortar una espera cambia fases enemigas y daño; el fracaso de una reproducción tras borrarla no bastaría por sí solo para demostrar duración mínima global. No se inventan minutos activos cuando esa identificación no es posible.
