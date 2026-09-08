# Observaciones durante la implementación, sin nota

Inspección independiente de `tools/campaign-runtime.js` y `tools/build-campaign.py` en construcción. No es revisión del candidato final ni aceptación de las correcciones anunciadas.

## Puerta temporizada al expirar con el jugador dentro

En el runtime con SHA256 `99bf57853dcddaac5fa6ce2d11bf8270b595cbc0b0bed93afb2dfe81e8790878`, el cierre seguro aplazaba la materialización de la puerta ocupada. Al vencer el temporizador dentro del hueco, `until` pasaba a cero y la puerta seguía abierta. Si el jugador avanzaba al lado derecho, el siguiente update cerraba la puerta detrás de él con `solved=false`.

Se reprodujo la transición en `probe-timed.cjs`; resultado guardado en `probe-timed.json`. Es un **montaje de estado de borde**, no un recorrido desde el inicio. La consecuencia global de bloqueo depende de las reglas de salida/retorno del candidato y no se ha demostrado en esa prueba.

Una interpretación inicial comunicada durante la inspección sugería que bastaría salir tarde para resolver. Se corrigió: al quedar `until=0`, esa rama ya no se ejecuta; el problema observado era atravesar dejando el puzle sin resolver y cerrar detrás.

El implementador comunica un cambio de regla posterior: alcanzar el umbral con parte del cuerpo antes del vencimiento enclava la puerta, junto con una pista que describe esa condición. Queda pendiente comprobar en el candidato: contacto justo antes, en el frame límite y después; ocupación/reentrada; muerte/reinicio; correspondencia entre pista, señal y condición real. La evidencia anterior se conserva y no se presenta como fallo vigente sin repetir la prueba sobre el candidato.

## Repetición de plantillas

El generador observado produce cuarenta puzles con cinco familias de reglas y variantes `advanced`. Los patrones de nodos y solución se repiten por desplazamiento; cambiar sala o número de instancia no añade una familia de decisión. Los cierres finales N5 peso, N6 tiempo y N7 espejo sí se distinguen estructuralmente.

La revisión final debe medir qué decisiones nuevas aporta cada repetición y si sus combinaciones cambian la respuesta del jugador. No se concede variedad equivalente a cuarenta puzles distintos por contar cuarenta puertas. Tampoco se concluye monotonía humana sin pruebas humanas.

## Límites

No se ha modificado el juego ni sus assets. Se informó de estos puntos al implementador mientras avanzaba el código. No se puntúa una versión en movimiento ni se aprueba una promesa de corrección.
