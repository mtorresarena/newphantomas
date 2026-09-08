# Qué debe cambiar al avanzar — campaña v3

Esta matriz describe el diseño; no sustituye los testigos y contrafactuales del
revisor. El número de pulsaciones, saltos o segundos no se interpreta como diversión.

| Sistema | Presentación | Variante avanzada | Respuesta que debe cambiar | Fallo y recuperación |
|---|---|---|---|---|
| Guardianes y sellos | N5 parte 1: un guardián, un sello, columna de refugio; permite aprender a cebarlo sin daño | Dos guardianes separados por una columna; alcance de carga de 160 píxeles | Cambiar de lado para atraer cada carga y esquivar su alcance mayor; esperar en la posición segura del primer ejemplo no activa ambos sellos | El guardián vuelve al origen tras fallar; no se consumen sellos ni llaves |
| Contrapesos | N5 parte 2: tomar abajo y llevar hacia delante hasta el hueco elevado | Piedra al fondo, balanza alta cerca de la entrada y escalera de retorno | Recorrer primero hacia la derecha, volver cargado hacia la izquierda y subir; ya no sirve caminar siempre hacia la salida | Abajo en la base devuelve el peso; morir devuelve el objeto a su origen. Los puzles anteriores siguen abiertos |
| Runas | Tres nodos, orden 2→1→3, nodo central elevado | Cuatro nodos, orden 3→1→4→2, cuarto nodo por encima de los demás | Cambiar el itinerario y la altura; el mismo orden de la introducción reinicia la secuencia | Orden incorrecto reinicia sin daño extra. Mantener Abajo no pulsa múltiples veces |
| Pulsadores con tiempo | N6 parte 1: dos pulsadores, diez segundos y apoyos visibles | Tres pulsadores, siete segundos, plataformas frágiles y polilla que fija un destino | Planear una bajada después de la subida, abandonar el destino de la polilla y cruzar dentro de la ventana | Expirar antes del umbral cierra y reinicia; cruzar a tiempo enclava. Llegar un frame tarde deja al jugador en el lado desde el que puede reintentar |
| Espejos | N7 parte 1: L→A→B→R, un ascenso y seguimiento visible del rayo | Tercer espejo alto a la derecha y receptor bajo; orientación final distinta | Seguir el trayecto y bajar el rayo hacia R; copiar las dos orientaciones del primer ejemplo deja el receptor apagado | Se conserva cada giro al alejarse; muerte restaura solo el puzle pendiente. No hay daño por probar una orientación |

## Tramos entre mecanismos

No se contabilizan como nuevas familias por cambiar el fondo:

- N5 alterna canales con apoyos y polillas, y tramos secos con obstáculos bajos,
  arañas y escarabajos. El escarabajo se puede esquivar o pisar; el pisotón es opcional.
- N6 alterna puentes horizontales/frágiles con ascensores verticales sobre ácido.
  Péndulos, cañones y vapor exigen coordinar el cruce. Las orillas permiten volver.
- N7 contrapone vigías de línea de tiro con columnas de cobertura; las polillas
  de las partes posteriores abandonan el punto de origen para atacar un destino fijado.
- N8 reúne plataformas frágiles en distintas alturas, polillas y vigías; luego
  enfrenta al jugador al segundo jefe. Su punto de control está fuera de la arena.

## Culminación: exactamente dos jefes

| Jefe | Progreso obligatorio | Cambios durante el combate | Recuperación |
|---|---|---|---|
| N4: Custodio | Cargar tres conductores por contacto | Esquivar sus ataques mientras se alcanzan tres alturas/posiciones | Arena cerrada en toda su altura, sin escapar de cámara |
| N8: Corazón del Barón | Seis saltos sobre el núcleo expuesto | Fase 1 alterna barridos altos/bajos; fase 2 fija un abanico hacia la posición marcada; fase 3 combina abanico, barrido y marca vertical. Cambiar altura antes del ataque y caer hacia el núcleo durante la apertura | Tras morir vuelve al punto anterior a la arena con los diez puzles resueltos; jefe restaurado a seis impactos, fase 1 y posición canónica |

El aviso del jefe dura 70 frames, seguido de ataque y una apertura de 150 frames.
Perder una apertura no bloquea el combate. La franja de ayuda indica cuándo saltar
encima; las marcas muestran los destinos fijados antes del ataque.

## Pruebas que distinguen diseño y evidencia

- `route-n*.json`: rutas de entrada real desde el origen; solo archivos con
  `complete:true` acreditan finalización.
- `route-n8-retry*.json`: morir en cada fase del jefe y volver a completar.
- `route-n*-retry-*.json`: pérdida de una vida tras progreso parcial en una familia,
  reaparición y recorrido hasta la meta, cuando `complete:true`.
- `rules.json`: casos aislados de bordes, sin atribuirles completabilidad.
- `browser-integration.json`: almacenamiento real y eventos DOM en navegador;
  punteros y mando sintéticos. No acredita hardware físico ni Safari iOS.
- La revisión independiente define A–E y los contrafactuales antes de observar las
  nuevas políticas. Las observaciones adversas y la primera nota se conservan.

## Excursiones de la ronda 3

- N5 parte 4: la llave de la cripta exige abandonar el suelo, subir por apoyos y regresar a la compuerta.
- N6 parte 2: el montacargas da acceso al balcón de mantenimiento; la llave abre la compuerta siguiente.
- N6 parte 4: avanzar hasta la escalera y regresar hacia el balcón alto de la llave; después cruzar el apoyo frágil sobre ácido y el péndulo hacia la compuerta. El apoyo inferior permite recuperar una caída. La llave no se obtiene manteniendo avance y salto.

Se usa el inventario original: recoger consume el objeto del mapa; abrir consume una llave. Morir conserva llaves recogidas y puertas abiertas dentro del nivel. Las pistas de estas galerías tienen prioridad en el HUD y en pausa mientras su puerta siga cerrada. Las galerías no añaden jefes ni sustituyen las diez pruebas de cada fase.
