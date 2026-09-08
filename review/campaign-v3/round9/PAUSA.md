# Cierre de la pausa táctil

Fuente 9: `d4b3b88064956af7b9c9460507aff83110f47ed4a2eb28394cacad69d87fee53`.

La captura `../round7/rotated-help-small-final.png` mostró movimiento y salto
encima del texto al girar a 480×320. `landscape-help-uncovered.png` muestra el
panel despejado: se ocultan esos mandos durante la pausa y siguen accesibles los
botones superiores. Al reanudar se recuperan los mandos.

El revisor pidió además sostener derecha y salto con dos punteros, pausar con
un tercero, soltar los primeros sobre el documento mientras los botones están
ocultos y reanudar. La prueba DOM falla sobre fuente 8 congelada:
`../round8/held-controls-regression.json`. Entrar en pausa ahora llama a
`clearInput()`, por lo que no depende de recibir pointerup/leave/cancel en un
elemento oculto. La misma prueba pasa sobre fuente 9.

`browser-integration.json` registra 39 comprobaciones superadas y los hashes de
los tres documentos cargados. Son eventos DOM sintéticos, no dedos sobre un
iPhone físico. `candidate-replays.json` conserva 24 replays idénticos frente a
fuente 6; `connected-replays.json` verifica continuidad con pausa real; `rules.json`
conserva 14 casos aislados. No se modifica la nota por sumar estas comprobaciones.
