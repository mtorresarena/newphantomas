# Revisión estrecha de fuente 8: pausa táctil

Fuente 8: `06a4ae938c68fa78e3a48d820ec58a35cfb49a3a2fb650d7cb23052239ee8103`. La nota 8,80 del informe previo se conserva; no se solicita ni emite una subida por esta corrección.

**Incidencia confirmada de fuente 7:** `round7/rotated-help-small-final.png`, inspeccionada por el revisor, muestra controles de dirección/Abajo/salto sobre parte del texto de pausa después de girar a 480×320. La captura posterior al redibujado reproduce una superposición real; no se confunde con el primer fotograma sin panel del banco con RAF detenido.

**Diff completo contrastado:** únicamente se añade la regla CSS que oculta y desactiva eventos de los cuatro controles de movimiento/acción bajo `body.game-paused`, se actualiza esa clase al dibujar la partida y se limpia al dibujar el título. Pausa y pantalla completa quedan fuera de la regla. `validar-delta-round8.cjs` elimina esas tres inserciones exactas y exige igualdad byte a byte de todo el resto con fuente 7; además compara los ocho mapas y CFG. Resultado PASS en `compatibilidad-fuente-round8.json`.

Se contrastó `round8/candidate-replays.json`: 24 entradas, todas con simulación idéntica, fuente evaluada 8 y fuente comparada 6. Los hashes de las 24 entradas coinciden con las copias inmutables clasificadas por el revisor. Esta evidencia mantiene la compatibilidad de la simulación; no prueba por sí sola CSS ni eventos táctiles.

**Cobertura de interfaz pendiente al registrar este documento:** inspección de la captura corregida, ocultación/restauración al pausar/reanudar y liberación de una entrada mantenida cuando su control desaparece. El último caso es pertinente porque `bindTouch` libera en pointerup/cancel/leave del elemento y `setState` no limpia `touch`: conviene comprobar la secuencia de mantener derecha o salto, pausar con otro puntero, soltar mientras está oculto y reanudar sin tocarlo otra vez. Es un riesgo acotado a contrastar, no un fallo declarado sin reproducción. La simple aserción de `visibility:hidden` no cubre esa secuencia.

La nueva evidencia visual y de entrada se incorporará sin alterar las fuentes ni borrar la incidencia previa.
