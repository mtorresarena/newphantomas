# Revisión adversarial acotada: enseñanza y enemigos

Fecha: 2026-09-08. Sin nueva nota. Motor congelado `candidate-score1.html`, SHA256 `57a34b6ffb17a65d897d4e0b6a832ddd9f77300673942a2865efde24ac3d2725`. Las capturas posteriores se identifican aparte. No se modifica juego ni assets.

## Resultado principal

No se encontró una política simple común que resuelva los puzles probados. **0 de 50 ramas** resuelven su objetivo en el límite de 900 frames: diez variantes × derecha, derecha con salto mantenido, derecha con salto pulsado, Abajo repetido y esperar. Esto descarta esas estrategias concretas, no todas las simplificaciones posibles ni demuestra aprendizaje humano.

Cada rama reproduce el prefijo original desde el inicio natural del nivel y después aplica controles reales. No usa teleport, restauración de snapshots, invulnerabilidad, curación ni eliminación de enemigos. Para guardianes se empieza antes del primer aviso; para los demás puzles, en la primera proximidad de uso de un nodo. Son pruebas parciales de desafío, no nuevas completaciones de nivel.

`probe-politicas-simples.cjs` y `politicas-simples.json` conservan preparación, coordenadas, duración, eventos y resultado. La duración es 900 frames o hasta muerte/solución. Mantener salto produce un solo flanco de pulsación; también se ensaya pulsarlo 10 de cada 12 frames para que el resultado negativo no dependa solo de esa diferencia de controles.

## Introducción → variante avanzada

| Familia | Introducción ensayada | Variante ensayada | Respuesta que cambia realmente | Resultado de las políticas simples |
|---|---|---|---|---|
| Sellos | N5, 1-1: un guardián/sello, carga88px | N5, 2-2: dos guardianes/sellos, carga160px | Cebar cada carga desde el lado adecuado, usar recuperación/retorno y reaccionar al alcance mayor. | Ninguna resuelve. Esperar al borde del aviso inicial es seguro en intro; en avanzada recibe daño. Saltar sin atender a la distancia tampoco basta. |
| Runas | N5, 1-2: orden2→1→3 | N5, 4-1: 3→1→4→2, nodo4 en fila3 | Cambia el recorrido vertical y el orden, no solo el número de pulsaciones. | Abajo repetido desde el primer nodo próximo genera450 reinicios; no progresa ni resuelve. Las otras políticas tampoco resuelven. |
| Contrapeso | N5, 2-1: piedra al inicio, hueco a la derecha en fila6 | N5, 3-2: piedra al fondo, hueco de retorno en fila3 | Transporte con menor velocidad y retorno ascendente por apoyos; ya no basta la ruta de ida del caso básico. | Ninguna resuelve. Repetir Abajo en la base alterna recogida/devolución; no sustituye transportar y encajar. El log de eventos no registra esas alternancias, por lo que no se cuantifican. |
| Temporizado | N6, 1-1: dos nodos,600frames | N6, 2-2: tres nodos,420frames | Orden, subida, bajada y llegada al umbral dentro de una ventana menor, con amenazas combinadas. | Abajo repetido genera activación y reinicio alternados,450eventos; nunca abre una solución permanente. Caminar/saltar sin secuencia tampoco resuelve. |
| Espejos | N7, 1-1: A/B y receptor superior | N7, 2-2: añadeC y receptor más bajo | Seguir otro trayecto del rayo y trasladarse entre orientaciones separadas. | Abajo repetido provoca450rotaciones en intro y442en avanzada, sin resolver. No basta alternar el primer espejo. |

Los testigos completos score1 ya resuelven las cuarenta pruebas con controles legales, y actúan como control positivo. Esta ronda selecciona la primera introducción y primera variante avanzada de cada familia; no afirma que haya ensayado cincuenta estrategias distintas en cada una de las cuarenta salas.

Hay instrucciones específicas en HUD/pista de pausa: orden de runas, temporizador, transporte y destino, carga del guardián y orientación de luz. La inspección de esos textos acredita disponibilidad, no que un jugador nuevo los comprenda. No se halló un texto específico que enseñe el pisotón opcional del escarabajo ni el momento exacto en que la polilla fija su destino. Eso se registra como límite de enseñanza, no como obligación de añadir un tutorial a cada enemigo.

## Señales y políticas de respuesta enemiga

`probe-respuestas-enemigas.cjs` / `respuestas-enemigas.json`: siete encuentros, tres respuestas cada uno, hasta240frames. Los prefijos llegan al primer aviso del actor o al primer acercamiento al escarabajo. El resto del mundo sigue activo: los golpes/muertes se informan para la rama completa y no se atribuyen automáticamente a ese único enemigo.

| Enemigo | Señal y transición observadas | Esperar / avanzar / respuesta dirigida | Qué acredita y qué no |
|---|---|---|---|
| Guardián intro | Prefijo N5 frame37; aviso55frames, carga40, recuperación110 y retorno. Actor dentro de cámara. | Esperar:0golpes; derecha:1. Un salto basado únicamente en el final del aviso recibe1. | Es una introducción segura fuera de los88px de carga; no se penaliza como trivialidad del nivel entero. |
| Guardián avanzado | Prefijo N5 frame2789; mismo aviso55, carga71frames por alcance160px, recuperación110. | Esperar:1golpe; derecha:2. La política genérica de saltar al final del aviso recibe1. **Saltar cuando llega a40px y mantener24frames evita el golpe:0.** | El alcance altera la respuesta; existe contrajuego por distancia. El fallo del salto temprano no demuestra daño inevitable. |
| Polilla intro | Prefijo N5 frame765; aviso55, picado50, regreso100. Fija destino al empezar el aviso. | Esperar:0golpes; derecha:1. Retirarse hacia atrás tras aviso provoca muerte sin golpe registrado, en el entorno de ácido. | La posición de los apoyos importa: «aléjate» no es una política universal segura. Esperar puede conservar un apoyo; los resultados no aíslan todo el daño al picado. |
| Polilla combinada N8 | Prefijo810; mismo ciclo55/50/100. | Esperar:1golpe; derecha:0; retirada simple provoca muerte en el tramo. | La combinación de geometría y amenaza cambia qué respuesta funciona, aunque no cambia la IA de la polilla. |
| Vigía intro N7 | Prefijo583; preparación45, fijación24, disparo y recuperación120. Un proyectil observado. | Esperar:0golpes; derecha:1; cambiar posición al fijar:0. | Esperar conserva también la inercia de entrada; no equivale a un jugador plantado en una posición artificial. Hay una respuesta viable al aviso. |
| Vigía combinado N8 | Prefijo4685; preparación45 y fijación24 verificadas. | Esperar o retirada genérica terminan en muerte dentro del tramo; derecha recibe1golpe y sobrevive. | Añadir un vigía al paso frágil no admite la misma receta que la introducción. No se infiere que el proyectil cause esas muertes: otras amenazas siguen activas. |
| Escarabajo N5 | Aproximación legal hasta frame926. | Esperar:2golpes; derecha:1. **Control de salto y alineación: pisotón en frame952,0golpes.** | Se acredita ahora el ataque opcional mediante un prefijo legal y26frames de control, no solo mediante estado preparado. |

El caso de salto reactivo está en `probe-guardia-salto.cjs`, con resultados separados: `guardia-salto-reactivo.json` conserva el intento con pulsación de un frame que recibe daño; `guardia-salto-reactivo-hold24.json` conserva la respuesta mantenida que lo evita. Se cambió una propiedad justificada del control —duración del salto—, no el motor ni la posición. Ambos resultados permanecen visibles.

En el pisotón, el contador heurístico de impulsos verticales registra dos: salto inicial y rebote del pisotón. **No son dos decisiones de salto.** Esta distinción no cambia el evento `stomp` real ni sus cero golpes. Las dos colisiones unitarias adicionales sí son fixtures explícitos: contacto descendente desde arriba elimina al escarabajo y rebota a vy−4 sin daño; contacto lateral mantiene al escarabajo vivo y resta18energía. Esos fixtures no se usan para probar accesibilidad.

Inspección estática: el vigía fija el objetivo al terminar preparación y exige línea de visión para emitir un proyectil que colisiona con geometría. La polilla fija el destino antes y atraviesa geometría durante el picado. El guardián fija dirección en el aviso y termina por pared, suelo o alcance. Son políticas mecánicas diferentes; el sprite o la lista de tipos no son la prueba principal.

## Defecto reproducido y cierre pendiente

**P2 — Aviso de polilla alta oculto por el HUD.** La sospecha estática se contrasta con `moth-warning-before.png`, tomada por el autor del replay real N7 cautious en frame5838 e inspeccionada por el revisor. La polilla aparece junto a la franja superior y su signo de aviso queda bajo «ORIENTA LA LUZ AL RECEPTOR». En score1, `drawCampaign` coloca el signo del atlas en `f.y−17`; una polilla de fila2 lo sitúa cerca de y15, y HUD/pista se dibujan después. El signo de peligro pierde legibilidad precisamente durante la anticipación.

El autor comunica un cambio posterior que coloca el aviso debajo de polillas altas, con mínimo y48 y fondo oscuro. Eso aún no convierte una captura anterior en prueba de corrección. Cierre verificable: repetir el mismo estado/encuadre y mostrar el aviso íntegro en ambos aspectos, sin cubrir ni quedar cubierto por las pistas, y comprobar al menos una polilla alta y otra de altura normal. No se necesita cambiar combate ni duración para corregir este problema.

## Límites y conclusión de esta ronda

No se reproduce un bloqueo permanente nuevo ni se encuentra una política simple que atraviese las dependencias de los puzles. Sí se confirma un defecto visual de anticipación y se mejora la evidencia de contrajuego del guardián y del pisotón opcional.

Los ensayos son mecánicos, con soluciones conocidas y ramas seleccionadas desde rutas sintéticas. No son pruebas de aprendizaje humano. No cubren todas las estrategias posibles, todas las fases temporales de cada amenaza ni todas las posiciones desde las que un jugador podría interpretar una pista. No se asigna una nueva puntuación antes del paquete final.
