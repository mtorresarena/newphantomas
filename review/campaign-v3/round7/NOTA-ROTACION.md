# Pausa en tamaño pequeño y giro

Se usa el prefijo legal de N5, frame 200, y la tecla P. La ayuda larga de carga
y pisotón aparece completa a 320×480. La rotación a 480×320 no debe cambiar
frame, posición, energía ni estado de pausa.

El banco de replays desactiva RAF para detener la simulación. Las primeras
capturas `rotated-help-small.png` y `rotated-help-small-redrawn.png` no acreditan
el dibujo tras girar: el ajuste del lienzo de producción se ejecuta con un retardo
de 150 ms y borra su contenido; el RAF desactivado no lo repinta. No se atribuye
ese resultado al juego con su bucle normal.

La herramienta visual ahora repinta a los 250 ms después de resize, sin avanzar
la simulación. El resultado válido se registra en `rotation-help-final.json`
y `rotated-help-small-final.png`. Es una prueba de navegador con dimensiones
simuladas, no un dispositivo físico. La producción conserva el mismo hash de
fuente 7 y la nota independiente sigue siendo 8,80.
