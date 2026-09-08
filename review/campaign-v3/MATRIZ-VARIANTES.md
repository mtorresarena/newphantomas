# Variantes de las fuentes 5 y 6

Esta matriz sustituye la descripción simplificada de las variantes avanzadas de
MATRIZ-DISENO.md. No es una puntuación ni acredita por sí sola que el juego sea
divertido. Las fuentes anteriores y sus revisiones adversas se conservan.

| Familia | Introducción y práctica | Desarrollo | Culminación |
|---|---|---|---|
| Cargas sobre sellos | Un guardián y después dos; columna central como refugio | Parte 3: segundo guardián carga hacia la izquierda. Parte 4: el primero carga hacia la izquierda y el segundo hacia la derecha | Parte 5: atraer ambos hacia el centro, cada uno a su sello; cambiar de lado y usar la columna |
| Contrapesos | Recoger abajo y subir hacia la salida; después volver cargado hacia la entrada | Recorrido de retorno ascendente, con escalera y amenaza en el suelo | Subir primero sin peso hasta la corona; regresar cargado descendiendo hasta la balanza izquierda |
| Secuencias | Tres runas, orden 2–1–3; cuarta runa elevada y orden 3–1–4–2 | Partes 4 y 5: empezar por la runa elevada y recorrer 4–2–1–3 | Combinar el itinerario aprendido con enemigos y cruces; no se cuenta cada pulsación como puzle nuevo |
| Relojes | Dos pulsadores; luego tres y plataformas frágiles | Parte 3: alto → fondo bajo → centro alto. Parte 4: empezar en el fondo, regresar a la izquierda arriba y volver a la derecha | Parte 5: ascenso de regreso y vuelta hacia la salida; después preparar el ascensor antes de arrancar el reloj y descender sobre ácido |
| Luz | Dos espejos, luego tres; observar el rayo | Parte 3: circuito en S. Parte 4: fuente a la derecha y receptor a la izquierda | Circuito por debajo y retorno ascendente; después cuatro espejos con receptor dentro del circuito |

En los ocho circuitos de luz, cada geometría tiene una única solución. En la
fuente 6 los espejos empiezan con orientaciones mezcladas: girarlos todos una vez
solo funciona en la introducción de dos espejos. Las letras A–D permiten relacionar
las pistas con los elementos visibles. No hace falta girar los que ya están bien.

Los tiempos de los relojes cambian según el trayecto: 11 s en la parte 3, 13 s en
la parte 4, 12 s en el ascenso final y 7 s en el descenso final. No se presenta
reducir todos los plazos como sinónimo de aumentar dificultad; el recorrido y la
preparación cambian. Cada cámara mantiene un punto desde el que repetirla.

N8 vuelve a combinar familias ya aprendidas y culmina en el Corazón del Barón.
No se promete una familia completamente nueva en cada habitación. Hay exactamente
dos jefes, Custodio en N4 y Corazón en N8, con objetivos y ataques diferentes.

La enseñanza contextual añade que el escarabajo puede pisarse desde arriba. Es
una alternativa al rodeo, no una baja obligatoria para inflar la densidad medida.

## Dependencias añadidas en fuentes 10–12

Esta tabla actualiza tres cámaras de la matriz anterior, sin cambiar el total
de diez pruebas por fase ni las cinco familias. El reloj 5-1 pasa a 11 segundos;
el 5-2 mantiene su reto de ascensor/descenso. El circuito final requiere dos
destinos secuenciales, por lo que ya no se describe su solución completa como
una sola configuración estática de cuatro espejos.

| Cámara | Dependencia y consecuencia | Recuperación |
|---|---|---|
| N6 3-2 · Balanza de dos alturas | Un solo peso en 2 despliega apoyos; accionar el cerrojo 3 los fija; recuperar ese mismo peso y llevarlo a 4 resuelve. | Retirada temprana retrae apoyos; puede reponerse o devolverse a base. Muerte reinicia peso y apoyos si la prueba estaba pendiente. |
| N6 5-1 · Reloj de las pasarelas | 1 despliega la subida; 2 retira un apoyo bajo y habilita otros altos; 3 abre la salida, que debe cruzarse antes del plazo. Un salto directo a 2 sigue siendo alternativa válida. | Suelo seguro de regreso; orden erróneo o caducidad restituye la configuración. Cuenta atrás siempre visible. |
| N7 5-2 · Dos destinos de la luz | Resolver L→R almacena energía y despliega apoyos; alcanzar E elevado permite desviar el mismo haz hacia S. Redirección binaria final, no otro circuito complejo independiente. | Interrumpir el haz no borra R ya almacenado. Muerte reinicia ángulos, receptores y apoyos del reto pendiente. |

Las pistas progresivas conservan información de control al principio y reservan
el procedimiento completo para una petición explícita. El golpe y los cambios
de fase de los jefes añaden feedback visual/sonoro; no cambian su resistencia.

## Evidencia y límites

Los testigos de `round6` indican su fuente y solo valen como completados con
`complete:true`. Los recorridos de búsqueda fallidos se conservan. Las pruebas
contrafactuales del revisor separan ejecución, tránsito, espera, recarga y tiempo
no atribuido. La duración y la cantidad de mecanismos no sustituyen una prueba
humana; esta revisión está limitada a pruebas técnicas.
