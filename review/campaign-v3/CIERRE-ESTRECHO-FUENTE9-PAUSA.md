# Cierre estrecho: pausa táctil, fuente 9

**Cerrados en el alcance ensayado el solapamiento de controles sobre la ayuda y la retención de entradas al ocultarlos. Se mantiene 8,80/10; no se realiza otra revisión amplia ni se concede una subida automática por corregir estos casos.**

Fuente evaluada: `round9/index.html`, SHA256 `d4b3b88064956af7b9c9460507aff83110f47ed4a2eb28394cacad69d87fee53`.

## Evidencia adversa preservada

Fuente 7: `round7/rotated-help-small-final.png` reproduce a 480×320 el texto de pausa parcialmente cubierto por controles tras rotación. La captura posterior al redibujado acredita el problema; el primer fotograma sin panel del banco no se considera un segundo defecto.

Fuente 8 oculta esos controles, pero `round8/held-controls-regression.json` conserva un fallo del ensayo DOM: derecha y salto sostenidos con dos punteros, pausa con un tercero, liberación en `body` mientras los controles están ocultos y reanudación. No se llama reproducción en un iPhone físico.

## Cambio exacto y contraste independiente

El diff completo 8→9 contiene una sola modificación: `setState` llama a `clearInput()` al entrar en `pause`. La comparación elimina esa inserción exacta y exige igualdad del archivo restante. No se modifica el mapa ni la física, pero **sí cambia intencionadamente el estado de entrada al pausar**; no se etiqueta como un cambio puramente visual.

`probe-pausa-controles-fuente89.cjs` ejecuta los manejadores de producción en un banco independiente que conserva los objetos de control y sus listeners. Son fixtures de eventos, sin CSS ni dispositivo físico:

- Fuente 8 conserva las entradas táctiles al pausar y reanudar tras liberar fuera del elemento.
- Fuente 9 las limpia, mantiene el reloj detenido durante pausa y permite moverse con una pulsación nueva.
- También se contrasta que la limpieza incluye las teclas mantenidas. Esto comprueba el alcance intencional de `clearInput`, no declara otro fallo físico de teclado distinto del caso táctil.

Resultado completo: `pausa-controles-fuente89.json`. El banco inicial necesitó añadir stubs de `classList.toggle` y `style.setProperty` para permitir `enableTouch`; ese error del banco no se atribuye al juego ni cambia sus manejadores.

## Captura y navegador

Se inspeccionó `round9/landscape-help-uncovered.png`: la ayuda completa queda descubierta; pausa y pantalla completa permanecen visibles arriba. Los controles inferiores que antes la tapaban ya no aparecen durante pausa.

Se inspeccionó el código actualizado de `tools/browser-integration.html` y se contrastó `round9/browser-integration.json`: **39 PASS**, tres documentos con el SHA exacto de fuente 9 y `errors:[]`. Incluye ocultar los controles, mantener accesible la pausa, restaurarlos al reanudar y la secuencia de dos controles sostenidos/liberación fuera que falla en fuente 8. La aserción comprueba que después de reanudar no persistan movimiento ni salto; no se limita a mirar `visibility`.

El informe es una ejecución DOM/storage/render del autor con eventos sintéticos. El revisor inspeccionó código, resultados y captura, y ejecutó por separado los fixtures de manejadores; no ejecutó esa sesión de navegador ni prueba aquí Safari/iPhone físico.

## Integridad y dictamen

`compatibilidad-fuente-round9.json` registra el diff exacto, la procedencia de los tres documentos y el cotejo de `round9/candidate-replays.json`: 24 snapshots completos idénticos, con los 24 hashes de controles iguales a la colección inmutable medida. Las rutas sin pausa no bastarían para probar el nuevo comportamiento, por lo que se contrastaron además los casos específicos anteriores. Se conserva también la continuidad y los 14 bordes del candidato en sus informes correspondientes.

No queda abierta esta comprobación finita de pausa/rotación/entradas. La nota previa se mantiene y no equivale a aceptación del usuario ni a alcanzar un objetivo numérico superior. No se requieren más iteraciones sobre este mismo caso sin una modificación o un fallo nuevo que las justifique.
